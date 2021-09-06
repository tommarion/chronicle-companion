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

$( '#story-toolbar-content' ).on( 'click', '.btn-character', function() {
	if (! $( this ).hasClass( 'active' ) ) {
		$( '.btn-character.active' ).removeClass( 'active' );
		$( '.btn-location.active' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
		let characterId = $( this ).find( 'div' ).data( 'id' );
		processCharacterData( characterId );
		storyToolbarClick();
	}
});

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
		characterDataStr += '<div id="clan" class="' + characterInfo.clan + ' img"></div>'
	} else {
		characterDataStr += '<div id="clan" class="human"></div>'
	}
	if (characterInfo.apparentAge) {
		characterDataStr += '<div><span class="sub-text">Apparent Age:</span> ' + characterInfo.apparentAge + '</div>';
	}
	if (characterInfo.generation) {
		characterDataStr += '<div><span class="sub-text">Generation:</span> ' + characterInfo.generation + '</div>';
	}
	if (characterInfo.pic) {
		characterDataStr += '<div><img src="' + characterInfo.pic + '"/></div>';
	}
	if (characterInfo.bio) {
		characterDataStr += '<div>' + characterInfo.bio + '</div>';
	}
	if (characterInfo.notes && user == 'Storyteller') {
		if (Array.isArray(characterInfo.notes)) {
			for (note in characterInfo.notes) {
				characterDataStr += '<div><span class="note">' + characterInfo.notes[note] + '</span></div>';
			}
		} else {
			characterDataStr += '<div><span class="note">' + characterInfo.notes + '</span></div>';
		}
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
	if (sheetData.skills) {
		characterSheetStr += assembleSkills( sheetData.skills );
	}
	console.log( sheetData );
	characterSheetStr += assembleTrackers( sheetData );
	return characterSheetStr;
}

function assembleAttribute( attribute, attributes ) {
	let attributeValue = attributes[attributeType][attribute];
	let level = "0"
	if (attributeValue != undefined && attributeValue != null) {
		level = attributeValue;
	}
	let attrStr = '<div class="attr__wrapper ' + attribute + '"><span class="title">' + attribute + '</span>' +
				  '<div class="level level' + level + '"></div></div>';
	return attrStr
}

function assembleSkills( skillData ) {
	let skillStr = '<div id="skills__wrapper">';
	for (skill in CHARACTER_SKILLS) {
		let skillName = CHARACTER_SKILLS[skill];
		let skillValue = skillData[skillName];
		let specialty = skillData[skillName + "_specialty"]
		let level = "0"
		if (skillValue != undefined && skillValue != null) {
			level = skillValue;
		}
		skillStr += '<div class="attr__wrapper ' + skillName + '"><span class="title">' + skillName + '</span>';
		if (specialty != undefined) {
				skillStr += '<br/><span class="sub-text">(' + specialty + ')</span>';
		}
		skillStr += '<div class="level level' + level + '"></div></div>';
	}
	skillStr += '</div>';
	return skillStr;
}

function assembleTrackers( trackersInfo ) {
	let trackersStr = '<div id="trackers__wrapper">';
	for (trackerVal in TRACKERS) {
		let tracker = TRACKERS[trackerVal];
		trackersStr += '<div class="tracker__wrapper"><span class="title">' + tracker + '</span>';
		trackersStr += evaluateTracker( tracker, trackersInfo )
		trackersStr += '</div>'
	}
	trackersStr += '</div>';
	return trackersStr;
}

function evaluateTracker( tracker, sheetData ) {
	trackerInfo = sheetData.trackers
	trackerStr = '';
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
		trackerStr += '<div id="humanity-tracker" class="maxlevel' + trackerInfo[tracker + '_max'] + 
			' stains' + trackerInfo[tracker +'_stains'] + '"></div>';
	} else if ( tracker == "hunger" ) {
		trackerStr += '<div id="hunger-tracker" class="level' + trackerInfo[tracker] + '"></div>';
		$( '#hunger-dice__input' ).val( trackerInfo[tracker] );
	}
	return trackerStr
}

$( '#character__wrapper' ).on( 'click', '#willpower-tracker, #health-tracker, #humanity-tracker, #hunger-tracker', function() {
	processContextMenu( $( this ), LEFT_CLICK );
});
$( '#character__wrapper' ).on( 'contextmenu', '#willpower-tracker, #health-tracker, #humanity-tracker, #hunger-tracker', function() {
	processContextMenu( $( this ), RIGHT_CLICK );
	return false;
});

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

