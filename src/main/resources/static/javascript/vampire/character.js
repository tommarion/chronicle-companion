import { STORYTELLER, KINDRED, LIMITED_SHEET, CHARACTER_ATTRIBUTES, CHARACTER_SKILLS, TRACKERS, CLAN_DISCIPLINES, BLOOD_SORCERY_RITUALS, setRollType, EXPERIENCE_VALUES, LEFT_CLICK, RIGHT_CLICK } from './vampire.js';
import { clearAndCloseCharacterSheetForm, handleDisciplineLevelClick, updateTrackers } from './vampire-settings.js';
import { prepareDisciplineName, getSheetStatValue, updateDiceInputs } from './dice.js';
import { processContextMenu } from './tracker.js';
import { updateData } from '../common/socket.js';
import { loadCharacterById, loadLocationById, addInventoryItem, toggleInventoryItem } from '../common/api.js';
import { buildNoteSpan } from '../common/notes.js';
import { admin } from '../common/common.js';

function getCharacterBtn( name, id, onlineStatus ) {
	let characterBtn = document.createElement( 'div' );
	$( characterBtn ).addClass( 'btn btn-character' );
	if ( onlineStatus !== undefined ) {
		let status = document.createElement( 'div' );
		$( status ).addClass( 'online-status' ).addClass( onlineStatus );
		$( characterBtn ).append( status );
	}
	let characterName = document.createElement( 'div' );
	$( characterName ).addClass( 'name' ).data( 'id', id ).html( name );
	$( characterBtn ).append( characterName );
	return characterBtn;
}

function processCharacterData( characterId ) {
	let loc = window.location.href;
	let current = '';
	if (loc.includes('&character')) {
		current = loc.substring(loc.indexOf('?'), loc.indexOf('&character'));
	} else {
		current = loc.substring(loc.indexOf('?'));
	}
	let append = '&character=' + characterId;
	window.history.pushState( {} , '',  current + append);
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	loadCharacterById( characterId, true, false );
}

function assembleCharacterData( characterInfo ) {
	console.trace();
	let flexStr = ""
	if (characterInfo.sheet) {
		flexStr = ' id="character-sheet__wrapper"';
	}
	let characterDataStr = '<div' + flexStr + '><div id="character-bio" data-id="' + characterInfo.id + '"><div class="header ' + 
		characterInfo.bio.type + ' characterName">' + characterInfo.name + '</div>';
	if ( characterInfo.bio.aka ) {
		characterDataStr += '<div id="aka"><span class="sub-text">A.K.A. ' + characterInfo.bio.aka + '</span></div>';
	}
	if ( characterInfo.bio.clan ) {
		characterDataStr += '<div id="clan" class="' + characterInfo.bio.clan.replace( ' ', '-' ) + ' img"></div>'
	} else {
		characterDataStr += '<div id="clan" class="human"></div>'
	}
	if ( admin ) {
		characterDataStr += '<div class="btn btn_roll_as">Roll As</div>';
		characterDataStr += '<div class="btn btn_edit character">Edit</div>';
	}
	characterDataStr += '<div class="btn header toolbar-item-header pad-top">bio</div><div class="character_data"><table>';
	if ( characterInfo.bio.being !== KINDRED ) {
		characterDataStr += '<tr><td><span class="sub-text">Being:</span></td><td>' + characterInfo.bio.being + '</td></tr>';
	}
	if (characterInfo.bio.apparentAge) {
		characterDataStr += '<tr><td><span class="sub-text">Apparent Age:</span></td><td>' + characterInfo.bio.apparentAge + '</td></tr>';
	}
	if (characterInfo.bio.generation) {
		characterDataStr += '<tr><td><span class="sub-text">Generation:</span></td><td>' + characterInfo.bio.generation + '</td></tr>';
	}
	if (characterInfo.bio.born) {
		characterDataStr += '<tr><td><span class="sub-text">Born:</span></td><td>' + characterInfo.bio.born + '</td></tr>';
	}
	if (characterInfo.bio.embraced) {
		characterDataStr += '<tr><td><span class="sub-text">Embraced:</span></td><td>' + characterInfo.bio.embraced + '</td></tr>';
	}
	if (characterInfo.bio.isGhouled) {
		characterDataStr += '<tr><td><span class="sub-text">Ghouled:</span></td><td>' + characterInfo.bio.isGhouled + '</td></tr>';
	}
	if (characterInfo.bio.predatorType) {
		characterDataStr += '<tr><td><span class="sub-text">Predator Type:</span></td><td>' + characterInfo.bio.predatorType + '</td></tr>';
	}
	if (characterInfo.bio.bloodPotency) {
		characterDataStr += '<tr><td><span class="sub-text">Blood Potency:</span></td><td id="bp">' + characterInfo.bio.bloodPotency + '</td></tr>';
	}
	let aggravated = characterInfo.sheet.trackers.healthAggravated;
	let superficial = characterInfo.sheet.trackers.healthSuperficial;
	let healthMax = 0;
	if ( LIMITED_SHEET.includes( characterInfo.bio.being ) ) {
		healthMax = characterInfo.sheet.attributes.physical + 3;
	} else {
		healthMax = characterInfo.sheet.attributes.physical.stamina + 3
	}
	if ( aggravated >= healthMax || ( LIMITED_SHEET.includes( characterInfo.bio.being ) && characterInfo.sheet.trackers.hunger >= 10 ) ) {
		characterDataStr += '<tr><td><span class="sub-text">Status Effects:</span></td><td>TORPOR</td></tr>';
	} else if ( aggravated + superficial >= healthMax  && aggravated < healthMax ) {
		characterDataStr += '<tr><td><span class="sub-text">Status Effects:</span></td><td>Injured (-2 to all stats)</td></tr>';
	}
	characterDataStr += '</table>';
	if (characterInfo.bio.info) {
		characterDataStr += '<div>' + characterInfo.bio.info + '</div>';
	}
	if (characterInfo.bio.pic) {
		characterDataStr += '<div><img src="' + characterInfo.bio.pic + '"/></div>';
	}
	characterDataStr += '</div><div class="sheet_flex__wrapper"><div>';
	if (characterInfo.sheet.disciplines) {
		characterDataStr += '<div id="sheet_disciplines__wrapper">';
		characterDataStr += assembleDisciplines( characterInfo.sheet.disciplines );
		characterDataStr += '</div>';
	}
	characterDataStr += '</div><div>';
	characterDataStr += assembleDetails( characterInfo.sheet );
	let havensStr = assembleHavens( characterInfo.havens );
	let relationshipsStr = assembleRelationships( characterInfo.sheet );
	if ( havensStr !== '' || relationshipsStr !== '' ) {
		characterDataStr += '<div class="btn header pad-top toolbar-item-header">Relationships</div>';
		characterDataStr += '<div class="character_relationships__wrapper">';
		characterDataStr += havensStr;
		characterDataStr += relationshipsStr;
		characterDataStr += '</div>';
	}
	characterDataStr += '</div></div>';
	characterDataStr += assembleInventory( characterInfo.inventory );

	characterDataStr += '<div class="btn header pad-top toolbar-item-header">NotesContent</div><div>';
	if ( admin ) {
		characterDataStr += assembleCharacterNotesToggle();
	}
	characterDataStr += assembleCharacterNotes( characterInfo.notes );
	characterDataStr += '</div></div>';
	if (characterInfo.sheet.attributes) {
		characterDataStr += '<div id="character-sheet">' +
			assembleCharacterSheetData( characterInfo.sheet, LIMITED_SHEET.includes( characterInfo.being ), characterInfo.experience ) + '</div>';
	}

	return characterDataStr;
}

