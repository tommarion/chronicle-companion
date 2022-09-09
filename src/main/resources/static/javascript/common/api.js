import { getBaseURL, token, setToken, setAccount, getGameType, setAdmin } from './common.js';
import {cacheUser, getAccount, getToken} from './cache.js';
import { processCharacterAccountData } from './settings.js';
import { fillCharacterAccountData, addAdminToolbarHandler, addPlayerToolbarHandler, storyToolbarClick, loadCharacterToolbarData } from './toolbar.js';
import { buildSessionPage, buildSearchPage, buildNotePage } from './notes.js';
import { loadCanvas, populateEncountersBtns } from './encounter.js';
import { processCampaignData } from './login.js';
import { populateChronicleSettings, populateCharacterEntryData, getChronicleId, populateHavenSelect, clearAndCloseCharacterSheetForm, clearAndCloseLocationForm } from '../vampire/vampire-settings.js';
import { populateCampaignSettings, getCampaignId } from '../dnd/dnd-settings.js';
import { handleChronicleLoad, processNotesData } from '../vampire/chronicle.js';
import { handleCampaignLoad } from '../dnd/campaign.js';
import { assembleCharacterData, getCharacterBtn } from '../vampire/character.js';
import { assembleLocationData, getLocationBtn } from '../vampire/location.js';
import { populateCharacterSheetSettings, populateLocationForm } from '../vampire/serialize.js';
import { populateAdventureSettings, getAdventureId } from '../7th-sea/7th-sea-settings.js';
import { handleAdventureLoad } from '../7th-sea/adventure.js';
import {emitRollResults, emitTokenRegistered} from './socket.js';

function loadChronicleSettings() {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + 'vampire/chronicle/' + getProperId() + '/',
		type: 'GET',
		contentType: 'application/json'
	}).done(function( chronicleData ){
		$( '#loading__wrapper' ).addClass( 'hidden' );
		populateChronicleSettings( chronicleData );
		$( '#btn-roll' ).addClass( 'default' );
		handleChronicleLoad( chronicleData );
		fillCharacterAccountData( chronicleData.admin );
		setAdmin( chronicleData.admin );
		loadCharacterAccounts();
		if ( chronicleData.admin ) {
			addAdminToolbarHandler();
		} else {
			$( '.admin' ).remove();
			addPlayerToolbarHandler();
		}
	}).fail( function( xhr, status, error ){
	    console.log( "An error has occurred loading chronicle settings for: " + getChronicleId() );
	});
}
function getCampaigns() {
	$.ajax({
		url: getBaseURL() + 'campaigns',
		type: 'GET',
		contentType: 'application/json'
	}).done(function( campaignData ) {
		processCampaignData(campaignData)
	}).fail( function( xhr, status, error ){
		console.log( "An error has occurred loading chronicles" );
	});
}
function loadCampaignSettings() {
	$.ajax({
		url: getBaseURL() + 'dnd/campaign/' + getProperId() + '/',
		type: 'POST',
		data: buildPayload(),
		contentType: 'application/json'
	}).done(function( campaignData ){
		$( '#loading__wrapper' ).addClass( 'hidden' );
		populateCampaignSettings( campaignData );
		$( '#btn-roll' ).addClass( 'default' );
		handleCampaignLoad( campaignData );
		fillCharacterAccountData( campaignData.admin );
		setAdmin( campaignData.admin );
		loadCharacterAccounts();
		if ( campaignData.admin ) {
			addAdminToolbarHandler();
		} else {
			$( '.admin' ).remove();
			addPlayerToolbarHandler();
		}
	}).fail( function( xhr, status, error ){
	    console.log( "An error has occurred loading chronicle settings for: " + getProperId() );
	});
}
function loadAdventureSettings() {
	$.ajax({
		url: getBaseURL() + '7th-sea/adventure/' + getProperId() + '/',
		type: 'POST',
		data: buildPayload(),
		contentType: 'application/json'
	}).done(function( adventureData ){
		$( '#loading__wrapper' ).addClass( 'hidden' );
		populateAdventureSettings( adventureData );
		$( '#btn-roll' ).addClass( 'default' );
		handleAdventureLoad( adventureData );
		fillCharacterAccountData( adventureData.admin );
		setAdmin( adventureData.admin );
		loadCharacterAccounts();
		if ( adventureData.admin ) {
			addAdminToolbarHandler();
		} else {
			$( '.admin' ).remove();
			addPlayerToolbarHandler();
		}
	}).fail( function( xhr, status, error ){
	    console.log( "An error has occurred loading chronicle settings for: " + getProperId() );
	});
}
function loadCharacterById( characterId, main, edit ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + 'character/' + characterId + '/',
		type: 'GET',
		contentType: 'application/json'
	}).done(function( characterData ) {
		console.log(characterData);
		$( '#loading__wrapper' ).addClass( 'hidden' );
		if ( edit == undefined || edit == false ) {
			let sheetStyle = characterData.clan;
			if ( sheetStyle == undefined || sheetStyle == null ) {
				sheetStyle = characterData.being;
			}

			if ( main ) {
				$( '#character__wrapper' ).html( assembleCharacterData( characterData ) )
					.attr( 'class', 'active ' + sheetStyle );
				$( '#story-text__wrapper' ).fadeOut();
				$( '#story-toolbar' ).fadeOut();
			} else {
				$( '#character_sub__wrapper' ).removeClass( 'hidden' );
				$( '#character_sub_sheet' ).html( assembleCharacterData( characterData ) )
					.attr( 'class', sheetStyle );
			}
		} else {
			populateCharacterSheetSettings( characterData ); 
		}
	}).fail( function( xhr, status, error ){
	    console.log("An error has occurred loading character data for: " + characterId);
	});
}
function loadCharactersByChronicle( havens ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url:getBaseURL() + 'campaign/' + getProperId() + '/characters/',
		type: 'GET',
		contentType: 'application/json'
	}).done(function( characterData ) {
		console.log("CHARACTER DATA: ", characterData);
		$( '#loading__wrapper' ).addClass( 'hidden' );
		if ( havens === undefined || havens === false ) {
			populateCharacterEntryData( characterData );
		} else {
			populateHavenSelect( characterData );
		}
	}).fail( function( xhr, status, error ){
	    console.log("An error has occurred loading character data for: " + getProperId());
	});
}

