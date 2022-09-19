import { setSettingsMode, toggleStarted, setTagReference } from '../common/common.js';
import { getToken, getUser } from '../common/cache.js';
import { setMaxOnlineStatusSize, resizeOnlineStatus, storyToolbarClick, loadCharacterToolbarData, loadLocationToolbarData } from '../common/toolbar.js';
import {getNoteValue, getNoteSearchFilters, registerToken} from '../common/api.js';
import { createFilterBtn } from '../common/notes.js';
import { populateEncountersBtns, loadCanvas } from '../common/encounter.js';
import { getCharacterBtn, updateTooltipLocation } from './character.js';
import { getRollValue } from './dice.js';
import { getLocationBtn } from './location.js';
import { emitRegistrationRequest, processHandRaises } from '../common/socket.js';
import { ROUSE, setRollType, SETTINGS_MODE_CHRONICLE } from './vampire.js';
import { formatDate } from "../common/settings.js";
import { getChronicleId } from './vampire-settings.js';

$( '#pass_cancel' ).on( 'click', function() {
	$( '#password_entry__wrapper' ).addClass( 'hidden' );
	// $( '#users__wrapper' ).addClass( 'hidden' );
});

function handleChronicleLoad( chronicleSettings ) {
	$( '#btn-sound_effects' ).removeClass( 'hidden' );
	$( '#pc__btns__wrapper' ).removeClass( 'hidden' );
	showDiceDivs();
	console.log(chronicleSettings);
	emitRegistrationRequest();
	$( '#story__wrapper, #story-toolbar, #sidebar, #sidebar-content' ).removeClass( 'hidden' );
	setRollType( ROUSE );
	getRollValue( ROUSE );
	toggleStarted();
	processChronicle( chronicleSettings );
	setMaxOnlineStatusSize();
	resizeOnlineStatus();
	processTagReferences( chronicleSettings );

	// $( '#chat__wrapper' ).removeClass( 'hidden' );

	if ( $( '#session_notes__wrapper>.btn-note' ).length > 0 ) {
		$( '#session_notes__wrapper>.btn-note:first-child' ).trigger( 'click' );
	} else if ( $( '#general_notes__wrapper>.btn-note' ).length > 0 ) {
		$( '#general_notes__wrapper>.btn-note:first-child' ).trigger( 'click' );
	}
}

function processTagReferences( chronicleSettings ) {
	let tagReference = [];
	for ( let location in chronicleSettings.locations ) {
		tagReference.push({
			'type': 'location',
			'name': chronicleSettings.locations[location].name,
			'id': chronicleSettings.locations[location].id
		});
	}
	for ( let character in chronicleSettings.characters ) {
		tagReference.push({
			'type': 'character',
			'name': chronicleSettings.characters[character].name,
			'id': chronicleSettings.characters[character].id
		});
	}
	setTagReference( tagReference );
}

function showDiceDivs() {
	$( '#btn_roll-dice__wrapper' ).removeClass( 'hidden' );
	$( '#dice-roll__wrapper' ).removeClass( 'hidden' );
	$( '#roll-type__dropdown' ).removeClass( 'hidden' );
}

function handleChronicleClose() {
	if ( confirm( "Are you sure you want to close this chronicle?" ) ) {
	    $( '#chronicle-books__wrapper' ).removeClass( 'hidden' );
		$( '#story__wrapper, #story-toolbar, #sidebar, #sidebar-content' ).addClass( 'hidden' );
		$( '#pc__btns__wrapper' ).empty();
		$( '#sidebar>.btn.active' ).removeClass( 'active default');
		$( '#sidebar-content' ).removeClass( 'active' );
	}
}

function processChronicle( chronicleData ) {
	setSettingsMode( SETTINGS_MODE_CHRONICLE );
	if ( chronicleData.embed_link && chronicleData.embed_link != '' && chronicleData.embed_link != undefined ) {
		$( '#btn-relationship_map' ).removeClass( 'hidden' );
		$( '#relationship_map' ).attr( 'src', chronicleData.embed_link );
	} else {
		let noMap = document.createElement( 'div' );
		$( noMap ).addClass( 'no-map' ).html( 'No Relationship Map URL associated with this Chronicle. The storyteller must enter a kumu embed link in the settings.' );
		$( '#relationship__wrapper' ).html( noMap );
	}

	processNotesData( chronicleData.notes, chronicleData.sessions );
	processHandRaises();
	loadCharacterToolbarData( chronicleData.characters, chronicleData.online )
	loadLocationToolbarData( chronicleData.locations );

	if ( chronicleData['encounters-list'] ) {
		populateEncountersBtns( chronicleData['encounters-list'] );
	}
	if ( chronicleData.encounter ) {
		loadCanvas( chronicleData.encounter );
	}
}

