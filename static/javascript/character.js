function processCharacterList( charactersType ) {
	let characters = chronicleSettings.characters[charactersType];
	let characterBtnStr = "";
	for (character in characters) {
		characterBtnStr += '<div class="btn btn-character ' + charactersType + '"><div data-id="' + characters[character].id + '">' + 
		characters[character].name + '</div></div>';
	}
	characterBtnStr += '<div class="spacer"></div>';
	$( '#story-toolbar-content' ).html(characterBtnStr);
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
	loadCharacterById( characterId );
}

function assembleCharacterData( characterInfo ) {
	console.log( characterInfo );
	let flexStr = ""
	if (characterInfo.sheet) {
		flexStr = ' id="character-sheet__wrapper"';
	}
	let characterDataStr = '<div' + flexStr + '><div id="character-bio" data-id="' + characterInfo.id + '"><div class="header ' + 
		characterInfo.type + ' characterName">' + characterInfo.name + '</div>';
	if (characterInfo.aka) {
		characterDataStr += '<div id="aka"><span class="sub-text">A.K.A. ' + characterInfo.aka + '</span></div>';
	}
	if (characterInfo.clan) {
		characterDataStr += '<div id="clan" class="' + characterInfo.clan.replace( ' ', '-' ) + ' img"></div>'
	} else {
		characterDataStr += '<div id="clan" class="human"></div>'
	}
	if (characterInfo.apparent_age) {
		characterDataStr += '<div><span class="sub-text">Apparent Age:</span> ' + characterInfo.apparent_age + '</div>';
	}
	if (characterInfo.generation) {
		characterDataStr += '<div><span class="sub-text">Generation:</span> ' + characterInfo.generation + '</div>';
	}
	if (characterInfo.born) {
		characterDataStr += '<div><span class="sub-text">Born:</span> ' + characterInfo.born + '</div>';
	}
	if (characterInfo.embraced) {
		characterDataStr += '<div><span class="sub-text">Embraced:</span> ' + characterInfo.embraced + '</div>';
	}
	if (characterInfo.predator_type) {
		characterDataStr += '<div><span class="sub-text">Predator Type:</span> ' + characterInfo.predator_type + '</div>';
	}
	if (characterInfo.blood_potency) {
		characterDataStr += '<div><span class="sub-text">Blood Potency:</span> ' + characterInfo.blood_potency + '</div>';
	}
	if (characterInfo.bio) {
		characterDataStr += '<div>' + characterInfo.bio + '</div>';
	}
	if (characterInfo.pic) {
		characterDataStr += '<div><img src="' + characterInfo.pic + '"/></div>';
	}
	if (characterInfo.sheet.disciplines) {
		characterDataStr += '<div id="sheet_disciplines__wrapper">';
		characterDataStr += assembleDisciplines( characterInfo.sheet.disciplines );
		characterDataStr += '</div>';
	}
	characterDataStr += assembleDetails( characterInfo.sheet );
	if (user == 'Storyteller') {
		characterDataStr += '<div id="character-notes__wrapper">';
	 	if (characterInfo.notes) {
			try { 
				const notesArray = JSON.parse(characterInfo.notes)
				for (note in notesArray) {
					characterDataStr += '<div class="flex"><span class="note">' + notesArray[note] + 
					'</span><div class="btn_remove-note btn"></div></div>';
				}
			} catch (e) {
				characterDataStr += '<div class="flex"><span class="note">' + characterInfo.notes + 
					'</span><div class="btn_remove-note btn"></div></div>';
			}
		}
		characterDataStr += '<div id="btn_add-note__wrapper"><input id="add-note__input"/><div id="btn_add-note" class="btn">+</div></div></div>';
	}
	characterDataStr += '</div>';
	if (characterInfo.sheet.attributes) {
		characterDataStr += '<div id="character-sheet">' +
			assembleCharacterSheetData( characterInfo.sheet ) + '</div>';
	}

	return characterDataStr;
}

function assembleCharacterSheetData( sheetData ) {
	let characterSheetStr = '<div id="attribute__wrapper">';
	let index = 0;
	for (attributesType in CHARACTER_ATTRIBUTES) {
		attributeType = CHARACTER_ATTRIBUTES[attributesType].type;
		characterSheetStr += '<div><span class="title sub-text pad-bottom">' + attributeType + '</span>';
		for (attributeName in CHARACTER_ATTRIBUTES[attributesType].attributes) {
			attribute = CHARACTER_ATTRIBUTES[attributesType].attributes[attributeName]
			characterSheetStr += assembleAttribute( attribute, sheetData.attributes )
		}
		characterSheetStr += '</div>';
	}
	characterSheetStr += '</div>';
	characterSheetStr += assembleSkills( sheetData.skills );
	if (sheetData.trackers) {
		characterSheetStr += assembleTrackers( sheetData );
	}
	return characterSheetStr;
}

function assembleAttribute( attribute, attributes ) {
	let level = "0";
	if (attributes != undefined && attributes[attributeType] != undefined &&
			attributes[attributeType][attribute] != undefined ) {
		level = attributes[attributeType][attribute];
	}
	let attrStr = '<div class="attr__wrapper ' + attribute + '"><span class="title">' + attribute + '</span>' +
				  '<div class="level level' + level + '"></div></div>';
	return attrStr
}