function loadLocationById( locationId, edit, subSheet ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + getGameType() + '/locations/' + locationId + '/',
		type: 'POST',
		data: buildPayload(),
		contentType: 'application/json'
	}).done( function( locationData ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		if ( edit == undefined || edit == false ) {
			if ( subSheet == undefined || subSheet == false ) {
				$( '#character__wrapper' ).html( assembleLocationData( locationData ) )
					.attr( 'class', 'active' );
				} else {
					$( '#loading__wrapper' ).addClass( 'hidden' );
					$( '#character_sub__wrapper' ).removeClass( 'hidden' );
					$( '#character_sub_sheet' ).html( assembleLocationData( locationData ) )
						.attr( 'class', $( '#character__wrapper' ).attr( 'class' ) );
				}
		} else {
			populateLocationForm( locationData );
		}
	}).fail( function( xhr, status, error ){
	    console.log("An error has occurred loading location data for: " + locationId);
	});
}

function postDiceRoll( postData ) {
	postData.timestamp = new Date().toUTCString();
	$.ajax({
		url: getBaseURL() + 'campaign/' + getProperId() + '/roll/',
		type: 'POST',
		data: JSON.stringify(postData),
		contentType: 'application/json'
	}).done(function( rollResults ) {
		console.log("DICE DATA: ", rollResults);
		cacheUser(rollResults.player)
		emitRollResults(rollResults)
	}).fail( function( xhr, status, error ){
		console.log("An error has occurred posting dice roll", error);
	});
}

