import { getGameType, token } from './common.js';
import { getAccount } from './cache.js'
import { createSession, loadCharacterAccounts } from './api.js';
import { buildNotePage, buildNoteSpan } from './notes.js';
import { loadCanvas } from './encounter.js';
import { socket } from './socket.js';
import { processCharacterData, getCharacterBtn } from '../vampire/character.js';
import { processLocationData, getLocationBtn } from '../vampire/location.js';
import { clearAndCloseCharacterSheetForm, clearAndCloseLocationForm, getChronicleId } from '../vampire/vampire-settings.js';

function processSidebarPress( btnElem, contentElem ) {
	if ( !btnElem.hasClass( 'active' ) ) {
		$( '#sidebar-content>div' ).addClass( 'hidden' );
		contentElem.removeClass( 'hidden' );
	}
	let toggleView = true;
	if ( btnElem.hasClass( 'active' ) ) {
		btnElem.removeClass( 'active' );
	} else {
		btnElem.removeClass( 'badge' ).attr( 'badge', null );
		if ( $( '#sidebar>.btn.active' ).length > 0 ) {
			$( '#sidebar>.btn.active' ).removeClass( 'active default' );
			toggleView = false;
		}
		if ( $( '#sidebar>.btn.default' ).length > 0 ) {
			$( '#sidebar>.btn.default' ).removeClass( 'default' );
		}
		btnElem.addClass( 'active default' );
	}
	if ( toggleView ) {
		$( '#story__wrapper, #content__wrapper, #top-container, #player_sheet_add, #location_add' ).toggleClass( 'sidebar' );
		$( '#sidebar, #sidebar-content' ).toggleClass( 'active' );
	}
	resizeOnlineStatus();
}


function diceRollsSeen() {
	setTimeout(function() {
		$( '.dice-roll:not(.seen)' ).addClass( 'seen' );
	}, 2000 );
}

function setMaxOnlineStatusSize() {
	$( '#pc__btns__wrapper' ).css( 'min-width', Math.ceil( $( '#pc__btns__wrapper>.btn-character' ).length / 2 ) * 120 + "px" );
}

function resizeOnlineStatus() {
	if ( $( '#pc__btns__wrapper' ).width() < $( '#pc__btns__wrapper>.btn-character' ).length * 120 ) {
		$( '#top-container' ).addClass( 'double' );
	} else {
		$( '#top-container' ).removeClass( 'double' );
	}
}

function addBadge( sidebarBtn, content ) {
	if ( !(sidebarBtn.hasClass( 'active' ) || ( sidebarBtn.hasClass( 'default' ) && $( window ).width() > 1099) ) ) {

		if ( (content != null && content.hasClass( 'active' )) ||
				(sidebarBtn.attr( 'id' ) == 'btn-maps' && $( '#encounter-window__wrapper' ).hasClass( 'active' )) ) {
			return;
		}
		let badgeNumber = 1;
		if ( sidebarBtn.hasClass( 'badge' ) ) {
			badgeNumber = parseInt( sidebarBtn.attr( 'badge' ) ) + 1;
		}
		sidebarBtn.attr( 'badge', badgeNumber ).addClass( 'badge' );
	}
}