function assembleCharacterSheetData( sheetData, limitedSheet, experience ) {
	console.trace();
	let characterSheetStr = '';
	if ( experience != null ) {
		characterSheetStr += '<div class="btn sheet_exp">Available Exp: <span class="value">' + experience + '</span></div>'
	}
	characterSheetStr += '<div class="btn header pad-top toolbar-item-header">Sheet</div><div>';
	characterSheetStr += assembleAttributes( sheetData.attributes, limitedSheet );
	characterSheetStr += assembleSkills( sheetData.skills, limitedSheet );
	characterSheetStr += '</div><div class="btn header pad-top toolbar-item-header">Trackers</div><div>';
	if (sheetData.trackers) {
		characterSheetStr += assembleTrackers( sheetData, limitedSheet );
	}
	return characterSheetStr + '</div>';
}

function assembleAttributes( attributes, limitedSheet ) {
	let attributeStr = '<div id="attribute__wrapper">';

	let index = 0;
	for ( let attributesType in CHARACTER_ATTRIBUTES ) {
		let attributeType = CHARACTER_ATTRIBUTES[attributesType].type;
		if ( limitedSheet ) {
			let attrLevel = "0";
			if (attributes != undefined && attributes[attributeType] != undefined ) {
				attrLevel = attributes[attributeType];
			}
			attributeStr += assembleAttribute( attributeType, attrLevel )
		} else {
			attributeStr += '<div><span class="title sub-text pad-bottom">' + attributeType + '</span>';
			for ( let attributeName in CHARACTER_ATTRIBUTES[attributesType].attributes ) {
				let attribute = CHARACTER_ATTRIBUTES[attributesType].attributes[attributeName]
				let attrLevel = "0";
				if (attributes != undefined && attributes[attributeType] != undefined &&
						attributes[attributeType][attribute] != undefined ) {
					attrLevel = attributes[attributeType][attribute];
				}
				attributeStr += assembleAttribute( attribute, attrLevel )
			}
			attributeStr += '</div>';
		}
	}
	return attributeStr + '</div>';
}

function assembleAttribute( attribute, level ) {
	return '<div class="attr__wrapper ' + attribute + '"><span class="title">' + attribute + '</span>' +
				  '<div class="level level' + level + '"></div></div>';
}

function assembleSkills( skillData, limitedSheet ) {
	let skillStr = '<div id="skills__wrapper">';
	let skillExpanded = '';
	if ( limitedSheet ) {
		skillExpanded = ' expanded';
	}
	for ( let skill in CHARACTER_SKILLS ) {
		let skillName = CHARACTER_SKILLS[skill];
		let level = "0";
		let formattedSkillName = prepareSkillName(skillName);
		if ( skillData !== undefined && skillData[formattedSkillName] !== undefined ) {
			level = skillData[prepareSkillName(skillName)];
		}
		skillStr += '<div class="attr__wrapper ' + skillName.replace(' ', '_') + '"><span class="title">' + skillName + '</span>';
		skillStr += '<div class="sub-text">';
		if (skillData !== undefined && skillData[formattedSkillName + "Specialty"] !== undefined &&
				skillData[formattedSkillName + "Specialty"] !== null ) {
			skillStr += '(' + skillData[formattedSkillName + "Specialty"] + ')';
		}
		skillStr += '</div>';
		skillStr += '<div class="level' + skillExpanded + ' level' + level + '"></div></div>';
	}
	skillStr += '</div>';
	return skillStr;
}

function prepareSkillName( skill ) {
	let skillSplit = skill.split(' ');
	if (skillSplit.length < 2) {
		return skillSplit;
	}
	let skillJoin = '';
	skillSplit.forEach((skill, index) => {
		if (index === 0 ) {
			skillJoin += skill;
		} else {
			skillJoin += skill.capitalize()
		}
	});
	return skillJoin;
}

function assembleDisciplines( disciplineInfo ) {
	let disciplinesStr = '';
	if ( disciplineInfo.length > 0 ) {
		disciplinesStr += '<div class="btn header pad-top toolbar-item-header">Disciplines</div><div id="disciplines__wrapper">';
		for ( let index in disciplineInfo ) {
			disciplinesStr += '<div class="discipline__wrapper ' + prepareDisciplineName(disciplineInfo[index].discipline) + '">';
			disciplinesStr += '<span class="title">' + disciplineInfo[index].discipline + '</span>';
			if ( disciplineInfo[index].level !== 0 ) {
				disciplinesStr += '<div class="level level' + disciplineInfo[index].level + '"></div>';
			}
			disciplinesStr += '</div>';
			if (disciplineInfo[index].powers) {
				let powers = JSON.parse(disciplineInfo[index].powers);
				disciplinesStr += '<ul class="discipline_powers">';
				for ( let power in powers ) {
					disciplinesStr += '<li class="discipline_power">' + powers[power] + '</li>';
				}
				disciplinesStr += '</ul>';
			}
		}
		disciplinesStr += '</div>';
	}
	return disciplinesStr;
}