function assembleSkills( skillData ) {
	let skillStr = '<div id="skills__wrapper">';
	for (skill in CHARACTER_SKILLS) {
		let skillName = CHARACTER_SKILLS[skill];
		let level = "0";
		if ( skillData != undefined && skillData[skillName.replace(' ', '_')] != undefined ) {
			level = skillData[skillName.replace(' ', '_')];
		}
		skillStr += '<div class="attr__wrapper ' + skillName.replace(' ', '_') + '"><span class="title">' + skillName + '</span>';
		if (skillData != undefined && skillData[skillName + "_specialty"] != undefined) {
				skillStr += '<br/><span class="sub-text">(' + skillData[skillName + "_specialty"] + ')</span>';
		}
		skillStr += '<div class="level level' + level + '"></div></div>';
	}
	skillStr += '</div>';
	return skillStr;
}

function assembleDisciplines( disciplineInfo ) {
	let disciplinesStr = '<div class="header">Disciplines</div><div id="disciplines__wrapper">';
	for (index in disciplineInfo) {
		disciplinesStr += '<div class="discipline__wrapper">';
		disciplinesStr += '<span class="title">' + disciplineInfo[index].discipline + '</span>';
		if ( disciplineInfo[index].level != 0 ) {
			disciplinesStr += '<div class="level level' + disciplineInfo[index].level + '"></div>';
		}
		disciplinesStr += '</div>';
		if (disciplineInfo[index].powers) {
			let powers = JSON.parse(disciplineInfo[index].powers);
			disciplinesStr += '<ul class="discipline_powers">';
			for (power in powers) {
				disciplinesStr += '<li class="discipline_power">' + powers[power] + '</li>';
			}
			disciplinesStr += '</ul>';
		}
	}
	disciplinesStr += '</div>';
	return disciplinesStr;
}

function assembleDetails( sheetData ) {
	let advantagesStr = '<span class="title">Advantages</span><ul id="advantages_sheet__wrapper">';
	for ( index in sheetData.advantages ) {
		advantagesStr += '<li class="advantage__wrapper">';
		advantagesStr += '<span class="sub-title">' + sheetData.advantages[index].name + '</span>';
		advantagesStr += '</li>';
	}
	advantagesStr += '</ul>';
	let flawsStr = '<span class="title">Flaws</span><ul id="flaws_sheet__wrapper">';
	for ( index in sheetData.flaws ) {
		flawsStr += '<li class="flaw__wrapper">';
		flawsStr += '<span class="sub-title">' + sheetData.flaws[index].name + '</span>';
		flawsStr += '</li>';
	}
	flawsStr += '</ul>';
	let convictionsStr = '<span class="title">Convictions</span><ul id="convictions_sheet__wrapper">';
	for ( index in sheetData.convictions ) {
		convictionsStr += '<li class="conviction__wrapper">';
		convictionsStr += '<span class="sub-title">' + sheetData.convictions[index].name + '</span>';
		convictionsStr += '</li>';
	}
	convictionsStr += '</ul>';
	let touchstonesStr = '<span class="title">Touchstones</span><ul id="touchstones_sheet__wrapper">';
	for ( index in sheetData.touchstones ) {
		touchstonesStr += '<li class="touchstone__wrapper">';
		touchstonesStr += '<span class="sub-title">' + sheetData.touchstones[index].name + '</span>';
		touchstonesStr += '</li>';
	}
	touchstonesStr += '</ul>';
	return advantagesStr + flawsStr + convictionsStr + touchstonesStr;
}

function assembleTrackers( trackersInfo ) {
	let trackersStr = '<div id="trackers__wrapper">';
	for (trackerVal in TRACKERS) {
		let tracker = TRACKERS[trackerVal];
		trackersStr += evaluateTracker( tracker, trackersInfo )
	}
	trackersStr += '</div>';
	return trackersStr;
}

function evaluateTracker( tracker, sheetData ) {
	trackerInfo = sheetData.trackers
	trackerStr = '<div class="tracker__wrapper"><span class="title">' + tracker + '</span>';
	if ( tracker == "health" || tracker == "willpower" ) {
		if ( tracker == "health" ) {
			maxHealth = sheetData.attributes.physical.stamina + 3;
			trackerStr += '<div id="health-tracker" class="maxlevel' + maxHealth;
		} else if ( tracker == "willpower" ) {
			maxWillpower = sheetData.attributes.social.composure + sheetData.attributes.mental.resolve;
			trackerStr += '<div id="willpower-tracker" class="maxlevel' + maxWillpower;
		}
		trackerStr += ' superficial' + trackerInfo[tracker + '_superficial'] + ' aggravated' +
			trackerInfo[tracker + '_aggravated'] + '"></div>';
	} else if ( tracker == "humanity" ) {
		if (trackerInfo[tracker + '_max'] < 0 ||
			trackerInfo[tracker + '_stains']) {
			return "";
		}
		trackerStr += '<div id="humanity-tracker" class="maxlevel' + trackerInfo[tracker + '_max'] + 
			' stains' + trackerInfo[tracker +'_stains'] + '"></div>';
	} else if ( tracker == "hunger" ) {
		if (trackerInfo[tracker] < 0) {
			return "";
		}
		trackerStr += '<div id="hunger-tracker" class="level' + trackerInfo[tracker] + '"></div>';
		$( '#hunger-dice__input' ).val( trackerInfo[tracker] );
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