function addToolbarClickHandlers() {
	$( '#btn-roll' ).on( 'click', function() {
		processSidebarPress( $( this ), $( '#dice-roll__wrapper' ) );
		diceRollsSeen();
	});

	$( '#btn-ref' ).on( 'click', function() {
		processSidebarPress( $( this ), $( '#toolbar__wrapper' ) );
	});

	$( '#btn-sound_effects' ).on( 'click', function() {
		processSidebarPress( $( this ), $( '#sound-effects__wrapper' ) );
	});

	$( '#btn-character_sheets' ).on( 'click', function() {
		processSidebarPress( $( this ), $( '#character-sheets__wrapper' ) );
	});

	$( '#btn-locations' ).on( 'click', function() {
		processSidebarPress( $( this ), $( '#locations__wrapper' ) );
	});
	$( '#btn-notes' ).on( 'click', function() {
		processSidebarPress( $( this ), $( '#notes__wrapper' ) );
	});
	$( '#btn-relationship_map' ).on( 'click', function() {
		storyToolbarClick( $( this ), $( '#relationship__wrapper' ) );
	});


	// $( '#chapters__wrapper' ).on( 'click', '.chapter', function() {
	// 	if ( !$( this ).hasClass( 'active' ) ) {
	// 		$( '.chapter.active' ).removeClass( 'active' );
	// 		$( this ).addClass( 'active' );
	// 		processChapter( $( this ).index() );
	// 		$( '#story-text__wrapper' )[0].scrollTop = 0;
	// 		storyToolbarClick( $( this ), $( '#story-text__wrapper' ) );
	// 	}
	// });

	$( '#pc__btns__wrapper, #npc__btns__wrapper' ).on( 'click', '.btn-character', function() {
		if ( !$( this ).hasClass( 'disabled' ) ) {
			if ( $( this ).hasClass( 'active' ) ) {
				hideReferenceShowStory();
			} else {
				$( '.btn-character.active, .btn-location.active, .btn-note, .encounter-btn' ).removeClass( 'active' );
				$( this ).addClass( 'active' );
				let characterId = $( this ).find( '.name' ).data( 'id' );
				processCharacterData( characterId );
				$( '#character__wrapper' )[0].scrollTop = 0;
				storyToolbarClick( $( this ), $( '#character__wrapper' ) );
			}
		}
	});

	$( '#locations__btns__wrapper' ).on( 'click', '.btn-location', function() {
		if ( $( this ).hasClass( 'active' ) ) {
			hideReferenceShowStory();
		} else {
			$( '.btn-character.active, .btn-location.active, .btn-note, .encounter-btn' ).removeClass( 'active' );
			$( this ).addClass( 'active' );
			processLocationData( $( this ) );
			storyToolbarClick( $( this ), $( '#character__wrapper' ) );
		}
	});

	$( '#start_session' ).on( 'click', function() {
		if ( confirm( 'Are you sure you want to start a new session?' ) ) {
			createSession();
		}
	});
	$( '#add_general' ).on( 'click', function() {
		buildNotePage({});
		storyToolbarClick( $( this ), $( '#story-text__wrapper' ) );
	});

	$( '#story-text__wrapper' ).on( 'click', '.add-note__btn', function() {
		if ( $( '.default-note-text' ).length == 1 ) {
			$( '.default-note-text' ).focus();
		} else {
			$( '.session-notes__wrapper>ul' ).prepend( buildNoteSpan( '', null, getAccount() ) );
			$( '.session-notes__wrapper>ul>li:first-child>.note-text' ).focus();
		}
	});

	function btnSessionHandler( sessionBtnElem ) {
		if ( !sessionBtnElem.hasClass( 'active' ) ) {

			sessionBtnElem.addClass( 'active' );
		}
	}

	// TODO: We'll have to add some more data here to make sure we're only triggering sound effects for players in the current game
	$( '.btn.sound-effect' ).on( 'click', function() {
		socket.emit( 'trigger sound-effect', { 'sound-effect': $( this ).attr( 'class' ).replace( 'btn sound-effect ', '' ) });
	});

	$( '#sidebar>.btn' ).on( 'mouseenter', function( e ) {
		$( '#tooltip' ).html( getSidebarBtnName( $( this ).attr( 'id' ) ) )
			.css({
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
}

function getSidebarBtnName( btnId ) {
	switch ( btnId ) {
		case 'btn-roll':
			return 'Dice Window';
		case 'btn-ref':
			return 'Book Reference';
		case 'btn-notes':
			return 'Notes';
		case 'btn-character_sheets':
			return 'Characters';
		case 'btn-locations':
			return 'Locations';
		case 'btn-maps':
			return 'Encounter Map';
		case 'btn-sound_effects':
			return 'Soundboard';
		case 'btn-relationship_map':
			return 'Relationship Map';
		case 'btn-chronicle_settings':
			return 'Settings';
		case 'btn-campaign_settings':
			return 'Settings';
	}
}

function addAdminToolbarHandler() {
	$( '#btn-maps' ).on( 'click', function() {
		processSidebarPress( $( this ), $( '#maps__wrapper' ) );
	});

	$( '#maps__wrapper' ).on( 'click', '.btn-map', function() {
		if ( !$( this ).hasClass( 'active' ) ) {
			$( '.encounter-btn.active' ).removeClass( 'active' );
			loadCanvas({
				'name': '',
				'dimensions': {
					'x': 600,
					'y': 600
				},
				'characters': {},
				'edit': true
			});
			$( this ).addClass( 'active' );
			storyToolbarClick( $( this ), $( '#encounter-window__wrapper' ) );
		}
	});
	$( '#btn__encounter-live' ).on( 'click', function() {
		$( this ).toggleClass( 'active' );
		socket.emit( getGameType() + ' encounter live', {
			'encounter_id' 	: $( this ).hasClass( 'active' ) ? $( '#encounter__wrapper' ).data( 'id' ) : null,
			'chronicle_id' 	: getChronicleId(),
			'account_id'	: getAccount()
		});
	});

	socket.off( 'vampire handle encounter live' )
		.on( 'vampire handle encounter live', function( data ) {
			$( '.encounter-btn' ).removeClass( 'active-encounter' );
			if ( data.id == undefined ) {
				$( '#encounter-name__wrapper' ).removeClass( 'live' );
			} else {
				$( '.encounter-btn' ).each(function(){
					if ( $( this ).data( 'id' ) == data.id ) {
						$( this ).addClass( 'active-encounter' );
					}
				});
				$( '#encounter-name__wrapper' ).addClass( 'live' );
			}
		});

}

function addPlayerToolbarHandler() {
	$( '#btn-maps' ).on( 'click', function() {
		$( this ).removeClass( 'badge' )
			.removeData();
		storyToolbarClick( $( this ), $( '#encounter-window__wrapper' ) );
	});

	socket.off( 'vampire handle encounter live' )
		.on( 'vampire handle encounter live', function( data ) {
			addBadge( $( '#btn-maps' ), $( '#encounter__wrapper' ) );
			loadCanvas( data );
		});
}

function storyToolbarClick( btnElem, contentElem ) {
	console.log(btnElem);
	$( '#story-content>div' ).each(function() {
		if ( $( this ).attr( 'id' ) === contentElem.attr( 'id' ) ) {
			$( this ).slideDown().addClass( 'active' );
		} else {
			$( this ).slideUp().removeClass( 'active' );
		}
	});
	hideReferenceShowStory();
	$( '.hover-link.active' ).removeClass( 'active' );
	$( '#sidebar>.btn.active' ).trigger( 'click' );
	if ( contentElem.attr( 'id' ) === 'player_sheet_add' ) {
		clearAndCloseCharacterSheetForm( false );
	}
	if ( contentElem.attr( 'id' ) === 'location_add' ) {
		clearAndCloseLocationForm( false );
	}
	if ( btnElem.attr( 'id' ) === 'add-character' ||
			btnElem.attr( 'id' ) === 'add-location' ||
			btnElem.attr( 'id' ) === 'add_general' ||
			btnElem.attr( 'id' ) === 'start_session' ||
			btnElem.attr( 'id' ) === 'btn-relationship_map' ||
			btnElem.attr( 'id' ) === 'btn-maps' ||
			btnElem.attr( 'id' ) === 'add_map' ) {
		$( '.btn-character.active, .btn-location.active, .btn-note.active, .encounter-btn.active' ).removeClass( 'active' );
	}
}

function fillCharacterAccountData( admin ) {
	$( '#btn-chronicle_settings, #btn-campaign_settings' ).off( 'click' ).on( 'click', function() {
		if ( ( $( this ).attr( 'id' ) === 'btn-chronicle_settings' || $( this ).attr( 'id' ) === 'btn-campaign_settings' ) && admin ) {
			loadCharacterAccounts();
		}
		processSidebarPress( 
			$( this ), 
			$( this ).attr( 'id' ) === 'btn-chronicle_settings' ?
				$( '#chronicle_settings__wrapper' ) : $( '#campaign_settings__wrapper' )
		);
	});
}

function hideReferenceShowStory() {
	if ( $( '#content__wrapper' ).hasClass( 'active' ) ) {
		$( '#content__wrapper' ).removeClass( 'active' );
		$( '#story__wrapper' ).removeClass( 'hidden' );
	}
}


function loadCharacterToolbarData( characters, online ) {
	$( '#npc__btns__wrapper' ).empty();
	for ( let character in characters ) {
		if ( !Object.keys( online ).includes( character ) ) {
			$( '#npc__btns__wrapper' ).append( getCharacterBtn( character, characters[character].id ) );
		}
	}
	if ( $( '#npc__btns__wrapper .btn-character' ).length == 0 ) {
		$( '#npc__btns__wrapper' ).html( 'No Characters Yet!' );
	}
}

function loadLocationToolbarData( locations ) {
	$( '#locations__btns__wrapper' ).empty();
	for ( let location in locations ) {
		$( '#locations__btns__wrapper' ).append( getLocationBtn( location, locations[location].id ) );
	}
	if ( $( '#locations__btns__wrapper .btn-location' ).length == 0 ) {
		$( '#locations__btns__wrapper' ).html( 'No Locations Yet!')
	}
}

export {
	addToolbarClickHandlers,
	setMaxOnlineStatusSize,
	resizeOnlineStatus,
	addBadge,
	diceRollsSeen,
	storyToolbarClick,
	fillCharacterAccountData,
	addAdminToolbarHandler,
	addPlayerToolbarHandler,
	loadCharacterToolbarData,
	loadLocationToolbarData
};