function assembleDetails( sheetData ) {
	let advantagesStr = '';
	if ( sheetData.advantages.length > 0 ) {
		advantagesStr += '<span class="title">Advantages</span><ul id="advantages_sheet__wrapper">';
		for ( let index in sheetData.advantages ) {
			advantagesStr += '<li class="advantage__wrapper">';
			advantagesStr += '<div class="level level' + sheetData.advantages[index].level + '"></div>';
			advantagesStr += '<span class="sub-title">' + sheetData.advantages[index].name + '</span>';
			if (sheetData.advantages[index].type) {
				advantagesStr += '<span class="sub-text"> (' + sheetData.advantages[index].type + ')</span>';
			}
			advantagesStr += '</li>';
		}
		advantagesStr += '</ul>';
	}
	let flawsStr = '';
	if ( sheetData.flaws.length > 0 ) {
		flawsStr += '<span class="title">Flaws</span><ul id="flaws_sheet__wrapper">';
		for ( let index in sheetData.flaws ) {
			flawsStr += '<li class="flaw__wrapper">';
			flawsStr += '<div class="level level' + sheetData.flaws[index].level + '"></div>';
			flawsStr += '<span class="sub-title">' + sheetData.flaws[index].name + '</span>';
			flawsStr += '</li>';
		}
		flawsStr += '</ul>';
	}
	let convictionsStr = '';
	if ( sheetData.convictions.length > 0 ) {
		convictionsStr += '<span class="title">Convictions</span><ul id="convictions_sheet__wrapper">';
		for ( let index in sheetData.convictions ) {
			convictionsStr += '<li class="conviction__wrapper">';
			convictionsStr += '<span class="sub-title">' + sheetData.convictions[index].name + '</span>';
			convictionsStr += '</li>';
		}
		convictionsStr += '</ul>';
	}
	let touchstonesStr = '';
	if ( sheetData.touchstones.length > 0 ) {
		touchstonesStr += '<span class="title">Touchstones</span><ul id="touchstones_sheet__wrapper">';
		for ( let index in sheetData.touchstones ) {
			touchstonesStr += '<li class="touchstone__wrapper">';
			touchstonesStr += '<span class="sub-title">' + sheetData.touchstones[index].name + '</span>';
			touchstonesStr += '</li>';
		}
		touchstonesStr += '</ul>';
	}
	if ( advantagesStr == '' && flawsStr == '' && convictionsStr == '' && touchstonesStr == '' ) {
		return '';
	}
	return '<div class="btn header pad-top toolbar-item-header">Lore</div><div class="character_lore__wrapper">' 
		+ advantagesStr + flawsStr + convictionsStr + touchstonesStr + '</div>';
}

function assembleHavens( havenInfo ) {
	let havensStr = '';
	if ( havenInfo && havenInfo.length > 0) {
		havensStr += '<span class="title">Havens</span><ul id="havens_sheet__wrapper">';
		for ( let index in havenInfo ) {
			havensStr += '<li class="haven__wrapper">';
			havensStr += '<div class="btn btn-ref location" data-id="' + havenInfo[index].id + '">' + havenInfo[index].name + '</div>';
			havensStr += '</li>';
		}
		havensStr += '</ul>';
	}
	return havensStr;
}

function assembleRelationships( sheetInfo ) {
	let relationshipsStr = '';
	if ( sheetInfo.retainers.length > 0 ) {
		relationshipsStr += '<span class="title">Retainers</span><ul id="retainers_sheet__wrapper">';
		for ( let index in sheetInfo.retainers ) {
			let retainer = sheetInfo.retainers[index];
			relationshipsStr += '<li class="retainer__wrapper">';
			relationshipsStr += '<div class="btn btn-ref character" data-id="' + retainer.id + '">' + retainer.name + '</div>'
			relationshipsStr += '</li>'
		}
		relationshipsStr += '</ul>';
	}
	if ( sheetInfo.bloodSlaves.length > 0 ) {
		relationshipsStr += '<span class="title">Blood-Slaves</span><ul id="blood-slaves_sheet__wrapper">';
		for ( let index in sheetInfo.bloodSlaves ) {
			let bloodSlave = sheetInfo.bloodSlaves[index];
			relationshipsStr += '<li class="blood_slave__wrapper">';
			relationshipsStr += '<div class="btn btn-ref character" data-id="' + bloodSlave.id + '">' + bloodSlave.name + '</div>'
			relationshipsStr += '</li>'
		}
		relationshipsStr += '</ul>';
	}
	if ( sheetInfo.animals.length > 0 ) {
		relationshipsStr += '<span class="title">Animals</span><ul id="animals_sheet__wrapper">';
		for ( let index in sheetInfo.animals ) {
			let animal = sheetInfo.animals[index];
			relationshipsStr += '<li class="animal__wrapper">';
			relationshipsStr += '<div class="btn btn-ref character" data-id="' + animal.id + '">' + animal.name + '</div>'
			relationshipsStr += '</li>'
		}
		relationshipsStr += '</ul>';
	}

	return relationshipsStr;
}

