import { admin } from './common.js';
import { getAccount } from './cache.js';
import { loadCharacterById, saveEncounterData, getEncounterData } from './api.js';
import { sendPingData, sendEncounterCharacterPos, sendEncounterCharacterColor, sendEncounterCharacterVisible } from './socket.js';

var canvas;
var ctx;
var pings = [];
var pingMarkers = {};
var characters = {};
var mapDimensions = { 'x': 0, 'y': 0 };
var fogOfWarId = null;
var fogOfWarPos = null;
var updateFogOfWarPos = true;
var inputModeLine = false;
var characterSelected = null;
let characterPosBeforeClick = null;
let isEdit = false;
var rightClick = false;
var characterUpdated = false;
var clicked, dragStart, dragged, characterDragStart, measuring;
var characterRef = {};

export var initialized = false;

function updateInitialized() {
	initialized = !initialized;
}

function redraw(){
	// Clear the entire canvas
	var p1 = ctx.transformedPoint( 0, 0 );
	var p2 = ctx.transformedPoint( canvas.width, canvas.height );
	ctx.clearRect( p1.x, p1.y, p2.x-p1.x, p2.y-p1.y );

	// Map background
	ctx.fillStyle = 'white';
	ctx.fillRect( 0, 0, mapDimensions.x, mapDimensions.y )
	drawGrid();



	// process characters
	for ( var characterId in characters ) {
		addCharacterIcon( characterId );
	}

	// FOG OF WAR
	for ( var characterId in characters ) {
		if ( fogOfWarId == characterId ) {
			if ( admin ) {
				ctx.fillStyle = "#333333aa";
			} else {
				ctx.fillStyle = "black";
			}
			if ( updateFogOfWarPos ) {
				fogOfWarPos = { 
					'x': characters[characterId].x,
					'y': characters[characterId].y
				}
			}
			ctx.beginPath();
			ctx.moveTo( 0, 0 );
			ctx.lineTo( mapDimensions.x, 0 );
			ctx.lineTo( mapDimensions.x, mapDimensions.y );
			ctx.lineTo( 0, mapDimensions.y );
			ctx.lineTo( 0, 0 );
			ctx.closePath();

			ctx.arc(fogOfWarPos.x, fogOfWarPos.y, 100, 0, 2 * Math.PI, true);
			ctx.closePath();
			ctx.fill();
			break;
		}
	}


	// Process pings
	// THIS NEEDS TO BE LAST SO ITS NOT COVERED
	for ( var index in pings ) {
		if ( pings[index].radius++ == 100 ) {
			pings.splice(index, 1);
		} else {
			drawPingCircle( pings[index] )
		}
	}

	for ( let pingAccountId in pingMarkers ) {
		addPingMarker( pingAccountId );
	}
}

