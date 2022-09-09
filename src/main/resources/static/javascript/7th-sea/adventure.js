import { getAccount, getToken, getUser } from '../common/cache.js';
import { setMaxOnlineStatusSize, resizeOnlineStatus, loadCharacterToolbarData, loadLocationToolbarData, storyToolbarClick } from '../common/toolbar.js';
import { getAdventureId } from './7th-sea-settings.js';
import { socket, processHandRaises } from '../common/socket.js';

function handleAdventureLoad( adventureSettings ) {
	$( '#btn-sound_effects' ).removeClass( 'hidden' );
	$( '#pc__btns__wrapper' ).removeClass( 'hidden' );
	showDiceDivs();
	socket.emit( '7th-sea online', { 'character' : getUser(), 'adventureId' : getAdventureId(), 'token': getToken(), 'account': getAccount() } );
	$( '#story__wrapper, #story-toolbar, #sidebar, #sidebar-content' ).removeClass( 'hidden' );
	// getRollValue(  );
	// toggleStarted();
	processAdventure( adventureSettings );
	setMaxOnlineStatusSize();
	resizeOnlineStatus();
}

function processAdventure( adventureData ) {
	setSettingsMode( SETTINGS_MODE_CAMPAIGN );
	if ( Object.keys( adventureData.notes ).length === 0 ) {
		$( '#story-text__none__wrapper' ).removeClass( 'hidden' );
		$( '#chapters__wrapper' ).html( '<li>No Sessions Yet!</li>' );
	}
	
	processNotesData( adventureData.notes, adventureData.sessions );
	processHandRaises();
	loadCharacterToolbarData( adventureData.characters )
	loadLocationToolbarData( adventureData.locations );

	if ( adventureData['encounters-list'] ) {
		populateEncountersBtns( adventureData['encounters-list'] );
	}
	if ( adventureData.encounter ) {
		loadCanvas( adventureData.encounter );
	}
}

function showDiceDivs() {
	$( '#btn_roll-dice__wrapper' ).removeClass( 'hidden' );
	$( '#dice-roll__wrapper' ).removeClass( 'hidden' );
	$( '#roll-type__dropdown' ).removeClass( 'hidden' );
}

export { handleAdventureLoad }