function assembleInventory( inventory ) {
	console.log( inventory );
	let inventoryStr = '';
	inventoryStr += '<div class="btn header pad-top toolbar-item-header">Inventory</div>';
	inventoryStr += '<div class="inventory__wrapper">';
	if ( inventory.armor ) {
		inventoryStr += '<div class="title">Armor</div>';
		inventoryStr += assembleInventoryItems( inventory.armor );
	}
	if ( inventory.weapons ) {
		if ( inventory.weapons.firearms ) {
		inventoryStr += '<div class="title">Firearms</div>';
			inventoryStr += assembleInventoryItems( inventory.weapons.firearms );
		}
		if ( inventory.weapons.melee ) {
		inventoryStr += '<div class="title">Melee</div>';
			inventoryStr += assembleInventoryItems( inventory.weapons.melee );
		}
	}
	if ( inventory.misc ) {
		inventoryStr += '<div class="title">Misc.</div>';
		inventoryStr += assembleInventoryItems( inventory.misc );
	}
	if ( !inventory.armor && 
			( !inventory.weapons || (!inventory.weapons.firearms && !inventory.weapons.melee) ) && 
			!inventory.misc ) {
		inventoryStr += '<div class="empty">No Inventory Items!</div>'
	}
	if ( admin ) {
		inventoryStr += '<div id="inventory-add__wrapper" class="flex">';
		inventoryStr += '<input class="item-name" placeholder="Item Name / Description"/>';
		inventoryStr += '<select id="item-type">';
		inventoryStr += '<option value="misc">Misc.</option>';
		inventoryStr += '<option value="weapon">Weapon</option>';
		inventoryStr += '<option value="armor">Armor</option>';
		inventoryStr += '</select>';
		inventoryStr += '<div id="weapon-type">';
		inventoryStr += '<input type="radio" id="weapon-type_melee" name="weapon-type" value="melee"/><label for="weapon-type_melee">Melee</label>';
		inventoryStr += '<input type="radio" id="weapon-type_firearm" name="weapon-type" value="firearm"/><label for="weapon-type_firearm">Firearm</label>';
		inventoryStr += '</div>';
		inventoryStr += '<div id="modifier__wrapper" class="positive"><input id="modifier" type="number" step="1" value="0"/></div>';
		inventoryStr += '<input type="checkbox" id="on-person"><label for="on-person">On Person</label>';
		inventoryStr += '</div>';
		inventoryStr += '<div class="btn btn__inventory-add">Add</div>';
	}
	inventoryStr += '</div>';
	return inventoryStr;
}

function assembleInventoryItems( inventoryItems ) {
	let inventoryItemStr = '<ul>';
	for ( let index in inventoryItems ) {
		const inventoryItem = inventoryItems[index];
		let itemStr = '<div class="inv-item-desc">' + inventoryItem['description'] + '</div>';
		if ( inventoryItem['armor_modifier'] != null ) {
			itemStr += '<div class="inv-item-mod"> ';
			if ( inventoryItem['armor_modifier'] >=0 ) {
				itemStr += '+';
			}
			itemStr += inventoryItem['armor_modifier'] + '</div>';
		} else if ( inventoryItem['weapon_modifier'] != null ) {
			itemStr += '<div class="inv-item-mod"> ';
			if ( inventoryItem['weapon_modifier'] >=0 ) {
				itemStr += '+';
			}
			itemStr += inventoryItem['weapon_modifier'] + '</div>';
		}
		itemStr += '<div class="on_person';
		if ( inventoryItem['on_person'] ) {
			itemStr += ' active';
		}
		itemStr += '"></div>';
		inventoryItemStr += '<li class="flex inv-item" data-id="' + inventoryItem['id'] + '">' + itemStr + '</li>';
	}
	return inventoryItemStr + '</ul>';
}

function assembleCharacterNotesToggle() {
	let notesToggle = document.createElement( 'div' );
	let notesTagged = document.createElement( 'div' );
	let notesAuthored = document.createElement( 'div' );
	$( notesTagged ).addClass( 'btn active btn-notes_view btn-notes_view-tagged' ).html( '@' );
	$( notesAuthored ).addClass( 'btn btn-notes_view btn-notes_view-authored' );
	$( notesToggle ).addClass( 'notes-view__wrapper' ).append( notesTagged ).append( notesAuthored );
	return notesToggle.outerHTML;
}


$( '#character__wrapper' ).on( 'click', '.btn-notes_view-tagged', function() {
	if ( !$( this ).hasClass( 'active' ) ) {
		$( this ).addClass( 'active' );
		$( '.btn-notes_view-authored' ).removeClass( 'active' );
		$( '.notes-tagged__wrapper' ).slideDown();
		$( '.notes-authored__wrapper' ).slideUp();
	}
});

$( '#character__wrapper' ).on( 'click', '.btn-notes_view-authored', function() {
	if ( !$( this ).hasClass( 'active' ) ) {
		$( this ).addClass( 'active' );
		$( '.btn-notes_view-tagged' ).removeClass( 'active' );
		$( '.notes-tagged__wrapper' ).slideUp();
		$( '.notes-authored__wrapper' ).slideDown();
	}
});

function assembleCharacterNotes( notesList ) {
	let notesWrapper = document.createElement( 'div' );
	if ( notesList == undefined || 
			( notesList.notes.length == 0 && ( notesList.notes_by == undefined || notesList.notes_by.length == 0 ) ) ) {
		$( notesWrapper ).addClass( 'notes__wrapper' ).html( 'No tagged notes' );
		return notesWrapper.outerHTML;
	}
	let notes = notesList.notes;
	let notesTaggedWrapper = document.createElement( 'ul' );
	$( notesTaggedWrapper ).addClass( 'notes-tagged__wrapper' );
	for ( let i in notes ) {
		$( notesTaggedWrapper ).append( buildNoteSpan( notes[i].note, notes[i].id, notes[i].account_id ) );
	}
	$( notesWrapper ).addClass( 'notes__wrapper' ).append( notesTaggedWrapper );
	if ( admin ) {
		let notes = notesList.notes_by;
		let notesAuthoredWrapper = document.createElement( 'ul' );
		$( notesAuthoredWrapper ).addClass( 'notes-authored__wrapper' );
		for ( let i in notes ) {
			$( notesAuthoredWrapper ).append( buildNoteSpan( notes[i].note, notes[i].id, notes[i].account_id ) );
		}
		$( notesWrapper ).append( notesAuthoredWrapper );
	}
	return notesWrapper.outerHTML;
}

function assembleTrackers( trackersInfo, limitedSheet ) {
	let trackersStr = '<div id="trackers__wrapper">';
	for ( let index in TRACKERS ) {
		let trackerVal = TRACKERS[index];
		if ( ( trackerVal == 'hunger' || trackerVal == 'humanity' ) && limitedSheet) {
			continue;
		}
		let tracker = trackerVal;
		trackersStr += evaluateTracker( tracker, trackersInfo, limitedSheet )
	}
	trackersStr += '</div>';
	return trackersStr;
}