function loadCanvas( mapData ) {
	pingMarkers = {}
	pings = [];
	$( '#encounter-canvas' ).remove();
	if ( mapData.id ) {
		$( '#encounter__wrapper' ).data( 'id', mapData.id );
	} else {
		$( '#encounter__wrapper' ).removeData();
	}
	if ( mapData.edit ) {
		if ( admin ) {
			$( '#encounter-save__wrapper' ).removeClass( 'hidden' );
		} else {
			$( '#encounter-save__wrapper' ).addClass( 'hidden' );
		}
		$( '#encounter-live__wrapper' ).addClass( 'hidden' );
		$( '#encounter-name__wrapper' ).removeClass( 'live' ).addClass( 'edit' );
	} else {
		if ( admin ) {
			$( '#encounter-live__wrapper' ).removeClass( 'hidden' );
		} else {
			$( '#encounter-live__wrapper' ).addClass( 'hidden' );
		}
		$( '#encounter-save__wrapper' ).addClass( 'hidden' );
		$( '#encounter-name__wrapper' ).removeClass( 'edit' );
		if ( mapData.active ) {
			$( '#encounter-name__wrapper' ).addClass( 'live' );
			$( '#btn__encounter-live' ).addClass( 'active' );
		} else {
			$( '#encounter-name__wrapper' ).removeClass( 'live' );
			$( '#btn__encounter-live' ).removeClass( 'active' );
		}
	}
	if ( mapData.name ) {
		$( '#encounter-name' ).val( mapData.name );
	} else {
		$( '#encounter-name' ).val( '' );
	}
	clearCharacterSelectedInfo();
	characterSelected = null;

	if ( Object.keys( mapData ).length === 0 ) {
		$( '#encounter__wrapper' ).addClass( 'hidden' );
		$( '#no_encounter__wrapper' ).removeClass( 'hidden' );
		return;
	} else {
		$( '#encounter__wrapper' ).removeClass( 'hidden' );
		$( '#no_encounter__wrapper' ).addClass( 'hidden' );
	}

	if ( admin ) {
		$( '.encounter-characters__select>optgroup>option' ).each(function() {
			$( this ).prop( 'disabled', Object.keys( characters ).includes( $( this ).val() ) );
		});
	} else {
		fogOfWarId = getAccount();
	}
	canvas = document.createElement( 'canvas' );
	let canvasSize = getEncounterCanvasSize( true );
	canvas.width = canvasSize.width;
	canvas.height = canvasSize.height;
	let centerXOffset = (canvas.width - mapData.dimensions.x) / 2;
	ctx = canvas.getContext('2d');
	$( canvas ).attr( 'id', 'encounter-canvas' )
		.attr( 'tabindex', '1' );
	$( '#encounter-canvas__wrapper' ).prepend( canvas );

	characters = mapData.characters;
	for ( let characterId in characters ) {
		if ( characterRef[characterId] ) {
			characterRef[characterId].color = characters[characterId].color;
		}
	}
	mapDimensions = mapData.dimensions;
	$( '#map-dimensions-x__input' ).val( mapDimensions.x );
	$( '#map-dimensions-y__input' ).val( mapDimensions.y );
	$( '#map-dimensions-x-feet__input' ).val( Math.round( mapDimensions.x / 4 ) );
	$( '#map-dimensions-y-feet__input' ).val( Math.round( mapDimensions.y / 4 ) );

	trackTransforms(ctx);
	redraw();
	
	var lastX=canvas.width/2, lastY=canvas.height/2;
	var startEvent = 'mousedown';
	var moveEvent = 'mousemove';
	var endEvent = 'mouseup';
	if ( $( '#story__wrapper' ).hasClass( 'iPhone' ) ){
		startEvent = 'touchstart';
		moveEvent = 'touchmove';
		endEvent = 'touchend';
	}
	// right click can clear fog of war for admin
	canvas.addEventListener( 'contextmenu', function( e ){
		e.stopPropagation();
		e.preventDefault();
		if ( admin && fogOfWarId ) {
			fogOfWarId = null;
			redraw();
		}
		clearCharacterSelectedInfo();
		characterSelected = null;
		rightClick = true;
	});
	canvas.addEventListener( startEvent, function( evt ){
		clicked = true;
		document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
		var xPos = evt.offsetX;
		var yPos = evt.offsetY;
		lastX = xPos || (evt.pageX - canvas.offsetLeft);
		lastY = yPos || (evt.pageY - canvas.offsetTop);
		if ( $( '#story__wrapper' ).hasClass( 'iPhone' ) ) {
			xPos = evt.originalEvent.touches[0].pageX;
			yPos = evt.originalEvent.touches[0].pageY;
		}
		characterDragStart = getCharacterAtPos( xPos, yPos );
		if ( characterSelected && characterDragStart && characterSelected != characterDragStart ) {
			characterUpdated = true;
			characterSelected = characterDragStart;
			updateCharacterSelectedInfo( characterSelected );
		} else if ( !characterSelected && characterDragStart ) {
			characterUpdated = true;
		} else {
			characterUpdated = false;
		}
		if ( characterDragStart ) {
			if ( admin ) {
				fogOfWarId = characterDragStart;
			} else if ( getAccount() == characterDragStart ) {
				updateFogOfWarPos = false;
			} else {
				characterDragStart = false;
			}
		}
		if ( characterDragStart ) {
			characterPosBeforeClick = { 
				'x': characters[characterDragStart].x,
				'y': characters[characterDragStart].y
			}
		} else {
			dragStart = ctx.transformedPoint(lastX,lastY);
		}

		dragged = false;
		redraw();
	}, false);
	canvas.addEventListener( moveEvent, function( evt ){
		var xPos = evt.offsetX;
		var yPos = evt.offsetY;
		lastX = xPos || (evt.pageX - canvas.offsetLeft);
		lastY = yPos || (evt.pageY - canvas.offsetTop);

		var mouseCoords = toCanvasCoords( xPos, yPos );
		if ( $( '#story__wrapper' ).hasClass( 'iPhone' ) ) {
			mouseCoords = toCanvasCoords( evt.originalEvent.touches[0].pageX, evt.originalEvent.touches[0].pageY );
		}

		if ( measuring ) {

			return;
		}
		// We want to show character info on mouseover when we hover if we dont have one selected
		let hoverCharacter = getCharacterAtPos( xPos, yPos );
		if ( !characterSelected ) {
			if ( hoverCharacter && !characterDragStart ) {
				updateCharacterSelectedInfo( hoverCharacter );
			} else {
				let hoverPing = getMarkerAtPos( xPos, yPos );
				if ( hoverPing && !characterDragStart ) {
					updatePingSelectedInfo( hoverPing );
				}
				if ( !hoverCharacter && !hoverPing ) {
					clearCharacterSelectedInfo();
				}
			}
		}

		if ( characterDragStart ) {
			mouseCoords = fixCharacterMoveMouseCoords( mouseCoords );
			var needsRedraw = false;
			if ( characters[characterDragStart].x != mouseCoords.x ) {
				characters[characterDragStart].x = mouseCoords.x;
				needsRedraw = true;
			}
			if ( characters[characterDragStart].y != mouseCoords.y ) {
				characters[characterDragStart].y = mouseCoords.y;
				needsRedraw = true;
			}
			if ( needsRedraw ) {
				redraw();
			}
		} 
		if ( characterDragStart || hoverCharacter ) {
			$( '#encounter-canvas' ).addClass( 'move' );
		} else {
			$( '#encounter-canvas' ).removeClass( 'move' );
		}
		dragged = true;
		if ( dragStart ){
			var pt = ctx.transformedPoint(lastX,lastY);
			var updatedX = pt.x-dragStart.x;

			var currentOffsetX = ctx.getTransform().e + updatedX;

			if ( currentOffsetX + updatedX < ( mapDimensions.x - 50 ) / -1  ) {
				updatedX = 0;
			} else if ( currentOffsetX + updatedX > canvas.width - 50 ) {
				updatedX = 0;
			}

			var updatedY = pt.y-dragStart.y;
			var currentOffsetY = ctx.getTransform().f + updatedY;

			if ( currentOffsetY + updatedY < ( mapDimensions.y - 50 ) / -1  ) {
				updatedY = 0;
			} else if ( currentOffsetY + updatedY > canvas.height - 50 ) {
				updatedY = 0;
			}

			ctx.translate( updatedX, updatedY );
			redraw();
			return;
		}
		mouseCoords = keepMouseCoordsInMap( mouseCoords );
		$( '#cursor-pos' ).val( Math.round(mouseCoords.x) + ', ' + Math.round(mouseCoords.y) );
	}, false);
	canvas.addEventListener( endEvent, mouseupEvent, false );
	canvas.addEventListener( 'mouseleave', function( evt ) {
		if ( clicked ) {
			mouseupEvent( evt );
		}
	}, false );
	canvas.addEventListener( 'keydown', function(e) {
		console.log( e );
		console.log( e.offsetX );
		if ( e.which == 16 ) {
			measuring = true;
		}
	});
	canvas.addEventListener( 'keyup', function(e) {
		if ( e.which == 16 ) {
			measuring = null;
		}
	});

	var scaleFactor = 1.1;
	var zoom = function(clicks){
		var pt = ctx.transformedPoint(lastX,lastY);
		var factor = Math.pow(scaleFactor,clicks);

		ctx.translate(pt.x,pt.y);
		var currentScaleFactor = ctx.getTransform().a;
		if ( currentScaleFactor * factor >= 0.25 && currentScaleFactor * factor <= 1.5 ) {
			ctx.scale(factor,factor);
		}
		ctx.translate(-pt.x,-pt.y);
		redraw();
	}

	var handleScroll = function(evt){
		var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
		if (delta) zoom(delta);
		return evt.preventDefault() && false;
	};
	canvas.addEventListener('DOMMouseScroll',handleScroll,false);
	canvas.addEventListener('mousewheel',handleScroll,false);

	if ( pings.length > 0 ) {
		setTimeout(function(){
			showPings();
		}, 1000)
	}


	ctx.translate( centerXOffset, 0 );
	redraw();
}

