import { getBaseURL, getGameType, setNoteReference } from './common.js';
import { loadSheet, vampireCharacterEditSheet, locationEdit, getChronicleId } from '../vampire/vampire-settings.js';
import { dndCharacterEditSheet, getCampaignId } from '../dnd/dnd-settings.js';
import { getAdventureId } from '../7th-sea/7th-sea-settings.js';
import { storyToolbarClick } from './toolbar.js';
import { assignCharacterAccount, loadChronicleSettings, loadCampaignSettings, loadAdventureSettings, validateLoginToken } from './api.js';
import { addEncounterCharacter, updateMapSize, saveEncounter, setEncounterReference } from './encounter.js';
import { getAccount, getToken, getUser, verifyCacheForCampaignLoad } from './cache.js';

function addSettingsHandlers() {
	$( '#add-character' ).on( 'click', function() {
		if ( getGameType() === 'vampire' ) {
			vampireCharacterEditSheet( null );
		} else if ( getGameType() === 'dnd' ) {
			dndCharacterEditSheet( null );
		}
		storyToolbarClick( $( this ), $( '#player_sheet_add' ) );
	});
	$( '#add-location' ).on( 'click', function() {
		if ( getGameType() === 'vampire' ) {
			locationEdit( null );
			storyToolbarClick( $( this ), $( '#location_add' ) );
		} else if ( getGameType() === 'dnd' ) {

		}
	});
}

function processCharacterAccountData( data ) {
	console.log( data );
	$( '#character_accounts>div:not(.loader)' ).remove();

	let characterAccount = document.createElement( 'select' );
	let npcOption = document.createElement( 'option' );
	$( npcOption ).html( 'NPC' );
	$( characterAccount ).addClass( 'account_select' ).append( npcOption );
	let characterAccounts = {};
	for ( let account in data['accounts'] ) {
		let accountOption = document.createElement( 'option' );
		$( accountOption ).data( 'id', account )
			.html( data['accounts'][account] ).attr( 'value', account );
		$( characterAccount ).append( accountOption );
		characterAccounts[account] = data['accounts'][account];
	}

	let encounterPlayerGroup = document.createElement( 'optgroup' );
	$( encounterPlayerGroup ).prop( 'label', 'Players' );
	let encounterNpcGroup = document.createElement( 'optgroup' );
	$( encounterNpcGroup ).prop( 'label', 'NPCs' );

	for ( let character in data['characters'] ) {
		let characterAccountClone = characterAccount.cloneNode( true );
		let characterName = document.createElement( 'div' );
		$( characterName ).html( data['characters'][character].name );
		let characterAccountBtn = document.createElement( 'div' );
		$( characterAccountBtn ).addClass( 'character_account' )
			.data( 'id', data['characters'][character].id )
			.append( characterName )
			.append( characterAccountClone );
		let accountId = data['characterAccounts'][data['characters'][character].id];

		let encounterCharacterOption = document.createElement( 'option' );
		$( encounterCharacterOption ).html( data['characters'][character].name )
			.data( 'character-id', data['characters'][character].id );
		if ( accountId != null && accountId != undefined ) {

			$( characterAccountBtn ).addClass( 'assigned' ).find( 'select' ).val( accountId );
			characterAccounts[accountId] = data['characters'][character].name;


			$( encounterCharacterOption ).val( accountId );
			$( encounterPlayerGroup ).append( encounterCharacterOption );

		} else {

			$( characterAccountClone ).find( 'option:first-child' ).prop( 'selected', true );

			$( encounterNpcGroup ).append( encounterCharacterOption );
		}
		$( '#character_accounts' ).append( characterAccountBtn );

	}
	setNoteReference( characterAccounts );
	setEncounterReference( characterAccounts );

	let encounterCharacters = document.createElement( 'select' );
	let defaultOption = document.createElement( 'option' );
	$( defaultOption ).prop( 'selected', true ).prop( 'disabled', true ).html( 'Select Character' );
	$( encounterCharacters ).addClass( 'encounter-characters__select' )
		.append( defaultOption )
		.append( encounterPlayerGroup )
		.append( encounterNpcGroup );

	let encounterCharacterInsert = document.createElement( 'div' );
	$( encounterCharacterInsert ).addClass( 'encounter-character-insert__btn btn' )
		.html( 'Insert' )
		.on( 'click', function() {
			addEncounterCharacter();
		});

	$( '#encounter-characters__select__wrapper' ).html( encounterCharacters )
		.append( encounterCharacterInsert );

	$( '#character_accounts' ).off( 'change' ).on( 'change', '.account_select', function() {
		assignCharacterAccount( $( this ).parent().data( 'id' ), $( this ).val() );
	});
	$( '#btn__encounter-save' ).off( 'click' ).on( 'click', function() {
		if ( confirm( "Are you sure you want to save this encounter?" ) ) {
			saveEncounter();
		}
	});
	$( '#map-dimensions-x__input, #map-dimensions-y__input' ).off( 'change' ).on( 'change', function() {
		updateMapSize();
	});
}

if ( window.location.href.includes( '/vampire' ) ) {
	loadChronicleSettings();
} else if ( window.location.href.includes( '/dnd' ) ) {
	loadCampaignSettings();
} else if ( window.location.href.includes( '/7th-sea?' ) ) {
	loadAdventureSettings();
} else {
	let token = getToken();
	let account = getAccount();
	if ( token && account ) {
		validateLoginToken();
		let user = getUser();
	}
}

function formatDate( date ) {
	let dateObj = new Date(date);
	let current = new Date();
	let dayDifference = (current.getTime() - dateObj.getTime()) / (1000 * 3600 * 24);
	let formattedDate = '';
	if (dayDifference > 7) {
		formattedDate += getMonthValue(dateObj.getMonth()) + " " + dateObj.getDate();
		switch (dateObj.getDate() % 10) {
			case 1:
				formattedDate += 'st';
				break;
			case 2:
				formattedDate += 'nd';
				break;
			case 3:
				formattedDate += 'rd';
				break;
			default:
				formattedDate += 'th';
		}
	} else if (dayDifference <= 2 && dayDifference > 1) {
		formattedDate += "Yesterday"
	} else if (dayDifference <= 1 && dayDifference > 0) {
		formattedDate += "Today"
	} else {
		formattedDate += getDayValue(dateObj.getDay());
	}
	formattedDate += ' ';
	let hours = dateObj.getHours();
	let am = true;
	if (hours > 12) {
		am = false;
		formattedDate += (hours - 12);
	} else if (dateObj.getHours() > 0) {
		formattedDate += hours;
	} else {
		formattedDate += '12';
	}
	formattedDate += ':' + dateObj.getMinutes();
	formattedDate += am ? 'AM' : 'PM';
	return formattedDate;
}

function getDayValue( day ) {
	switch (day) {
		case 0:
			return "Sunday";
		case 1:
			return "Monday";
		case 2:
			return "Tuesday";
		case 3:
			return "Wednesday";
		case 4:
			return "Thursday";
		case 5:
			return "Friday";
		case 6:
			return "Saturday";
	}
}

function getMonthValue( month ) {
	switch (month) {
		case 0:
			return "Jan";
		case 1:
			return "Feb";
		case 2:
			return "Mar";
		case 3:
			return "Apr";
		case 4:
			return "May";
		case 5:
			return "Jun";
		case 6:
			return "Jul";
		case 7:
			return "Aug";
		case 8:
			return "Sep";
		case 9:
			return "Oct";
		case 10:
			return "Nov";
		case 11:
			return "Dec";
	}
}

export { addSettingsHandlers, processCharacterAccountData, formatDate };