function evaluateTracker( tracker, sheetData, limitedSheet ) {
	let trackerInfo = sheetData.trackers
	let trackerStr = '<div class="tracker__wrapper"><span class="title">' + tracker + '</span>';
	if ( tracker == "health" || tracker == "willpower" ) {
		if ( tracker == "health" ) {
			let maxHealth = '';
			if ( limitedSheet ) {
				maxHealth = sheetData.attributes.physical + 3;
			} else {
				maxHealth = sheetData.attributes.physical.stamina + 3;
			}
			trackerStr += '<div id="health-tracker" class="maxlevel' + maxHealth;
		} else if ( tracker == "willpower" ) {
			let maxWillpower = '';
			if ( limitedSheet ) {
				maxWillpower = sheetData.attributes.social + sheetData.attributes.mental;
			} else {
				maxWillpower = sheetData.attributes.social.composure + sheetData.attributes.mental.resolve;
			}
			trackerStr += '<div id="willpower-tracker" class="maxlevel' + maxWillpower;
		}
		trackerStr += ' superficial' + trackerInfo[tracker + 'Superficial'] + ' aggravated' +
			trackerInfo[tracker + 'Aggravated'] + '"></div>';
	} else if ( tracker == "humanity" ) {
		if (trackerInfo[tracker + 'Max'] < 0 ||
			trackerInfo[tracker + 'Stains'] > ( 10 - trackerInfo[tracker + 'Max'] ) ) {
			return "";
		}
		trackerStr += '<div id="humanity-tracker" class="maxlevel' + trackerInfo[tracker + 'Max'] +
			' stains' + trackerInfo[tracker +'Stains'] + '"></div>';
	} else if ( tracker == "hunger" ) {
		if (trackerInfo[tracker] < 0) {
			return "";
		}
		trackerStr += '<div id="hunger-tracker" class="level' + trackerInfo[tracker] + '"></div>';
		// $( '#hunger-dice__input' ).val( trackerInfo[tracker] );
	}
	trackerStr += '</div>'
	return trackerStr
}

$( '#character__wrapper' ).on( 'click', '#willpower-tracker, #health-tracker, #humanity-tracker, #hunger-tracker', function() {
	processContextMenu( $( this ), LEFT_CLICK );
});
$( '#character__wrapper' ).on( 'contextmenu', '#willpower-tracker, #health-tracker, #humanity-tracker, #hunger-tracker', function() {
	processContextMenu( $( this ), RIGHT_CLICK );
	return false;
});
$( '#character__wrapper' ).on( 'click', '.btn_remove-note', function() {
	if (confirm("Are you sure you want to remove this note?")) {
		const noteText = $( this ).parent().find( '.note' ).html();
		let updatedNotesText = getNotesText();
		updatedNotesText = removeFromArray( updatedNotesText, noteText );
		prepareNotesUpdate( updatedNotesText );
	}
});
$( '#character__wrapper' ).on( 'click', '#btn_add-note', function() {
	const newNote = $( '#add-note__input' ).val();
	if ( newNote != "") {
		let noteText = getNotesText();
		noteText.push( newNote );
		prepareNotesUpdate( noteText );
		$( '#add-note__input' ).val( '' );
	}
});

function getNotesText() {
	const noteElems = $( '.note' );
	let notesText = [];
	noteElems.each(function(){
		notesText.push( $( this ).html() );
	});
	return notesText;
}

function removeFromArray( array, elem ) {
	const index = array.indexOf( elem );
	if (index > -1) {
	  array.splice(index, 1);
	}
	return array;
}

function prepareNotesUpdate( notesValue ) {
	const dataUpdate = {
		'type' : 'notes',
		'character_id' : $( '#character-bio' ).data( 'id' ),
		'value' : JSON.stringify(notesValue)
	}
	updateData( dataUpdate );
}

$( '.btn-increase' ).on( 'click', function() {
	if ( !$( this ).hasClass( 'disabled' ) ) {
		$( this ).parent().find( '.btn-decrease' ).removeClass( 'disabled' );
		let prev = $( this ).prev();
		let prevVal = parseInt( prev.html() );
		if ( prevVal < 5 ) {
			prev.html( prevVal + 1 );
		}
		if ( prevVal == 4 ) {
			$( this ).addClass( 'disabled' );
		}
	}
});
$( '.btn-decrease' ).on( 'click', function() {
	if ( !$( this ).hasClass( 'disabled' ) ) {
		$( this ).parent().find( '.btn-increase' ).removeClass( 'disabled' );
		let prev = $( this ).next();
		let prevVal = parseInt( prev.html() );
		if ( prevVal > 1 ) {
			prev.html( prevVal - 1 );
		}
		if ( prevVal == 2 ) {
			$( this ).addClass( 'disabled' );
		}
	}
});

$( '#character__wrapper' ).on( 'click', '.btn-ref.character', function() {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	loadCharacterById( $( this ).data( 'id' ), false, false );
});
$( '#character__wrapper' ).on( 'click', '.btn-ref.location', function() {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	loadLocationById( $( this ).data( 'id' ), false, true );
});
$( '#btn_char_sheet__close' ).on( 'click', function() {
	$( '#character_sub__wrapper' ).addClass( 'hidden' );
});
$( '#character__wrapper, #character_sub__wrapper' ).on( 'mouseenter', '.discipline_power', function(e) {
	const discipline = prepareDisciplineName( $( this ).parent().prev().find( '.title' ).html());
	let description = "There's no data for this power yet!";
	let power = $( this ).html();
	$( '#' + discipline ).find( '.title' ).each(function() {
		if ( $( this ).html() == power ) {
			description = $( this ).parent().html();
		}
	});
	$( '#tooltip' ).html( description ).css({
		'left': e.clientX,
		'top': e.clientY + 20
	}).removeClass( 'hidden' );
	$( 'body' ).on( 'mousemove', updateTooltipLocation );
});

$( '#character__wrapper, #character_sub__wrapper' ).on( 'mouseleave', '.discipline_power', function(e) {
	// const discipline = $( this ).parent().parent().find( '.title' ).html().toLowerCase();
	// let description = "There's no data for this power yet!";
	// let power = $( this ).html();
	// $( '#' + discipline ).find( '.title' ).each(function() {
	// 	if ( $( this ).html() == power ) {
	// 		description = $( this ).parent().html();
	// 	}
	// });
	$( '#tooltip' ).html( '' ).addClass( 'hidden' );
	$( 'body' ).off( 'mousemove', updateTooltipLocation );
});