function mouseupEvent( evt ) {
	clicked = false;
	dragStart = null;
	var mouseCoords = toCanvasCoords( evt.offsetX, evt.offsetY )

	if ( !dragged ) {
		if ( !characterUpdated ) {
			if ( $( '#story__wrapper' ).hasClass( 'iPhone' ) ) {
				mouseCoords = toCanvasCoords( evt.originalEvent.touches[0].pageX, evt.originalEvent.touches[0].pageY );
			}

			if ( rightClick ) {
				rightClick = false;
			} else {
				// we dont want to send pings if we're editing a (new) map or we click outside the map dimensions
				if ( mouseCoords.x >=0 && mouseCoords.x <= mapDimensions.x &&
						mouseCoords.y >= 0 && mouseCoords.y <= mapDimensions.y && !isEdit) {
					sendPingData({'center' : mouseCoords});
				}
			}
		}
	} else if ( characterDragStart ) {
		if ( !updateFogOfWarPos ) {
			updateFogOfWarPos = true;
			redraw();
		}

		mouseCoords = fixCharacterMoveMouseCoords( mouseCoords );
		// likewise, if we're editing, dont send socket update for characters, just move them
		if ( isEdit ) {
			isEdit = true;
			updateEncounterCharacterPos({
				'character_id': characterDragStart,
				'coords': mouseCoords 
			});
		} else {
			isEdit = false;
			sendEncounterCharacterPos( mouseCoords, characterDragStart, characters[characterDragStart].character_id );
		}
	}
	if ( characterDragStart ) {
		characterSelected = characterDragStart;
	}
	characterDragStart = null;
}