function saveCharacter( type, postData ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + getGameType() + '/chronicle/' + getProperId() + '/character/',
		type: type,
		data: buildPayload({ 'character': postData }),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		clearAndCloseCharacterSheetForm( false );
		loadCharacterAccounts();
		loadCharacterToolbarData(data['characters'], data['online']);
	}).fail( function( xhr, status, error ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		console.log(xhr);
	    const response = JSON.parse(xhr.responseText);
	    console.log( "An error has occurred saving character data for: " + postData.name, response );
	    alert( "There was a problem saving the character sheet data: " + response.message );
	    return false;
	});
}

function saveLocation( type, locationData ) {
	$.ajax({
		url: getBaseURL() + getGameType() + '/chronicle/' + getChronicleId() + '/location/',
		type: type,
		data: buildPayload({ 'location_data': locationData, 'chronicle_id': getChronicleId() }),
		contentType: 'application/json'
	}).done(function( locationsData, status, xhr ) {
		console.log(locationsData);
		clearAndCloseLocationForm( false );
		$( '#locations__btns__wrapper' ).html( '' );
		for ( let locDat in locationsData ) {
			$( '#locations__btns__wrapper' ).append( getLocationBtn( locDat, locationsData[locDat].id ) )
				.attr( 'class', 'active' );
		}
	}).fail( function( xhr, status, error ) {
		console.log(xhr);
	    const response = JSON.parse(xhr.responseText);
	    console.log( "An error has occurred saving character data for: " + postData.name, response );
	    alert( "There was a problem saving the character sheet data: " + response.message );
	});
}

function toggleStoryEnabled( enabled, storyType ) {
	let url = getBaseURL() + getGameType() + '/' + storyType + '/' + getChronicleId();
	if ( enabled ) {
		url += '/enable/';
	} else {
		url += '/disable/';
	}
	$.ajax({
		url: url,
		type: 'POST',
		data: buildPayload({ 'story_id': getChronicleId() }),
		contentType: "application/json"
	}).done(function( data, status, xhr ) {
		console.log( data );
	});
}

function updateEmbedLink( payload ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + getGameType() + '/chronicle/' + getChronicleId() + '/embed/',
		type: 'PUT',
		data: JSON.stringify(payload),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		let relationship = document.createElement( 'iframe' );
		$( relationship ).attr( 'src', data['url'] ).attr( 'id', 'relationship_map' );
		$( '#relationship__wrapper' ).html( relationship );
	}).fail( function( xhr, status, error ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		console.log(xhr);
	    const response = JSON.parse(xhr.responseText);
	    console.log( "An error has occurred saving character data for: " + postData.name, response );
	    alert( "There was a problem saving the character sheet data: " + response.message );
	    return false;
	});
}

function submitAccountRegister( payload ) {
	$.ajax({
		url: getBaseURL() + getGameType() + '/account/register/',
		type: 'POST',
		data: JSON.stringify( payload ),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		alert( "Account created! Ask your GM to add you to a character or send you a character creation request, or request to host your own game!" );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem registering: " + payload.name, response );
	    alert( "There was a problem registering: " + response.message );
	    return false;
	});
}

function loadCharacterAccounts() {
	$( '#character_accounts .loader' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + 'campaign/' + getProperId() + '/character/accounts/',
		type: 'GET',
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		$( '#character_accounts .loader' ).addClass( 'hidden' );
		processCharacterAccountData( data );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem loading accounts: ", response );
	    alert( "There was a problem loading accounts: " + response.message );
	    return false;
	});
}

function assignCharacterAccount( character_id, character_account_id ) {
	$( '#character_accounts .loader' ).removeClass( 'hidden' );
	$( '#character_accounts .character_account' ).remove();
	$.ajax({
		url: getBaseURL() + 'character/accounts/assign/',
		type: 'POST',
		data: buildPayload({ 'character_id': character_id, 'character_account_id': character_account_id}),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		loadCharacterAccounts();
		getOnlineStatus();
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem loading accounts", response );
	    alert( "There was a problem loading accounts: " + response.message );
	    return false;
	});
}