$( '#character__wrapper' ).on( 'click', '.discipline_power', function(e) {
	innerHtml = $( '#tooltip' ).html()
	let searchText = 'Dice Pool: ';
	if ( innerHtml != '' ) {
		if ( innerHtml.indexOf( searchText ) != -1 ) {
			let dicePoolText = innerHtml.substring( innerHtml.indexOf( searchText ) + searchText.length );
			dicePoolText = dicePoolText.substring( 0, dicePoolText.indexOf( '<') );
			dicePool = []
			if ( dicePoolText.indexOf( ' or ') != -1 ) {
				dicePool = dicePoolText.split( ' or ' );
			} else if (dicePoolText.indexOf( ' vs ' ) != -1 ) {
				dicePool.push(dicePoolText.split( ' vs ' )[0]);
			} else {
				dicePool.push( dicePoolText );
			}

			let highestPool = 0;
			let highestPoolName = 'Custom';

			for ( var i = 0; i < dicePool.length; i++) {
				try {
					getRollValue( dicePool[i] );
					if ( $( '#dice-pool__input ' ).val() > highestPool ) {
						highestPool = $( '#dice-pool__input' ).val();
						highestPoolName = dicePool[i];
					} else {
						$( '#dice-pool__input' ).val( highestPool );
					}
				} catch (e) {
					console.log("ERROR: unable to get dicepool for " + dicePool[i], e);
				}
			}
			disciplineDicePool = $( this ).html();
			setRollType( $( this ).html() );
			$( '#roll-type__text' ).val( highestPoolName );
		}
	}
});

function updateTooltipLocation( e ) {
	$( '#tooltip' ).css({
		'left': e.clientX,
		'top': e.clientY + 20
	});
}

$( '#character__wrapper, #character_sub__wrapper' ).on( 'mouseenter', '.attr__wrapper, .discipline__wrapper', function(e) {
	if ( getGeneration( $( this ), 5 ).hasClass( 'exp' ) || getGeneration( $( this ), 6 ).hasClass( 'exp' ) ||
			getGeneration( $( this ), 7 ).hasClass( 'exp' ) ) {
		let currentExpValue = parseInt($( '.sheet_exp>.value' ).html());
		let upgradeCost =  calculateExperienceCost( prepareDisciplineName($( this ).find( '.title' ).html()) );
		let descriptionStart = currentExpValue >= upgradeCost ? '<span>Click to upgrade' : '<span class="red">Not enough EXP to upgrade';
		let description = descriptionStart + "<br/>Cost: " + upgradeCost + " exp</span>";
		$( '#tooltip' ).html( description ).css({
			'left': e.clientX,
			'top': e.clientY + 20
		}).removeClass( 'hidden' );
		$( 'body' ).on( 'mousemove', updateTooltipLocation );
	}
});

$( '#character__wrapper, #character_sub__wrapper' ).on( 'mouseleave', '.attr__wrapper, .discipline__wrapper', function(e) {
	if ( getGeneration( $( this ), 5 ).hasClass( 'exp' ) || getGeneration( $( this ), 6 ).hasClass( 'exp' ) ||
			getGeneration( $( this ), 7 ).hasClass( 'exp' ) ) {
		$( '#tooltip' ).html( '' ).addClass( 'hidden' );
		$( 'body' ).off( 'mousemove', updateTooltipLocation );
	}
});

$( '#character__wrapper, #character_sub_sheet' ).on( 'click', '.attr__wrapper', function( e ) {
	let title = $( this ).find( '.title' ).html();
	if ( getGeneration( $( this ), 5 ).hasClass( 'exp' ) || getGeneration( $( this ), 6 ).hasClass( 'exp' ) ) {
		const experience = getGeneration( $( this ), 5 ).find( '.btn.sheet_exp .value' ).html();
		const cost = calculateExperienceCost( title );
		if ( cost && cost <=  experience ) {
			if ( confirm( "Are you sure you want to spend " + cost + " exp ugrading " + title + "?" ) ) {

			}
		}
	} else {
		let value = getSheetStatValue( title );
		let rollNameUpdate = title.capitalize();
		if ( e.shiftKey ) {
			rollNameUpdate = $( '#roll-type__text' ).val() + ' + ' + title.capitalize();
	    	value += parseInt($( '#dice-pool__input' ).val());
	    }
	    let hungerVal = 0;
	    try {
	    	hungerVal = getSheetStatValue( 'hunger', true );
	    } catch (e) {
	    	// character must not be kindred
	    }
	    $( '#roll-type__text' ).val( rollNameUpdate );
	    setRollType( rollNameUpdate );
	    updateDiceInputs( value, hungerVal );
	}
});

$( '#character__wrapper, #character_sub_sheet' ).on( 'click', '.btn_roll_as', function() {
	if ( $( this ).hasClass( 'active' ) ) {
		$( '#rolling_as' ).trigger( 'click' );
	} else {
		if ( ($( '#sidebar>.btn.active' ).length > 0 && !$( '#btn-roll' ).hasClass( 'active' )) ||
				(!$( '#btn-roll' ).hasClass( 'default' ) && $( window ).width() > 1099) ) {
			$( '#btn-roll' ).trigger( 'click' );
		}
		if ( getGeneration( $( this ), 3 ).attr( 'id' ) == 'character__wrapper' ) {
			$( '#rolling_as .roller' ).html( $( '#character__wrapper' ).find( '.characterName' ).html() );
		} else if ( getGeneration( $( this ), 3 ).attr( 'id' ) == 'character_sub_sheet' ) {
			$( '#character__wrapper .btn_roll_as' ).removeClass( 'active' );
			$( '#rolling_as .roller' ).html( $( '#character_sub_sheet' ).find( '.characterName' ).html() );
		}
		$( '#rolling_as' ).addClass( 'open' );
		$( this ).addClass( 'active' );
	}
});