var ping = function( pingData ) {
	var radius = 1;
	if ( pingData.center == undefined ) {
		return;
	}
	pingMarkers[pingData.account] = pingData.center;
	pingMarkers[pingData.account]['color'] = characterRef[pingData.account] ? characterRef[pingData.account].color : pingData.color;
	pings.push({ 
		'center': pingData.center,
		'radius': 1,
		'color' : pingMarkers[pingData.account]['color']
	});

	if ( $( '#encounter-window__wrapper' ).hasClass( 'active' ) ) {
		if ( pings.length == 1 ) {
			showPings();
		}
	}
}

var drawGrid = function() {
	var scaleFactor = ctx.getTransform().a;
	ctx.strokeStyle = '#666666'
	var gridsize = Math.round( (30 / scaleFactor) / 20 ) * 20;
	for ( var xPos = gridsize / 2; xPos < mapDimensions.x; xPos += gridsize / 2 ) {
		if ( xPos % gridsize == 0 ) {
			ctx.lineWidth = 1 / scaleFactor;
		} else {
			ctx.lineWidth = 0.5 / scaleFactor;
		}
		ctx.beginPath();
		ctx.moveTo(xPos, 0);
		ctx.lineTo(xPos, mapDimensions.y);
		ctx.stroke();
	}
	for ( var yPos = gridsize / 2; yPos < mapDimensions.y; yPos += gridsize / 2 ) {
		if ( yPos % gridsize == 0 ) {
			ctx.lineWidth = 1 / scaleFactor;
		} else {
			ctx.lineWidth = 0.5 / scaleFactor;
		}
		ctx.beginPath();
		ctx.moveTo(0, yPos);
		ctx.lineTo(mapDimensions.x, yPos);
		ctx.stroke();
	}
	$( '#grid-scale' ).val( (gridsize/4) + " feet");
}

var showPings = function() {
	(function pingLoop(){
		if ( pings.length == 0 ) {
			setTimeout(function(){
				redraw();
			});
			return;
		}
		setTimeout(function(){
			redraw();
			pingLoop();
		}, 10);
	})();
}

var drawPingCircle = function( pingData ) {
	var scaleFactor = ctx.getTransform().a;
	ctx.beginPath();
	ctx.arc( pingData.center.x, pingData.center.y, (pingData.radius / scaleFactor), 0, 2 * Math.PI, false);
	ctx.lineWidth = 3 / scaleFactor;
	ctx.strokeStyle = pingData.color;
	ctx.stroke();
}

function addCharacterIcon( characterId ) {
	var characterData = characters[characterId];
	if ( admin || characterData.visible || characterId == getAccount() ) {
		var scaleFactor = ctx.getTransform().a;
		ctx.beginPath();
		ctx.arc(characterData.x, characterData.y, (15 / scaleFactor), 0, 2 * Math.PI, false);
		if ( characterData.color == null || characterData.color == undefined ) {
			characterData.color = generateRandomColor();
		}
		ctx.fillStyle = characterData.color;
		
		if ( !characterData.visible ) {
			ctx.fillStyle = ctx.fillStyle += "77";
		}
		ctx.fill();
	}
}