function createChronicle( name ) {
	$.ajax({
		url: getBaseURL() + 'vampire/chronicles/',
		type: 'POST',
		data: buildPayload({ 'chronicle_name': name }),
		contentType: 'application/json'
	}).done(function( chronicleData, status, xhr ) {
		window.location.href = getBaseURL() + 'vampire/?chronicle_id=' + chronicleData.id;
		// $( '#loading__wrapper' ).addClass( 'hidden' );
		// populateChronicleSettings( chronicleData );
		// handleChronicleLoad( chronicleData );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem creating chronicle: " + name, response );
	    alert( "There was a problem creating chronicle: " + response.message );
	    return false;
	});
}
function createCampaign( name ) {
	$.ajax({
		url: getBaseURL() + 'dnd/campaigns/',
		type: 'POST',
		data: buildPayload({'campaign_name' : name }),
		contentType: 'application/json'
	}).done(function( campaignData, status, xhr ) {
		window.location.href = getBaseURL() + 'dnd/?campaign_id=' + campaignData.id;
		// $( '#loading__wrapper' ).addClass( 'hidden' );
		// populateCampaignSettings( campaignData );
		// handleCampaignLoad( campaignData );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem creating campaign: " + name, response );
	    alert( "There was a problem creating campaign: " + response.message );
	    return false;
	});
}
function createAdventure( name ) {
	$.ajax({
		url: getBaseURL() + '7th-sea/adventures/',
		type: 'POST',
		data: buildPayload({'campaign_name' : name }),
		contentType: 'application/json'
	}).done(function( adventureData, status, xhr ) {
		window.location.href = getBaseURL() + '7th-sea/?adventure_id=' + adventureData.id;
		// $( '#loading__wrapper' ).addClass( 'hidden' );
		// populateCampaignSettings( campaignData );
		// handleCampaignLoad( campaignData );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem creating campaign: " + name, response );
	    alert( "There was a problem creating campaign: " + response.message );
	    return false;
	});
}

function getOnlineStatus() {
	$.ajax({
		url: getBaseURL() + 'campaign/' + getProperId() + '/online/',
		type: 'GET',
		contentType: 'application/json'
	}).done(function( onlineData, status, xhr ) {
		console.log("ONLINE STATUS: ", onlineData);
		handleOnlineStatus( onlineData );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem loading online status", response );
	    alert( "There was a problem loading online status: " + response.message );
	    return false;
	});
}

function handleOnlineStatus( data ) {
	$( '#pc__btns__wrapper' ).empty();
	if ( Object.keys(data).length === 0 ) {
		$( '#pc__btns__wrapper' ).html( 'No characters tied to accounts yet!');
		return;
	}
	if ( Object.keys(data).includes('Storyteller') ) {
		let characterBtn = getCharacterBtn('Storyteller',
			data['Storyteller'].id,
			data['Storyteller'].status  ? 'online' : 'offline');
		$( characterBtn ).addClass( 'disabled' );
		$( '#pc__btns__wrapper' ).append( characterBtn );
		delete data['Storyteller'];
	} else if ( Object.keys(data).includes('GM') ) {
		let characterBtn = getCharacterBtn('GM',
			data['GM'].id,
			data['GM'].status  ? 'online' : 'offline');
		$( characterBtn ).addClass( 'disabled' );
		$( '#pc__btns__wrapper' ).append( characterBtn );
		delete data['GM'];
	}

	/**
	 * Sometimes the server responds with an HTML page, and we parse the WHOLE THING byte by byte as
	 * player character data...
	 *
	 */
	if (typeof data === 'object') {
		for ( let character in data ) {
			$( '#pc__btns__wrapper' ).append( getCharacterBtn(character,
				data[character].id,
				data[character].status  ? 'online' : 'offline') );
		}
	} else {
		console.error("Received invalid online response... Ignoring.");
	}
}


function createSession() {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + 'campaign/' + getProperId() + '/sessions/',
		type: 'PUT',
		contentType: 'application/json'
	}).done(function( notesData, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		processNotesData( notesData['notes'], notesData['sessions'] );
		$( '.btn-note:first-child' ).trigger( 'click' );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem creating session", response );
	    alert( "There was a problem creating session: " + response.message );
	    return false;
	});
}