function processNotesData( notes, sessions ) {
	if (notes.length === 0 &&
		sessions.length === 0 ) {
		$( '#story-text__none__wrapper' ).removeClass( 'hidden' );
	}
	if ( notes.length === 0 ) {
		$( '#general_notes__wrapper' ).html( 'No NotesContent Yet!' ).data( 'notes', 0 );
	} else {
		$( '#general_notes__wrapper' ).empty();
		for ( let index in notes ) {
	    	let noteBtn = document.createElement( 'div' );
			$( noteBtn ).addClass( 'btn btn-note' )
				.data( 'id', notes[index].id )
				.html( notes[index].name )
				.on( 'click', function() {
					if ( !$( this ).hasClass( 'active' ) ) {
						$( '.btn-character.active, .btn-location.active, .btn-note.active, .encounter-btn' ).removeClass( 'active' );
						$( this ).addClass( 'active' );
						getNoteValue( $( this ), false );
						storyToolbarClick( $( this ), $( '#story-text__wrapper' ) );
					}
				});
			$( '#general_notes__wrapper' ).append( noteBtn );
		}
	}

	if ( sessions.length === 0 ) {
		$( '#session_notes__wrapper' ).html( 'No Sessions Yet!' ).data( 'notes', 0 );
	} else {
		let sessionCount = sessions.length;
		$( '#session_notes__wrapper' ).empty();
		for ( let index in sessions ) {
	    	let noteBtn = document.createElement( 'div' );
			$( noteBtn ).addClass( 'btn btn-note' ).data( 'sessionId', sessions[index].id )
			.on( 'click', function() {
				if ( !$( this ).hasClass( 'active' ) ) {
					$( '.btn-character.active, .btn-location.active, .btn-note.active' ).removeClass( 'active' );
					$( this ).addClass( 'active' );
					getNoteValue( $( this ), true );
					storyToolbarClick( $( this ), $( '#story-text__wrapper' ) );
				}
			});
			let noteBtnName = document.createElement( 'div' );
			if ( sessions[index].name == null ) {
				$( noteBtnName ).html( 'Session ' + sessionCount );
				$( noteBtn ).data( 'session', sessionCount );
			} else {
				$( noteBtnName ).html( sessions[index].name );
			}
			let noteBtnDate = document.createElement( 'div' );
			$( noteBtnDate ).html( formatDate(sessions[index].date) );
			$( noteBtn ).append( noteBtnName ).append( noteBtnDate );
			sessionCount--;
			$( '#session_notes__wrapper' ).append( noteBtn );
		}
	}

	$( '#search_notes' ).on( 'click', function() {
		if ( !$( this ).hasClass( 'active' ) ) {
			$( this ).addClass( 'active' );
			getNoteSearchFilters();
			storyToolbarClick( $( this ), $( '#story-text__wrapper' ) );
		}
	});

	$( '#story-text__wrapper' ).on( 'mouseenter', '.tag-text', function( e ) {
		if ( !$( this ).parent().is( ':focus' ) ) {
			let tagText = $( this ).html().substring(1);
			if ( $( this ).html().charAt(0) == '@' ) {
				tagText = tagText.replaceAll( '_', ' ' );
			}
			$( '#tooltip' ).html( 'Click this tag to apply<br/>\'' + tagText + '\' as a filter.' ).css({
				'left': e.clientX,
				'top': e.clientY + 20
			}).removeClass( 'hidden' );
			$( 'body' ).on( 'mousemove', updateTooltipLocation );
		}
	}).on( 'mouseleave', '.tag-text', function( e ) {
		$( '#tooltip' ).html('').addClass( 'hidden' );
		$( 'body' ).off( 'mousemove', updateTooltipLocation );
	}).on( 'click', '.tag-text', function() {
		if ( $( this ).parent().hasClass( 'focused' ) ) {

		} else {
			if ( $( '.btn-filter-applied:contains("' + $( this ).html() + '")' ).length == 0 ) {
				createFilterBtn( $( this ).html(), false, true )
				$( this ).blur();
			}
		}
	});
}

export {
	handleChronicleLoad,
	handleChronicleClose,
	processNotesData
};

