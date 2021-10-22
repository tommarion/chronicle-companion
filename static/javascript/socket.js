var socket = io.connect(base);

socket.on( 'connect', function() {
	console.log( 'SOCKET CONNECTED!');
});

/*
 EXAMPLE
	socket.emit( 'data update', {
		'type' : 'tracker',					tracker | skill | attribute | notes
		'tracker' : 'willpower',			(for tracker) willpower | health | humanity | hunger
		'damage_type' : 'superficial',		(for tracker) superficial | aggravated
		'skill_name' : ''					(for skill) strength | dexterity...
		'attriute_name' : ''				(for attribute) strength | dexterity...
		'character_id' : 1,
		'value' : 1
	});
*/
function updateData( data ) {
	socket.emit( 'data update', data);
}

socket.on( 'data updated', function( data ) {
	console.log( "DATA UPDATED!", data);
	if (data.id == getUrlVariable('character=')) {
		$( '#character__wrapper' ).html( assembleCharacterData( data ) );
	} else {
		console.log(data.id, getUrlVariable('character='))
	}
});

socket.on( 'roll results', function( data ) {
	if (data.results == 'everyone' ||
		user == 'Storyteller' ||
		user == data.player) {
		handleRollResults(data);
	}
});

// HAND WRAPPER

function processHandRaises() {
	if (user == 'Storyteller') {
		socket.on( 'hand raised', function( data ) {
			var elems = $( '#hand__wrapper:contains(' + data.character + ')');
			if (elems.length > 0 && elems.find('.btn').hasClass('btn_hand-raised')) {
				$( '.btn_hand-raised:contains(' + data.character + ')' ).addClass('remind');
			} else {
				$( '#hand__wrapper>div' ).append( '<div class="btn btn_hand-raised">' + data.character + '</div>' );
				resizeHandWrapper();
			}
			$( '#notification_effect' )[0].play();
		});

		$( '#hand__wrapper' ).on( 'click', '.btn_hand-raised', function() {
			$( this ).remove();
			resizeHandWrapper();
			socket.emit( 'acknowledge hand', { 'character' : $( this ).html() } )
		})
	} else {
		$( '#btn_raise-hand' ).on( 'click', function() {
			alert( "Storyteller notified!");
			socket.emit( 'raise hand', { 'character' : user } );
		});

		socket.on( 'hand acknowledged', function( data ) {
			console.log( "HAND ACKNOWLEDGED!", data);
			if (user == data.character) {
				alert('Storyteller achnowledged notification!');
			}
		});
	}
}

function resizeHandWrapper() {
	const hands = $( '#hand__wrapper>div' ).children().length;
	let height = 0;

	if (hands == 1) {
		height = 100;
	} else if (hands > 1) {
		height = 100 + ((hands - 1) * 75);
	}

	$( '#hand__wrapper' ).css( 'height' , height + 'px' );
}

