import { assembleCharacterSheetData } from './character.js';

function populateCampaignSettings( campaignSettings ) {
	$( '#chronicle_name__input' ).val( campaignSettings.name );
	$( '#chronicle_enabled' ).prop( 'checked', campaignSettings.enabled );
}


function getCampaignId() {
	let loc = window.location.href;
	if ( loc.indexOf( '?campaign_id=' ) == -1 ) {
		return null;
	}
	let chronicleId = loc.substring( loc.indexOf( '?campaign_id=' ) + 13 );
	if ( chronicleId.indexOf( '&' ) != -1 ) {
		chronicleId = chronicleId.substring( 0, chronicleId.indexOf( '&' ) );
	}
	return chronicleId;
}

function dndCharacterEditSheet( btnElem ) {
	$( '#player_sheet_add' ).removeClass( 'hidden' );
	$( '#player_sheet_add' ).data( 'type', 'npc' );

	loadDndSheet();

	if ( btnElem ) {
		loadCharacterById( $( btnElem ).parent().data( 'id' ), null, true );
		$( '#player_sheet_add' ).data( 'function', 'edit' );
		$( '#player_sheet_add' ).data( 'id', btnElem.data( 'id' ) );
	} else {
		$( '#player_sheet_add' ).data( 'function', 'add' );
	}

	// updateTrackers();
	// loadCharactersByChronicle( false );
	$( '#character_name__wrapper>input' ).focus();
}

function loadDndSheet( being ) {
	$( '#attr_stats__wrapper' ).html( assembleCharacterSheetData( {}, null ) );
}

export {
	getCampaignId,
	populateCampaignSettings,
	dndCharacterEditSheet
	// loadDndSheet
}