function renameSession( sessionId, name ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + 'session/' + sessionId + '/rename/',
		type: 'PUT',
		data: buildPayload({ 'name': name }),
		contentType: 'application/json'
	}).done(function( notesData, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		processNotesData( notesData.notes, notesData.sessions );
		$( '.btn-note:first-child' ).trigger( 'click' );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem renaming session", response );
	    alert( "There was a problem renaming session: " + response.message );
	    return false;
	});
}

function getNoteValue( noteBtn, isSession ) {
	let url = getBaseURL() + 'campaign/' + getProperId() + '/notes/' + noteBtn.data( 'id' ) + '/';
	if ( isSession ) {
		url = getBaseURL() + 'session/' + noteBtn.data( 'sessionId' ) + '/notes/';
	}
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: url,
		type: 'GET',
		contentType: 'application/json'
	}).done(function( notesData, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		if ( isSession ) {
			buildSessionPage( notesData, noteBtn.find( 'div:first-child' ).html() );
		} else {
			buildNotePage( notesData );
		}

	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = xhr.responseText;
	    console.log( "There was a problem getting note value", response );
	    alert( "There was a problem getting note value: " + response.message );
	    return false;
	});
}
function searchNotes( noteSearch ) {
	let url = getBaseURL() + 'notes/search/';
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: url,
		type: 'POST',
		data: buildPayload({'default' : noteSearch }),
		contentType: 'application/json'
	}).done(function( notesData, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );


	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem searching notes", response );
	    alert( "There was a problem searching notes: " + response.message );
	    return false;
	});
}

function upsertNote( noteName, noteValue, noteId, sessionId, tags ) {
	let requestType = 'POST';
	if ( noteId == null ) {
		requestType = 'PUT';
	}
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + 'campaign/' + getProperId() + '/notes/',
		type: requestType,
		data: buildPayload({
				'id': noteId,
				'name': noteName,
				'note': noteValue,
				'sessionId': sessionId,
				'tags': tags
			}),
		contentType: 'application/json'
	}).done(function( notesData, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		processNotesData( notesData.notes, notesData.sessions );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem upserting note", response );
	    alert( "There was a problem upserting note: " + response.message );
	    return false;
	});
}

function getNoteSearchFilters() {
	let url = getBaseURL() + 'notes/filters/';
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: url,
		type: 'POST',
		data: buildPayload(),
		contentType: 'application/json'
	}).done(function( filtersData, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		buildSearchPage( filtersData );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem loading notes filters", response );
	    alert( "There was a problem loading notes filters: " + response.message );
	    return false;
	});
}

function addInventoryItem( itemData, characterId ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + getGameType() + '/character/' + characterId + '/inventory/',
		type: 'POST',
		data: buildPayload({ 'item_data': itemData }),
		contentType: 'application/json'
	}).done(function( characterData, status, xhr ) {
		processCharacterSheetData( characterData );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem adding inventory item", response );
	    alert( "There was a problem adding inventory item: " + response.message );
	    return false;
	});
}

function toggleInventoryItem( itemId, characterId ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + getGameType() + '/inventory/' + itemId + '/toggle/',
		type: 'PUT',
		data: buildPayload({ 'character_id': characterId }),
		contentType: 'application/json'
	}).done(function( characterData, status, xhr ) {
		processCharacterSheetData( characterData );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem adding inventory item", response );
	    alert( "There was a problem adding inventory item: " + response.message );
	    return false;
	});
}

function processCharacterSheetData( characterData ) {
	$( '#loading__wrapper' ).addClass( 'hidden' );
	let sheetStyle = characterData.clan;
	if ( sheetStyle == undefined || sheetStyle == null ) {
		sheetStyle = characterData.being;
	}

	$( '#character__wrapper' ).html( assembleCharacterData( characterData ) )
		.attr( 'class', 'active ' + sheetStyle );
	$( '#story-text__wrapper' ).fadeOut();
	$( '#story-toolbar' ).fadeOut();
}