function addPingMarker( pingAccountId ) {
	var pingMarker = pingMarkers[pingAccountId];
	var scaleFactor = ctx.getTransform().a;
	var arcWidth = (5 / scaleFactor);
	var pointHeight = ( 10 / scaleFactor);
	ctx.beginPath();
	ctx.arc(pingMarker.x, pingMarker.y - pointHeight, arcWidth, 0, 2 * Math.PI, false);
	ctx.fillStyle = pingMarker.color;
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(pingMarker.x + arcWidth, pingMarker.y - pointHeight);
	ctx.lineTo(pingMarker.x, pingMarker.y);
	ctx.lineTo(pingMarker.x - arcWidth, pingMarker.y - pointHeight);
	ctx.moveTo(pingMarker.x + arcWidth, pingMarker.y - pointHeight);
	ctx.fill();
	ctx.closePath();
}

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx){
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var xform = svg.createSVGMatrix();
	ctx.getTransform = function(){ return xform; };
	
	var savedTransforms = [];
	var save = ctx.save;
	ctx.save = function(){
		savedTransforms.push(xform.translate(0,0));
		return save.call(ctx);
	};
	var restore = ctx.restore;
	ctx.restore = function(){
		xform = savedTransforms.pop();
		return restore.call(ctx);
	};

	var scale = ctx.scale;
	ctx.scale = function(sx,sy){
		xform = xform.scaleNonUniform(sx,sy);
		return scale.call(ctx,sx,sy);
	};
	var rotate = ctx.rotate;
	ctx.rotate = function(radians){
		xform = xform.rotate(radians*180/Math.PI);
		return rotate.call(ctx,radians);
	};
	var translate = ctx.translate;
	ctx.translate = function(dx,dy){
		xform = xform.translate(dx,dy);
		return translate.call(ctx,dx,dy);
	};
	var transform = ctx.transform;
	ctx.transform = function(a,b,c,d,e,f){
		var m2 = svg.createSVGMatrix();
		m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
		xform = xform.multiply(m2);
		return transform.call(ctx,a,b,c,d,e,f);
	};
	var setTransform = ctx.setTransform;
	ctx.setTransform = function(a,b,c,d,e,f){
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(ctx,a,b,c,d,e,f);
	};
	var pt  = svg.createSVGPoint();
	ctx.transformedPoint = function(x,y){
		pt.x=x; pt.y=y;
		return pt.matrixTransform(xform.inverse());
	}
}

function toCanvasCoords( pageX, pageY ) {
    var transformation = ctx.getTransform();
    let x = (pageX - transformation.e) / transformation.a;
    let y = (pageY - transformation.f) / transformation.d;
    return toPoint(x, y);
}
function toPoint(x, y) {
  return { x: x, y: y }
}

function getCharacterAtPos( pageX, pageY ) {
	var mouseCoords = toCanvasCoords( pageX, pageY );
	var offset = 10;
	var scaleFactor = 10 / ctx.getTransform().a + offset;
	var idMatch = null
	for ( var characterId in characters ) {
		if (mouseCoords.x > (characters[characterId].x - scaleFactor) && 
				mouseCoords.x < (characters[characterId].x + scaleFactor) &&
				mouseCoords.y > (characters[characterId].y - scaleFactor) &&
				mouseCoords.y < (characters[characterId].y + scaleFactor)) {
			idMatch = characterId;
		}
	}

	if ( admin ) {
		return idMatch;
	} else if ( fogOfWarPos ) {
		let offsetVector = {
			'x' : mouseCoords.x - fogOfWarPos.x,
			'y' : mouseCoords.y - fogOfWarPos.y
		}
		return getVectorLength( offsetVector ) < 100 ? idMatch : null;
	}
	return idMatch;
}
function getMarkerAtPos( pageX, pageY ) {
	var mouseCoords = toCanvasCoords( pageX, pageY );
	var offset = 10;
	var scaleFactor = 5 / ctx.getTransform().a + offset;
	var idMatch = null
	for ( var markerAccountId in pingMarkers ) {
		if (mouseCoords.x > (pingMarkers[markerAccountId].x - scaleFactor) && 
				mouseCoords.x < (pingMarkers[markerAccountId].x + scaleFactor) &&
				mouseCoords.y > (pingMarkers[markerAccountId].y - scaleFactor) &&
				mouseCoords.y < (pingMarkers[markerAccountId].y + scaleFactor)) {
			return markerAccountId;
		}
	}
}

function fixCharacterMoveMouseCoords( mouseCoords ) {
	if ( !admin ) {
		mouseCoords = keepMouseCoordsInFOWView( mouseCoords );
	}

	mouseCoords = keepMouseCoordsInMap( mouseCoords );

	mouseCoords.x = Math.round(mouseCoords.x);
	mouseCoords.y = Math.round(mouseCoords.y);

	return mouseCoords;
}

