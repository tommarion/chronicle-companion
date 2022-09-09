import { buildBook, closeBook } from '../common/book.js';
import { user, token, account, toggleStarted, setSettingsMode, setTagReference } from '../common/common.js';
import { setMaxOnlineStatusSize, resizeOnlineStatus, loadCharacterToolbarData, loadLocationToolbarData, storyToolbarClick } from '../common/toolbar.js';
import { getNoteValue, getNoteSearchFilters } from '../common/api.js';
import { populateEncountersBtns, loadCanvas } from '../common/encounter.js';
import { getCampaignId } from './dnd-settings.js';
import { socket, processHandRaises } from '../common/socket.js';
import { INITIATIVE, setRollType, SETTINGS_MODE_CAMPAIGN } from './dnd.js';

function handleCampaignLoad( campaignSettings ) {
	$( '#btn-sound_effects' ).removeClass( 'hidden' );
	$( '#pc__btns__wrapper' ).removeClass( 'hidden' );
	showDiceDivs();
	socket.emit( 'dnd online', { 'character' : user, 'campaignId' : getCampaignId(), 'token': token, 'account': account } );
	$( '#story__wrapper, #story-toolbar, #sidebar, #sidebar-content' ).removeClass( 'hidden' );
	setRollType( INITIATIVE );
	// getRollValue(  );
	toggleStarted();
	processCampaign( campaignSettings );
	setMaxOnlineStatusSize();
	resizeOnlineStatus();
	processTagReferences( campaignSettings );


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

// function processCampaignData( data ) {
// 	window.history.replaceState( null, 'login', '?login' );
// 	$( '#user-login__input' ).val( '' );
// 	$( '#pass-login__input' ).val( '' );
// 	window.history.pushState({ page : 'campaign' }, 'campaigns', '?campaigns');
// 	$( '#login__wrapper' ).hide();
// 	$( '#loading__wrapper' ).addClass( 'hidden' );
// 	$( '#campaign-books' ).empty();
// 	for ( let campaign in data['campaigns'] ) {
// 		$( '#campaign-books' ).append( buildBook( campaign, data['campaigns'][campaign], 'dnd' ) );
// 	}
// 	$( '#campaign-books' ).append( buildBook( 'New Campaign', {'enabled':true, 'character': null }, 'dnd' ) );
// 	$( '#campaign-books__wrapper' ).removeClass( 'hidden' );
// 	$( '.flickity-button' ).on( 'click', function() {
// 		if ( $( this ).prop( 'disabled', false ) && $( '.btn-book.opened' ).length > 0 ) {
// 			closeBook( $( '.btn-book.opened'), true );
// 		}
// 	});

// }


function handleCampaignForDM() {
	$( '#btn-sound_effects' ).removeClass( 'hidden' );
	$( '#pc__btns__wrapper' ).removeClass( 'hidden' );
	showDiceDivs();

	const loc = window.location.href;
	const campaignId = loc.substring( loc.indexOf( '?campaign_id=' ) + 15 );
	socket.emit( 'dnd online', { 'character' : user, 'campaignId' : campaignId } );
	handleCampaignLoad();
	processCampaign( campaignSettings );
}

function showDiceDivs() {
	$( '#btn_roll-dice__wrapper' ).removeClass( 'hidden' );
	$( '#dice-roll__wrapper' ).removeClass( 'hidden' );
	$( '#roll-type__dropdown' ).removeClass( 'hidden' );
}

function processCampaign( campaignData ) {
	setSettingsMode( SETTINGS_MODE_CAMPAIGN );
	if ( Object.keys(campaignData.notes).length == 0 ) {
		$( '#story-text__none__wrapper' ).removeClass( 'hidden' );
		$( '#chapters__wrapper' ).html( '<li>No Sessions Yet!</li>' );
	}
	
	processNotesData( campaignData.notes );
	processHandRaises();
	loadCharacterToolbarData( campaignData.characters )
	loadLocationToolbarData( campaignData.locations );

	if ( campaignData['encounters-list'] ) {
		populateEncountersBtns( campaignData['encounters-list'] );
	}
	if ( campaignData.encounter ) {
		loadCanvas( campaignData.encounter );
	}
}

function processNotesData( notes ) {
	if (notes.general.length == 0 && 
		notes.sessions.length == 0 ) {
		$( '#story-text__none__wrapper' ).removeClass( 'hidden' );
	}
	if ( notes.general.length == 0 ) {
		$( '#general_notes__wrapper' ).html( 'No Notes Yet!' ).data( 'notes', 0 );
	} else {
		$( '#general_notes__wrapper' ).empty();
		for ( let index in notes.general ) {
	    	let noteBtn = document.createElement( 'div' );
			let active = '';
			$( noteBtn ).addClass( 'btn btn-note' )
				.data( 'id', notes.general[index].id )
				.html( notes.general[index].name )
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

	if ( notes.sessions.length == 0 ) {
		$( '#session_notes__wrapper' ).html( 'No Sessions Yet!' ).data( 'notes', 0 );
	} else {
		let sessionCount = notes.sessions.length;
		$( '#session_notes__wrapper' ).empty();
		for ( let index in notes.sessions ) {
	    	let noteBtn = document.createElement( 'div' );
			let active = '';
			$( noteBtn ).addClass( 'btn btn-note' ).data( 'sessionId', notes.sessions[index].id )
			.on( 'click', function() {
				if ( !$( this ).hasClass( 'active' ) ) {
					$( '.btn-character.active, .btn-location.active, .btn-note.active' ).removeClass( 'active' );
					$( this ).addClass( 'active' );
					getNoteValue( $( this ), true );
					storyToolbarClick( $( this ), $( '#story-text__wrapper' ) );
				}
			});
			let noteBtnName = document.createElement( 'div' );
			if ( notes.sessions[index].name == null ) {
				$( noteBtnName ).html( 'Session ' + sessionCount );
				$( noteBtn ).data( 'session', sessionCount );
			} else {
				$( noteBtnName ).html( notes.sessions[index].name );
			}
			let noteBtnDate = document.createElement( 'div' );
			$( noteBtnDate ).html( notes.sessions[index].date );
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
	});

	$( '#story-text__wrapper' ).on( 'mouseleave', '.tag-text', function( e ) {
		$( '#tooltip' ).html('').addClass( 'hidden' );
		$( 'body' ).off( 'mousemove', updateTooltipLocation );
	});
	$( '#story-text__wrapper' ).on( 'click', '.tag-text', function() {
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
	processCampaign,
	handleCampaignLoad
};