$( '#character__wrapper, #character_sub_sheet' ).on( 'click', '.btn.sheet_exp', function() {
	if ($( this ).hasClass( 'active' ) ) {
		$( 'body' ).off( 'mousemove', updateTooltipLocation );
		 getGeneration( $( this ), 3 ).removeClass( 'exp' );
	} else {
		 getGeneration( $( this ), 3 ).addClass( 'exp' );
	}
	$( this ).toggleClass( 'active' );
});

$( '#character__wrapper' ).on( 'click', '.btn__inventory-add', function() {

});
$( '#character__wrapper' ).on( 'change', '#item-type', function() {
	if ( $( this ).val() == 'armor' ) {
		$( '#inventory-add__wrapper' ).addClass( 'armor' );
	} else {
		$( '#inventory-add__wrapper' ).removeClass( 'armor' );
	}

	if ( $( this ).val() == 'weapon' ) {
		$( '#inventory-add__wrapper' ).addClass( 'weapon' );
	} else {
		$( '#inventory-add__wrapper' ).removeClass( 'weapon' );
		$( '#weapon-type' ).find( 'input' ).prop( 'checked', false );
	}

	if ( $( this ).val() == 'armor' || $( this ).val() == 'weapon' ) {
		$( '#modifier' ).val( 0 ).trigger( 'change' );
		$( '#modifier__wrapper' ).addClass( 'positive' );
	} else {
		$( '#modifier' ).val( null );
	}
});

$( '#character__wrapper' ).on( 'change', '#modifier', function() {
	if ( $( this ).val() >= 0 ) {
		$( this ).parent().addClass( 'positive' );
	} else {
		$( this ).parent().removeClass( 'positive' );
	}
});

$( '#character__wrapper' ).on( 'click', '.btn__inventory-add', function() {
	if ( $( '.item-name' ).val() == '' ) {
		alert( "Please enter a name/description for the item!" );
		$( '.item-name' ).addClass( 'error' );
	} else {
		let itemData = {
			'name'		: $( '.item-name' ).val(),
			'type'		: $( '#item-type' ).val(),
			'on_person'	: $( '#on-person' ).prop( 'checked' )
		}
		if ( itemData.type == 'weapon' ) {
			itemData.weapon_type = document.querySelector('input[name="weapon-type"]:checked').value;
			itemData.modifier = $( '#modifier' ).val()
		} else if ( itemData.type == 'armor' ) {
			itemData.modifier = $( '#modifier' ).val()
		}
		if ( confirm( "Are you sure you want to add this item?" ) ) {
			addInventoryItem( itemData, $( '#character-bio' ).data( 'id' ) );
		}
	}
});

$( '#character__wrapper' ).on( 'click', '.on_person', function() {
	if ( confirm( "Are you sure you want to toggle this item?" ) ) {
		toggleInventoryItem(  $( this ).parent().data( 'id' ), $( '#character-bio' ).data( 'id' ) );
	}
});

$( '#btn_player_sheet_randomize' ).on( 'click', function() {
	if ( $( this ).parent().parent().parent().parent().hasClass( 'iPhone' ) && !$( this ).hasClass( 'tapped' ) ) {
		$( this ).addClass( 'tapped' );
	} else {
		if ( confirm( "Are you sure you want to randomize this sheet? (It will remove all data in the sheet)" ) ) {
		    $( '#player_sheet_randomize' ).addClass('active');
		    setTimeout(function(){
		        $( '#player_sheet_randomize').removeClass( 'active' );
		    }, 250 );

			let namesave = $( '#character_name__wrapper input' ).val();
		    clearAndCloseCharacterSheetForm( false );
			$( '#character_discipline__select option[value="' + BLOOD_SORCERY_RITUALS + '"]' ).remove();
		    let gender = document.querySelector('input[name="gender"]:checked').value;
		    let freq = document.querySelector('input[name="freq"]:checked').value;
		    $( '#loading__wrapper' ).removeClass( 'hidden' );
		    if ( $( '#randomize_name' ).prop( 'checked' ) ) {
			    namey.get({
			    	count: 1,
			    	type: gender == 'any' ? null : gender,
			    	frequency: freq,
			    	with_surname: 'true',
			    	callback: function(n) { 
						$( '#character_name__wrapper input' ).val( n[0] );
			    		randomizeSheet();
			    	}
			    });
			} else {
				$( '#character_name__wrapper input' ).val( namesave );
				randomizeSheet();
			}
		}
		$( this ).removeClass( 'tapped' );
		$( '#player_sheet_randomize' ).blur();
	}
});

$( '#randomize_name' ).on( 'click', function(){
	$( 'input[name="gender"]' ).prop( 'disabled', !( $( this ).prop( 'checked' ) ) );
});

function randomizeSheet() {
	randomizeBio();
	randomizeDisciplines();
	randomizeAttributes();
	randomizeSkills();
	updateTrackers();
}
function randomizeBio() {
    let year = parseInt(new Date().getFullYear());
	$( '#loading__wrapper' ).addClass( 'hidden' );
	let age = randomNumber( 19, 50 );
	$( '#character_age__wrapper input' ).val( age );
	let born = 0;
	switch ( document.querySelector('input[name="freq"]:checked').id.replace( 'randomize_', '' ) ) {
		case 'fledgling':
			born = year - age;
			$( '#character_generation__wrapper input' ).val( randomNumber( 12, 16 ) );
			$( '#add_blood_potency' ).val( $( '#character_generation__wrapper input' ).val() > 13 ? 0 : 1 );
			break;
		case 'neonate':
			born = year - (age + randomNumber( 1, (99-age) ) );
			$( '#character_generation__wrapper input' ).val( randomNumber( 12, 13 ) );
			$( '#add_experience' ).val( 15 );
			$( '#add_blood_potency' ).val( 1 );
			break;
		case 'ancilla':
			born = year - (age + randomNumber( (100-age), (200-age) ) );
			$( '#character_generation__wrapper input' ).val( randomNumber( 10, 11 ) );
			$( '#add_experience' ).val( 35 );
			$( '#add_humanity' ).val( $( '#add_humanity' ).val() - 1 );
			$( '#add_blood_potency' ).val( 2 );
			break;
		case 'elder':
			born = year - (age + randomNumber( (200-age), (1000-age) ) );
			$( '#character_generation__wrapper input' ).val( randomNumber( 6, 8 ) );
			break;
	}
	$( '#character_born__wrapper input' ).val( born );
	$( '#character_embraced__wrapper input' ).val( born + age );
	if ( $( '#randomize_clan option:selected' ).html()== 'Any Clan' ) {
		selectRandomOption( $( '#character_clan' ), true );
	} else {
		$( '#character_clan' ).val( $( '#randomize_clan option:selected' ).html() );
	}
	selectRandomOption( $( '#add_predator_type' ), true );
}