function getVectorLength( vector ) {
	return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

function keepMouseCoordsInFOWView( mouseCoords ) {
	let fogOfWarSize = 100;
	let offsetVector = {
		'x'	: mouseCoords.x - characterPosBeforeClick.x,
		'y'	: mouseCoords.y - characterPosBeforeClick.y
	}
	if ( Math.abs(getVectorLength( offsetVector )) > fogOfWarSize  ) {
		offsetVector = normalizeVectorToLength( offsetVector, fogOfWarSize );
	}
	mouseCoords = {
		'x'	: characterPosBeforeClick.x + offsetVector.x,
		'y' : characterPosBeforeClick.y + offsetVector.y
	}
	return mouseCoords;
}

function normalizeVectorToLength( vector, size ) {
	let vectorLength = Math.abs(getVectorLength( vector ));
	vector.x = (vector.x / vectorLength) * size;
	vector.y = (vector.y / vectorLength) * size;
	return vector;
}

function keepMouseCoordsInMap( mouseCoords ) {
	if ( mouseCoords.x < 0 ) {
		mouseCoords.x = 0;
	} else if ( mouseCoords.x > mapDimensions.x ) {
		mouseCoords.x = mapDimensions.x;
	}
	if ( mouseCoords.y < 0 ) {
		mouseCoords.y = 0;
	} else if ( mouseCoords.y > mapDimensions.y ) {
		mouseCoords.y = mapDimensions.y;
	}
	return mouseCoords;
}

function updateCharacterSelectedInfo( characterDragStart ) {
	let characterAccountId = characterDragStart;
	$( '#encounter-selected__name' ).html( characters[characterDragStart].name );
	$( '.encounter-view-flex__container' ).remove();

	const characterId = characterDragStart;
	let encounterFlexWrapper = $( '#encounter-selected__wrapper-flex__wrapper' );

	let flexContainer = document.createElement( 'div' );
	let flexLeft = document.createElement( 'div' );
	if ( admin ) {
		if ( $( '.encounter-visible__wrapper' ).length ) {
			$( '.encounter-character-visible' ).prop( 'checked', characters[characterId].visible )
				.off( 'change')
				.on( 'change', function() {
					if ( isEdit ) {
						updateEncounterCharacterVisible({
							'character_id' 	: characterId,
							'visible' 		: $( this ).prop( 'checked' ) 
						});
					} else {
						sendEncounterCharacterVisible( $( this ).prop( 'checked' ) , characterId, characters[characterId].character_id );
					}
				});;
		} else {
			let visibleWrapper = document.createElement( 'div' );
			let visibleLabel = document.createElement( 'label' );
			$( visibleLabel ).text( 'Visible:' );
			let visible = document.createElement( 'input' );
			$( visible ).addClass( 'encounter-character-visible' )
				.prop( 'type', 'checkbox' )
				.prop( 'checked', characters[characterId].visible )
				.on( 'change', function() {
					if ( isEdit ) {
						updateEncounterCharacterVisible({
							'character_id' 	: characterId,
							'visible' 		: $( this ).prop( 'checked' ) 
						});
					} else {
						sendEncounterCharacterVisible( $( this ).prop( 'checked' ) , characterId, characters[characterId].character_id );
					}
				});
			$( visibleWrapper ).addClass( 'encounter-visible__wrapper' )
				.append( visibleLabel )
				.append( visible );
			$( flexLeft ).append( visibleWrapper );
		}
	}
	$( '.encounter-color__wrapper' ).remove();
	if ( admin || getAccount() == characterId ) {
		let colorWrapper = document.createElement( 'div' );
		let colorLabel = document.createElement( 'label' );
		$( colorLabel ).text( 'Color:' );
		let color = document.createElement( 'input' );
		$( color ).addClass( 'encounter-character-color' )
			.prop( 'type', 'color' )
			.val( characters[characterId].color )
			.on( 'change', function() {
				if ( isEdit ) {
					updateEncounterCharacterColor({
						'character_id' 	: characterId,
						'color'			: $( this ).val()
					});
				} else {
					sendEncounterCharacterColor( $( this ).val(), characterId, characters[characterId].character_id );
				}
			});
		$( colorWrapper ).addClass( 'encounter-color__wrapper' )
			.append( colorLabel )
			.append( color );
		$( flexLeft ).append( colorWrapper );
	}

	let flexRight = document.createElement( 'div' );

	$( '.encounter-character-ref' ).remove();
	if ( admin || getAccount() == characterDragStart ) {
		var encounterCharacterRef = document.createElement( 'div' );
		$( encounterCharacterRef ).addClass( 'encounter-character-ref btn' )
			.html( 'Character Ref')
			.on( 'click', function() {
				loadCharacterById( characters[characterAccountId].character_id, false, false );
			});
		$( flexRight ).append( encounterCharacterRef );
	}

	if ( admin ) {
		$( '.encounter-character-remove' ).remove();
		var encounterCharacterRef = document.createElement( 'div' );
		$( encounterCharacterRef ).addClass( 'encounter-character-remove btn' )
			.html( 'Remove' )
			.on( 'click', function() {
				if ( confirm( "Are you sure you want to remove this character from the encounter?" ) ) {
					delete characters[characterAccountId];
					$( '.encounter-characters__select option' ).each(function() {
						if ( $( this ).val() == characterAccountId ) {
							$( this ).prop( 'disabled', false );
						}
					});
					redraw();
					clearCharacterSelectedInfo();
				}
			});
		$( flexRight ).append( encounterCharacterRef );
	}
	$( flexContainer ).addClass( 'encounter-view-flex__container' )
		.append( flexLeft ).append( flexRight );
	$( encounterFlexWrapper ).append( flexContainer );
	$( '#encounter-selected__wrapper' ).append( encounterFlexWrapper ).slideDown();
}

function updatePingSelectedInfo( pingAccountId ) {
	let characterName = 'Storyteller';
	if ( characterRef[pingAccountId] ) {
		characterName = characterRef[pingAccountId].name;
	}
	$( '#encounter-selected__name' ).html( characterName + '\'s Ping' );
	$( '#encounter-selected__wrapper' ).slideDown();
}

function clearCharacterSelectedInfo() {
	$( '#encounter-selected__wrapper' ).slideUp( 500, function() {
		$( '#encounter-selected__name' ).html( '' );
		$( '.encounter-character-ref' ).remove();
		$( '.encounter-character-remove' ).remove();
		$( '.encounter-character-close' ).remove();
		$( '.encounter-visible__wrapper' ).remove();
		$( '.encounter-color__wrapper' ).remove();
	});
}

function updateEncounterCharacterPos( data ) {
	characters[data.character_id].x = data.coords.x;
	characters[data.character_id].y = data.coords.y;
	redraw();
}
function updateEncounterCharacterColor( data ) {
	characters[data.character_id].color = data.color;
	redraw();
}
function updateEncounterCharacterVisible( data ) {
	characters[data.character_id].visible = data.visible;
	redraw();
}

function addEncounterCharacter() {
	let encounterCharacterSelect = $( '.encounter-characters__select' )[0];
	let selectedCharacter = encounterCharacterSelect.options[encounterCharacterSelect.selectedIndex];
	if ( $( selectedCharacter ).attr( 'disabled' ) != 'disabled' ) {
		let characterId = $( encounterCharacterSelect ).val();
		let characterData = {
			'name'				: selectedCharacter.text,
			'color'				: generateRandomColor(),
			'character_id'		: $( selectedCharacter ).data( 'character-id' ),
			'x'					: 30,
			'y'					: 30,
			'visible'			: true
		}
		if ( characters[characterId] == null || characters[characterId] == undefined ) {
			characters[characterId] = characterData;
			redraw();
		}
		$( '.encounter-characters__select' ).val( 'Select Character' );
		$( selectedCharacter ).attr( 'disabled', true );
	}
}

function generateRandomColor() {
	let r = generateColorNumber();
	let g = generateColorNumber();
	let b = generateColorNumber();
	while ( r < 10 && g < 10 && b < 10 ) {
		r = generateColorNumber();
		g = generateColorNumber();
		b = generateColorNumber();
	}
	return '#' + formatColorNumber(r) + formatColorNumber(g) + formatColorNumber(b);
}

function generateColorNumber() {
	return Math.floor(Math.random()* 255);
}

function formatColorNumber( number ) {
	let numberStr = number.toString(16);
	if ( numberStr.length < 2 ) {
		return "0" + numberStr;
	}
	return numberStr;
}

function updateMapSize() {
	let xInput = $( '#map-dimensions-x__input' );
	let yInput = $( '#map-dimensions-y__input' );
	if ( xInput.val() < 100 ) {
		xInput.val( 100 );
	}
	if ( yInput.val() < 100 ) {
		yInput.val( 100 );
	}
	if ( xInput.val() > 1500 ) {
		xInput.val( 1500 );
	}
	if ( yInput.val() > 1500 ) {
		yInput.val( 1500 );
	}

	$( '#map-dimensions-x-feet__input' ).val( xInput.val() / 4 );
	$( '#map-dimensions-y-feet__input' ).val( yInput.val() / 4 );

	mapDimensions.x = xInput.val();
	mapDimensions.y = yInput.val();
	redraw();
}

function saveEncounter() {
	let encounterData = {
		'name'			: $( '#encounter-name' ).val() == '' ? null : $( '#encounter-name' ).val(),
		'map_dimensions': mapDimensions,
		'characters'	: characters
	}
	saveEncounterData( encounterData );
}

function populateEncountersBtns( encountersList ) {
	$( '#maps-btns__wrapper>*' ).each(function( index ) {
		if ( index > 0 ) {
			$( this ).remove();
		}
	});
	if ( encountersList.length == 0 ) {
		$( '#maps-btns__wrapper' ).append('No Encounter Maps Yet!');
	}
	for ( let index=encountersList.length-1; index>=0; index-- ) {
		let encounterId = encountersList[index].id;
		let encounterBtn = document.createElement( 'div' );
		$( encounterBtn ).addClass( 'btn encounter-btn' )
			.html( encountersList[index].name )
			.data( 'id', encounterId )
			.on( 'click', function() {
				if ( !$( this ).hasClass( 'active') ) {
					$( '#add_map.active' ).removeClass( 'active' );
					$( '.btn-character.active, .btn-location.active, .btn-note, .encounter-btn' ).removeClass( 'active' );
					getEncounterData( encounterId, $( this ) );
				}
			});
		if ( encountersList[index].active ) {
			$( encounterBtn ).addClass( 'active-encounter' );
		}
		$( '#maps-btns__wrapper' ).append( encounterBtn );
	}
}

// TODO: This needs to factor in sidebar width
function getEncounterCanvasSize( ignoreSidebar ) {
	let heightModifier = 315;
	let widthModifier = 605;

	if ( window.innerWidth < 1350 ) {
		heightModifier = 500;
		if ( window.innerWidth >= 1100 || ( $( '#story__wrapper' ).hasClass( 'sidebar' ) && !ignoreSidebar ) ) {
			widthModifier = 365;
		} else {
			widthModifier = 120;
		}
	}

	return {
		'height' 	: window.innerHeight - heightModifier,
		'width'		: window.innerWidth - widthModifier
	}
}

function resizeCanvas() {
	// save and reset transformations
	let transform = {
		'a' : JSON.parse( JSON.stringify(ctx.getTransform().a) ),
		'b' : JSON.parse( JSON.stringify(ctx.getTransform().b) ),
		'c' : JSON.parse( JSON.stringify(ctx.getTransform().c) ),
		'd' : JSON.parse( JSON.stringify(ctx.getTransform().d) ),
		'e' : JSON.parse( JSON.stringify(ctx.getTransform().e) ),
		'f' : JSON.parse( JSON.stringify(ctx.getTransform().f) )
	}
	ctx.scale( 1 / transform.a, 1 / transform.d );
	ctx.translate( transform.e * -1, transform.f * -1 );

	// resize canvas
	let canvasSize = getEncounterCanvasSize( false );
	$( '#encounter-canvas' ).prop( 'height', canvasSize.height );
	$( '#encounter-canvas' ).prop( 'width', canvasSize.width );

	// re-apply transformations
	ctx.translate( transform.e, transform.f );
	ctx.scale( transform.a, transform.d );
	redraw();
}

function setEncounterReference( characterAccounts ) {
	for ( let characterAccount in characterAccounts ) {
		characterRef[characterAccount] = {
			'name' : characterAccounts[characterAccount],
			'color': characters[characterAccount] ? characters[characterAccount].color : generateRandomColor()
		}
	}
}


$( '.btn-encounter-op' ).on( 'click', function() {
	if ( !$( this ).hasClass( 'active' ) ) {
		$( '.btn-encounter-op.active' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
	}
}).on( 'mouseenter', function( e ) {
	let operation = '';
	if ( $( this ).attr( 'id' ) == 'btn__encounter-ping' ) {
		operation = 'Ping Map';
	} else if ( $( this ).attr( 'id' ) == 'btn__encounter-measure' ) {
		operation = 'Measure Distance';
	} else if ( $( this ).attr( 'id' ) == 'btn__encounter-move' ) {
		operation = 'Move Character';
	}
	$( '#tooltip' ).html( operation ).css({
		'left': e.clientX,
		'top': e.clientY + 20
	}).removeClass( 'hidden' );
}).on( 'mousemove', function( e ) {
	$( '#tooltip' ).css({
		'left': e.clientX,
		'top': e.clientY + 20
	});
}).on( 'mouseleave', function() {
	$( '#tooltip' ).html( '' ).addClass( 'hidden' );
});

$( '#encounter-character-close').on( 'click', function() {
	fogOfWarId = null;
	redraw();
	clearCharacterSelectedInfo();
	characterSelected = null;
});

export {
	loadCanvas,
	ping,
	updateEncounterCharacterPos,
	updateEncounterCharacterColor,
	updateEncounterCharacterVisible,
	updateInitialized,
	addEncounterCharacter,
	updateMapSize,
	saveEncounter,
	populateEncountersBtns,
	resizeCanvas,
	setEncounterReference
};