function saveEncounterData( encounterData ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + getGameType() + '/encounter/',
		type: 'PUT',
		data: JSON.stringify({ 
			'account_id'	: getAccount(),
			'chronicle_id'	: getChronicleId(),
			'encounter'		: encounterData
		}),
		contentType: 'application/json'
	}).done(function( encountersData, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		populateEncountersBtns( encountersData['encounters'] );
		$( $( '.encounter-btn' )[0]).trigger( 'click' );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem adding inventory item", response );
	    alert( "There was a problem adding inventory item: " + response.message );
	    return false;
	});
}
function getEncounterData( encounterId, encounterBtn ) {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + getGameType() + '/encounter/' + encounterId + '/',
		type: 'POST',
		data: buildPayload(),
		contentType: 'application/json'
	}).done(function( mapData, status, xhr ) {
		console.log( mapData );
		$( '#loading__wrapper' ).addClass( 'hidden' );
		loadCanvas( mapData );
		encounterBtn.addClass( 'active' );
		storyToolbarClick( encounterBtn, $( '#encounter-window__wrapper' ) );
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
	    const response = JSON.parse( xhr.responseText );
	    console.log( "There was a problem adding inventory item", response );
	    alert( "There was a problem adding inventory item: " + response.message );
	    return false;
	});
}

function validateLoginToken() {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	$.ajax({
		url: getBaseURL() + 'account/token/',
		type: 'POST',
		data: buildPayload(),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		handleLoginCallback( data )
	}).fail( function( xhr, status, error ) {
		$( '#loading__wrapper' ).addClass( 'hidden' );
		console.log( xhr );
		try {
		    const response = JSON.parse( xhr.responseText );
	    	console.log( "There was a problem logging in: " + payload.name, response );
	    	alert( "There was a problem logging in: " + response.message );
		} catch (e) {

		}
	    failureCallback();
	    return false;
	});
}

function buildPayload( data ) {
	let payload = {};

	addIdToPayload( payload );

	if ( data ) {
		for ( let field in data ) {
			payload[field] = data[field];
		}
	}

	return JSON.stringify( payload );
}

function registerToken(token) {
	console.log("REGISTERING TOKEN: ", token)
	$.ajax({
		url: getBaseURL() + "campaign/" + getProperId() + "/online/token/",
		type: "POST",
		data: token,
		contentType: 'application/json'
	}).done(function() {
		console.log("SENDING UPDATE ONLINE")
		emitTokenRegistered()
	}).fail( function( xhr, status, error ) {
		console.log( xhr );
		try {
			const response = JSON.parse( xhr.responseText );
			console.log( "There was a problem registering token", response );
			alert( "There was a problem registering token: " + response.message );
		} catch (e) {

		}
		return false;
	});
}

function addIdToPayload( payload ) {
	if ( getChronicleId() ) {
		payload['campaign_id'] = getChronicleId();
	} else if ( getCampaignId() ) {
		payload['campaign_id'] = getCampaignId();
	} else if ( getAdventureId() ) {
		payload['campaign_id'] = getAdventureId();
	}
	payload['open'] = payload['campaign_id'] && window.location.href.indexOf( '&open' ) > 0;
}

function getProperId() {
	if ( getChronicleId() ) {
		return getChronicleId();
	} else if ( getCampaignId() ) {
		return getCampaignId();
	} else if ( getAdventureId() ) {
		return getAdventureId();
	}
}

export {
	loadChronicleSettings,
	loadCampaignSettings,
	loadAdventureSettings,
	loadCharacterById,
	postDiceRoll,
	loadCharacterAccounts,
	submitAccountRegister,
	createChronicle,
	createCampaign,
	createAdventure,
	saveCharacter,
	updateEmbedLink,
	loadLocationById,
	loadCharactersByChronicle,
	saveLocation,
	assignCharacterAccount,
	toggleStoryEnabled,
	createSession,
	getNoteValue,
	upsertNote,
	renameSession,
	getOnlineStatus,
	getNoteSearchFilters,
	addInventoryItem,
	toggleInventoryItem,
	saveEncounterData,
	getEncounterData,
	validateLoginToken,
	getCampaigns,
	registerToken,
	getProperId
};