function randomizeDisciplines() {
	let disciplines = [];
	if ( $( '#character_clan' ).val() == 'Thin-blood' ) {
		$( '#character_discipline__select' ).val( CLAN_DISCIPLINES[$( '#character_clan' ).val()][0] );
	} else {
		for ( let index in CLAN_DISCIPLINES[$( '#character_clan' ).val()] ) {
			disciplines.push( CLAN_DISCIPLINES[$( '#character_clan' ).val()][index] )
		}

		let firstDiscipline = randomNumber( 0, disciplines.length );
		$( '#character_discipline__select' ).val(disciplines[firstDiscipline]);
		disciplines.splice( firstDiscipline, 1 );
	}
	$( '#btn-add_discipline' ).removeClass( 'disabled' ).trigger( 'click' );
	handleDisciplineLevelClick(  36, $( '.discipline_add__wrapper:first-child .level' ) );


	if ( $( '#character_clan' ).val() != 'Thin-blood' ) {
		let secondDiscipline = randomNumber( 0, disciplines.length );
		$( '#character_discipline__select' ).val(disciplines[secondDiscipline]);
		console.log( $( '#character_discipline__select' ).val() );
		$( '#btn-add_discipline' ).removeClass( 'disabled' ).trigger( 'click' );
		handleDisciplineLevelClick(  18, $( '.discipline_add__wrapper:nth-child(2) .level' ) );
		setTimeout( function() {
			selectRandomOption( $( '.discipline_add__wrapper:nth-child(2) .power__wrapper:first-child select' ), true );
		}, 500);

		setTimeout( function() {
			selectRandomOption( $( '.discipline_add__wrapper:first-child .power__wrapper:first-child select' ), true );
			selectRandomOption( $( '.discipline_add__wrapper:first-child .power__wrapper:nth-child(2) select' ), true );
		}, 500);
	}
}

function randomizeAttributes() {
	let attributes = []
	for ( let index in CHARACTER_ATTRIBUTES ) {
		for ( let att in CHARACTER_ATTRIBUTES[index].attributes ) {
			attributes.push( CHARACTER_ATTRIBUTES[index].attributes[att] );
		}
	}
	randomizeStatHelper( [ 4, 3, 3, 3, 2, 2, 2, 2, 1 ], attributes );
}

function randomizeSkills() {
	let skills = [];
	let points = [];
	for ( let index in CHARACTER_SKILLS ) {
		skills.push(CHARACTER_SKILLS[index])
	}
	switch ( document.querySelector('input[name="pts_dist"]:checked').value ) {
		case 'jack':
			points = [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
			break;
		case 'balanced':
			points = [ 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1 ];
			break;
		case 'specialist':
			points = [ 4, 3, 3, 3, 2, 2, 2, 1, 1, 1 ];
			break;
	}
	randomizeStatHelper( points, skills );
}

function randomizeStatHelper( points, stats ) {
	while ( points.length > 0 ) {
		let pointsVal = points.pop();
		let index = randomNumber( 0, stats.length );
		statValReplace( stats[index], pointsVal );
		stats.splice( index, 1 );
	}
	while ( stats.length > 0 ) {
		let statsVal = stats.pop();
		statValReplace( statsVal, 0 );
	}
}

function statValReplace( stat, value ) {
	const statSelector = '.attr__wrapper.' + stat.replace(' ', '_') + ' .level';
	if ( $( statSelector ).attr( 'class' ).indexOf( 'expanded' ) > 0 ) {
		$( statSelector ).attr( 'class', 'level expanded level' + value );
	} else {
		$( statSelector ).attr( 'class', 'level level' + value );
	}
}

function randomNumber( min, max ) {
	return Math.floor( Math.random() * (max-min) ) + min;
}
function selectRandomOption( selectElem, skipFirst ) {
	let first = skipFirst ? 1 : 0;
	selectElem.val( selectElem.find( 'option:enabled' )[randomNumber( first, selectElem.find( 'option:enabled' ).length)].value ).trigger( 'change' );
}
function calculateExperienceCost( name ) {
	const container = $( '.' + name );
	let parentClass = container.parent().attr( 'id' );
	if (parentClass == undefined) {
		parentClass = container.parent().parent().attr( 'id' );
	}
	let type = '';
	switch ( parentClass ) {
		case "attribute__wrapper":
			type = 'attribute';
			break;
		case "skills__wrapper":
			type = 'skill';
			break;
		case "disciplines__wrapper":
			const clan = $( '#clan' ).attr( 'class' ).replace( ' img', '' );
			if ( clan == 'Caitiff' ) {
				type = 'caitiff discipline';
			} else {
				const clanDisciplineIndex = CLAN_DISCIPLINES[clan].findIndex(element => {
					return element.toLowerCase() === name.toLowerCase();
				});
				if ( clanDisciplineIndex >= 0) {
					type = 'clan discipline';
				} else {
					type = 'non-clan discipline';
				}
			}
			break;
	}
	let value = EXPERIENCE_VALUES[type];
	try {
		let currentLevel = getSheetStatValue(name, false);
		let maxLevel = 5;
		if ( type == "skill" && container.find( '.level' ).hasClass( 'expanded' ) ) {
			maxLevel = 10;
		}
		if (currentLevel < maxLevel) {
			return (currentLevel + 1) * value;
		}
		return null;
	} catch (e) {
		console.error("ERROR: unable to get current stat level - ", e);
	}
}

String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.substring(1);
};


function getGeneration( object, gen ) {
	for ( let i=0; i<gen; i++) {
		object = object.parent();
	}
	return object;
}

export {
	getCharacterBtn,
	processCharacterData,
	assembleCharacterData,
	assembleCharacterSheetData,
	updateTooltipLocation
};

