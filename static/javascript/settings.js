$( '#story-text__none' ).on( 'click', function() {
	$( '#value-modifier__background' ).removeClass( 'hidden' );
	$( '#chronicle_settings__wrapper' ).removeClass( 'hidden' );
});

$( '#btn-chronicle__settings' ).on( 'click', function(){
	if (settingsMode == SETTINGS_MODE_APP) {
		if ( authenticated ) {
			$( '#value-modifier__background' ).removeClass( 'hidden' );
			$( '#app_settings__wrapper' ).removeClass( 'hidden' );
		} else {
			$( '#password_entry__wrapper' ).addClass( 'settings' ).removeClass( 'hidden' );
		}
	} else {
		$( '#value-modifier__background' ).removeClass( 'hidden' );
		$( '#chronicle_settings__wrapper' ).removeClass( 'hidden' );
	}
});

$( '.btn-chronicle-enabled' ).on( 'click', function() {
	let toggle = $( this ).hasClass( 'disabled' ) ? ENABLE : DISABLE;
	if (confirm( "Do you want to " + toggle + " " + $( this ).find( 'input' ).val() + "?")) {
		toggleChronicleEnabled( $( this ).data( 'id' ), toggle );
	}
});

$( '.btn-chronicle-enabled input, #story_list input' ).on( 'click', function( e ) {
	e.stopPropagation();
});

function handleToggleEnabledResponse( response ) {
	let selector = $( ".btn-chronicle[data-id='" + response.rowid + "'], " + 
		".btn-chronicle-enabled[data-id='" + response.rowid + "']" );
	if ( response.enabled ) {
		selector.removeClass( 'disabled' );
	} else {
		selector.addClass( 'disabled' );
	}
}

$( '#btn__close-app-settings' ).on( 'click', function() {
	$( '#value-modifier__background' ).addClass( 'hidden' );
	$( '#app_settings__wrapper' ).addClass( 'hidden' );
});
$( '#btn__close-chronicle-settings' ).on( 'click', function() {
	$( '#value-modifier__background' ).addClass( 'hidden' );
	$( '#chronicle_settings__wrapper' ).addClass( 'hidden' );
});

function populateChronicleSettings( chronicleSettings ) {
	$( '#chronicle_name__input' ).val( chronicleSettings.name );
	$( '#story_list' ).html( getChronicleSettingsStory( chronicleSettings.chapters ) );
	$( '#pc_list' ).html( getChronicleSettingsCharacters( chronicleSettings.characters.pc ) );
	$( '#npc_list' ).html( getChronicleSettingsCharacters( chronicleSettings.characters.npc ) );
	$( '#locations_list' ).html( getChronicleSettingsLocations( chronicleSettings.locations ) );
}

function getChronicleSettingsStory( chapters ) {
	let chapterCount = 1;
	let storyStr = '';
	for (chapter in chapters) {
		let chapterObj = chapters[chapter];
		let sceneCount = 1;
		storyStr += '<div><div class="chapter-header toolbar-item-header">Chapter ' + chapterCount + ' ~ ';
		storyStr += "<input class='chapter-name' value='" + chapterObj.name + "'/></div>";
		storyStr += '<div class="chapter__wrapper">';
		for (scene in chapterObj.scenes) {
			let sceneObj = chapterObj.scenes[scene];
			storyStr += getSceneStr( sceneCount, sceneObj.name, sceneObj.story, scene > 0, true, false );
			sceneCount++;
		}
		storyStr += getSceneStr( sceneCount, '', '', false, false, true );
		storyStr += '</div></div>';
		chapterCount++;
	}
	storyStr += '<div class="add_chapter__wrapper"><div class="header">Add Chapter</div><div class="chapter-header">Chapter ' + chapterCount + ' ~ ';
	storyStr += '<input class="chapter-name"/></div>';
	storyStr += '<div class="chapter__wrapper add">';
	storyStr += getSceneStr( 1, '', '', false, false, false );
	storyStr += '</div><div class="btn btn__add-chapter disabled">Add chapter</div></div>';
	return storyStr;
}

function getSceneStr( num, name, story, isRemoveable, isCollapsible, isAdd ) {
	let headerDivClass = '';
	let wrapperDivClass = ' add';
	let addWrapperClass = '';
	if ( isCollapsible ) {
		headerDivClass = ' toolbar-item-header';
		wrapperDivClass = '';
		
	}
	if ( isAdd ) {
		addWrapperClass = 'add_scene__wrapper';
	}

	let sceneStr = '<div class="' + addWrapperClass + '">';
	if ( isAdd ) {
		sceneStr += '<div class="header">Add Scene</div>';
	}
	sceneStr += '<div class="scene-header' + headerDivClass + '">Scene <span class="number">' + num + '</span> ~ ';
	sceneStr += "<input class='scene-name' value='" + name + "'/></div>";
	sceneStr += '<div class="scene__wrapper' + wrapperDivClass + '">';
	

	sceneStr += '<textarea class="scene-story__text">' + story + '</textarea></div>';
	
	if ( isAdd ) {
		sceneStr += '<div class="btn btn__add-scene disabled">Add scene</div>';
	} else if ( isRemoveable ) {
		sceneStr += '<div class="btn btn__remove-scene">&times;</div>';
	}
	sceneStr += '</div>';
	return sceneStr;
}

function getChronicleSettingsCharacters( characters ) {
	let charactersStr = '';
	for ( character in characters ) {
		charactersStr += '<div class="btn btn_settings_character" data-id="' + characters[character].id + 
			'"><div>' + character + '</div></div>';
	}
	charactersStr += '<div class="btn btn_settings_character add"><div>+</div></div>';
	return charactersStr;
}

function getChronicleSettingsLocations( locations ) {
	console.log( locations );
	let locationsStr = '';
	for ( locationVal in locations ) {
		locationsStr += '<div class="btn btn_settings_location"><div>' + locationVal + '</div></div>';
	}
	locationsStr += '<div class="btn btn_settings_location add"><div>+</div></div>';
	return locationsStr;
}

$( '#story_list' ).on( 'click', '.btn__remove-scene', function() {
	if (confirm( "Are you sure you want to remove this scene?")) {
		let sceneNum = parseInt($( this ).parent().find( 'span.number' ).html());
		$( this ).parent().parent()
		$( this ).parent().prev().remove();
		$( this ).parent().remove();
	}
});

$( '#story_list' ).on( 'click', '.toolbar-item-header', function() {
	$( this ).next().slideToggle();
});

$( '#chronicle_settings' ).on( 'click', '.btn_settings_character', function() {
	$( '#player_sheet_add' ).removeClass( 'hidden' );
	$( '#value-modifier__dialog' ).removeClass( 'hidden' );
	let type = 'npc'
	if ( $( this ).parent().attr( 'id' ) == 'pc_list' ) {
		type = 'pc';
	}
	$( '#player_sheet_add' ).data( 'type', type );
	let sheetData = {};
	$( '#attr_stats__wrapper' ).html( assembleCharacterSheetData( sheetData ) );

	if ( $( this ).hasClass( 'add' ) ) {
		$( '#player_sheet_add' ).data( 'function', 'add' );
	} else {
		populateCharacterSheetSettings(  );
		$( '#player_sheet_add' ).data( 'function', 'edit' );
	}

	$( '#character_discipline__select' ).html( '<option selected disabled>' + DISCIPLINE_OPTION_DEFAULT + '</option>' );
	for (discipline in DISCIPLINES) {
		if ( discipline == BLOOD_SORCERY_RITUALS || discipline == 'Thin-Blood Alchemy' ) {
			continue;
		}
		$( '#character_discipline__select' ).append( '<option>' + discipline + '</option>' );
	}
});

$( '#chronicle_settings' ).on( 'click', '.btn_settings_location', function() {
	$( '#location_add' ).removeClass( 'hidden' );
	$( '#value-modifier__dialog' ).removeClass( 'hidden' );
	populateHavenSelect();
});

$( '#character_sheet_cancel' ).on( 'click', function() {
	if ( confirm("Are you sure you want to cancel character creation?\nForm will be cleared") ) {
		clearAndCloseCharacterSheetForm();
	}
});

$( '#character_sheet_save' ).on( 'click', function() {
	if ( confirm("Are you sure you want to save this character?\nYou will be able to edit it later") ) {
		const characterObj = serializeSheet();
		if ( characterObj ) {
			const loc = window.location.href;
			const chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
			saveCharacter( characterObj, chronicleId );
		}
	}
});
$( '#btn__cancel_location' ).on( 'click', function() {
	if ( confirm("Are you sure you want to cancel location entry?\nForm will be cleared") ) {
		clearAndCloseLocationForm();
	}
});
$( '#btn__save_location' ).on( 'click', function() {
	if ( confirm("Are you sure you want to save this location?\nYou will be able to edit it later") ) {
		const locationObj = serializeLocation();
		if ( locationObj ) {
			const loc = window.location.href;
			const chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
			saveLocation( locationObj, chronicleId );
		}
	}
});

function populateHavenSelect() {
	$( '#location_add_haven' ).html( '<option selected>None</option>' );
	for ( character in chronicleSettings.characters.pc ) {
		$( '#location_add_haven' ).append( '<option value="' + chronicleSettings.characters.pc[character].id +
			'">' + character + '</option>' );
	}
	for ( character in chronicleSettings.characters.npc ) {
		$( '#location_add_haven' ).append( '<option value="' + chronicleSettings.characters.npc[character].id +
			'">' + character + '</option>' );
	}
}

function clearAndCloseCharacterSheetForm() {
	$( '#player_sheet_add' ).addClass( 'hidden' );
	$( '#value-modifier__dialog' ).addClass( 'hidden' );
	$( '#player_sheet__wrapper input, #player_sheet__wrapper textarea' ).val( '' );
	$( '#player_sheet_add .clear' ).html( '' );
	$( '#character_clan' ).val( 'Select Clan' );
	$( '#player_sheet_add' ).removeData( 'type' );
}
function clearAndCloseLocationForm() {
	$( '#location_add' ).addClass( 'hidden' );
	$( '#value-modifier__dialog' ).addClass( 'hidden' );
	$( '#location_add__wrapper input, #location_add__wrapper textarea' ).val( '' );
}

$( '#player_sheet__wrapper' ).on( 'click', '.attr__wrapper', function() {
	$( '#attr-title' ).html( $( this ).find( '.title' ).html() );
	$( '#attr_level' ).attr( 'class', $( this ).find( '.level' ).attr( 'class' ) );
	if ( $( this ).find( '.sub-text' ).length > 0 ) {
		$( '#attr_specialty>input' ).val( $( this ).find( '.sub-text' ).text().replace( '(', '' ).replace( ')', '' ) );
	}
	$( '#attr_edit__wrapper' ).removeClass( 'hidden' );
});

$( '#attr_cancel' ).on( 'click', function() {
	closeAndClearAttrWindow();
});

$( '#attr_save' ).on( 'click', function() {
	attrObj = $( '#attr_stats__wrapper' ).find( '.' + $( '#attr-title' ).html().replace( ' ', '_' ) );
	attrObj.find( '.level' ).attr( 'class', $( '#attr_level' ).attr( 'class' ) );
	specialty = $( '#attr_specialty>input' ).val();
	if ( specialty == '' ) {
		attrObj.find( '.sub-text' ).remove();
		attrObj.remove( 'br' );
	} else {
		if ( attrObj.find( '.sub-text' ).length > 0 ) {
			attrObj.find( '.sub-text' ).html( '(' + specialty + ')' );
		} else {
			attrObj.find( '.level' ).before( '<br/><span class="sub-text">(' + specialty + ')</span>' );
		}
	}
	$( '#add_health' ).val( parseInt( getStatValue( 'stamina' ) ) + 3 );
	$( '#add_willpower' ).val( parseInt( getStatValue( 'composure' ) ) + 
		parseInt( getStatValue( 'resolve' ) ) );
	closeAndClearAttrWindow();
});

function closeAndClearAttrWindow() {
	$( '#attr_edit__wrapper' ).addClass( 'hidden' );
	$( '#attr_edit__window' ).find( 'input' ).val( '' );
	$( '#attr_level' ).attr( 'class', 'level level0' );
}

$( '#attr_level' ).on( 'click', function( event ) {
	levelWidth = parseInt( $( '#attr_level' ).width() );
	$( this ).attr( 'class', 'level level' + Math.ceil( event.offsetX / ( levelWidth / 5 ) ) );
});

$( '#remove__level' ).on( 'click', function() {
	$( '#attr_level' ).attr( 'class', 'level level0' );
});

$( '#btn-add_discipline' ).on( 'click', function() {
	let selected = $( '#character_discipline__select' ).find( ':selected' );
	if ( selected.text() != DISCIPLINE_OPTION_DEFAULT && !$( this ).hasClass( 'disabled' ) ) {
		discString = '<div class="discipline_add__wrapper ' + selected.text().replace( ' ', '_' ) + 
			'"><div class="discipline-name">' + selected.text() + '</div><div class="disc_remove btn">&times;</div>';
		if ( selected.text() == BLOOD_SORCERY_RITUALS ) {
			const bloodSorceryLevel = parseInt( $( '.Blood_Sorcery' ).find( '.level' ).attr( 'class' ).replace( 'level level', '' ) );
			if ( bloodSorceryLevel == 0 ) {
				return;
			}
			discString += '<div class="rituals__list"></div><div class="ritual_add__wrapper"><select class="ritual add">';
			discString += '<option selected disabled>Select Ritual</option>';
			discString += getBloodSorceryRitualOptions( bloodSorceryLevel );
			discString += '</select><div class="btn_ritual_add btn">Add</div></div>';
		} else {
			if ( selected.text() == "Blood Sorcery" ) {
				$( '#character_discipline__select' ).append( '<option>' + BLOOD_SORCERY_RITUALS + '</option>' );
			}
			discString += '<div class="level level0"></div>';
		}
		discString += '<div class="powers_list"></div></div>';
		$( '#disciplines__list__wrapper' ).append( discString );
		selected.remove();
		$( '#character_discipline__select' ).val( DISCIPLINE_OPTION_DEFAULT );
		$( this ).addClass( 'disabled' );
	}
});

$( '#add_disciplines__wrapper' ).on( 'click', '.btn_ritual_add', function() {
	$( '.rituals__list' ).append( '<select class="ritual">' + $( '.ritual.add' ).html() + '</select>' );
	$( '.rituals__list .ritual:last-child' ).val( $( '.ritual.add' ).find( ':selected' ).html() );
	$( '.ritual.add' ).find( ':selected' ).remove();
	$( '.ritual.add' ).val( 'Select Ritual' );
});

function getBloodSorceryRitualOptions( level ) {
	let ritualsStr = '';
	const rituals = DISCIPLINES[BLOOD_SORCERY_RITUALS];
	for ( ritualLevel in rituals ) {
		if ( ritualLevel >= level ) {
			break;
		}
		for ( ritual in rituals[ritualLevel] ) {
			ritualsStr += '<option>' + rituals[ritualLevel][ritual] + '</option>';
		}
	}
	return ritualsStr;
}

$( '#disciplines__list__wrapper' ).on( 'click', '.level', function( event ) {
	const levelWidth = parseInt( $( '#attr_level' ).width() );
	const level = Math.ceil( event.offsetX / ( levelWidth / 5 ) );
	$( this ).attr( 'class', 'level level' + level );
	let powersString = '';
	for (let i=0; i<level; i++) {
		if ( i > 0 ) {
			powersString += '<br/>';
		}
		powersString += '<select><option selected disabled>Select Power</option>';
		const disciplineValues = DISCIPLINES[$( this ).prev().prev().text()];
		for (powerLevel in disciplineValues) {
			if (powerLevel <= i) {
				for (power in disciplineValues[powerLevel]) {
					powersString += '<option>' + disciplineValues[powerLevel][power].name + '</option>';
				}
			}
		}
		powersString += '</select>';
	}
	$( this ).next().html( powersString );
});

function getStatValue( stat ) {
	return $( '#attr_stats__wrapper' ).find( '.' + stat ).find( '.level' ).attr( 'class' ).replace( 'level level', '' );
}

function getSpecialty( stat ) {
	let specialtyObj = $( '#attr_stats__wrapper' ).find( '.' + stat ).find( '.sub-text' );
	if ( specialtyObj ) {
		return specialtyObj.text().replace( '(', '' ).replace( ')', '' );
	}
	return null;
}

$( '#character_discipline__select' ).on( 'change', function() {
	if ( $( this ).find( ':selected' ).text() == DISCIPLINE_OPTION_DEFAULT ) {
		$( '#btn-add_discipline' ).addClass( 'disabled' );
	} else {
		$( '#btn-add_discipline' ).removeClass( 'disabled' );
	}
});

$( '.detail_add__wrapper input' ).on( 'keyup', function() {
	if ( $( this ).val() == '' ) {
		$( this ).next().addClass( 'disabled' );
	} else {
		$( this ).next().removeClass( 'disabled' );
	}
});

$( '.btn_detail__add' ).on( 'click', function() {
	if ( !$( this ).hasClass( 'disabled' ) ) {
		let value = $( this ).prev().val();
		let detailStr = '<div class="flex">';
		if ( $( this ).hasClass( 'has_level' ) ) {
			detailStr += '<input value="' + value + '"/><div class="level level0"></div>';
		} else {
			detailStr += '<input class="wide" value="' + value + '"/>';
		}
		detailStr += '<div class="remove_detail btn">&times;</div></div>'
		$( this ).parent().prev().append( detailStr );
		$( this ).prev().val( '' );
	}
});

$( '#character_info__wrapper' ).on( 'click', '.remove_detail', function() {
	$( this ).parent().remove();
});

$( '#app_settings__wrapper' ).on( 'click')

$( '#advantages__wrapper, #flaws__wrapper' ).on( 'click', '.level', function( event ) {
	const levelWidth = parseInt( $( this ).width() );
	const level = Math.ceil( event.offsetX / ( levelWidth / 5 ) );
	$( this ).attr( 'class', 'level level' + level );
});

$( '#story_list' ).on( 'blur', 'input, textarea', function() {
	if ( !$( this ).parent().parent().hasClass( 'add_scene__wrapper' ) &&
			!$( this ).parent().parent().hasClass( 'add_chapter__wrapper' ) && 
			!$( this ).parent().parent().parent().parent().hasClass( 'add_chapter__wrapper' ) ) {
		const loc = window.location.href;
		const chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
		let postData = {
			'value' : $( this ).val(),
			'chapterIndex' : null,
			'sceneIndex' : null,
			'mode' : ''
		};
		switch ( $( this ).attr( 'class' ) ) {
			case 'chapter-name':
				postData['chapterIndex'] = $( this ).parent().parent().index();
				if ( chronicleSettings.chapters[postData['chapterIndex']].name != postData['value'] ) {
					if ( postData['value'] == '' ) {
						$( this ).val( chronicleSettings.chapters[postData['chapterIndex']].name );
					} else {
						updateStory( 'PUT', postData, chronicleId );	
					}
					
				}
				break;
			case 'scene-name':
				postData['sceneIndex'] = $( this ).parent().parent().index();
				postData['chapterIndex'] = $( this ).parent().parent().parent().parent().index();
				if ( chronicleSettings.chapters[postData['chapterIndex']].scenes[postData['sceneIndex']].name != postData['value'] ) {
					if ( postData['value'] == '' ) {
						$( this ).val( chronicleSettings.chapters[postData['chapterIndex']].scenes[postData['sceneIndex']].name );
					} else {
						postData['mode'] = 'name';
						updateStory( 'PUT', postData, chronicleId );	
					}
					
				}
				break;
			case 'scene-story__text':
				postData['sceneIndex'] = $( this ).parent().parent().index();
				postData['chapterIndex'] = $( this ).parent().parent().parent().parent().index();
				postData['value'] = assembleStoryText( postData['value'] )
				if ( chronicleSettings.chapters[postData['chapterIndex']].scenes[postData['sceneIndex']].story != postData['value'] ) {
					if ( postData['value'] == '' ) {
						$( this ).val( chronicleSettings.chapters[postData['chapterIndex']].scenes[postData['sceneIndex']].story );
					} else {
						postData['mode'] = 'story';
						updateStory( 'PUT', postData, chronicleId );	
					}
					
				}
				break;	
		}
	}
});

$( '#story_list' ).on( 'keyup', '.add_scene__wrapper input, .add_scene__wrapper textarea', function() {
	if ( $( '.add_scene__wrapper' ).find( '.scene-name' ).val() != '' &&
			$( '.add_scene__wrapper' ).find( '.scene-story__text' ) != '' ) {
		$( '.btn__add-scene' ).removeClass( 'disabled' );
	} else {
		$( '.btn__add-scene' ).addClass( 'disabled' );
	}
});

$( '#story_list' ).on( 'keyup', '.add_chapter__wrapper input, .add_chapter__wrapper textarea', function() {
	if ( $( '.add_chapter__wrapper' ).find( '.chapter-name' ).val() != '' &&
			$( '.add_chapter__wrapper' ).find( '.scene-name' ).val() != '' &&
			$( '.add_chapter__wrapper' ).find( '.scene-story__text' ).val() != '' ) {
		$( '.btn__add-chapter' ).removeClass( 'disabled' );
	} else {
		$( '.btn__add-chapter' ).addClass( 'disabled' );
	}
});

$( '#story_list' ).on( 'click', '.btn__add-scene', function() {
	if ( !$( this ).hasClass( 'disabled' ) ) {
		const loc = window.location.href;
		const chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
		let postData = {
			'chapterName' : null,
			'sceneName' : $( '.add_scene__wrapper' ).find( '.scene-name' ).val(),
			'story' : assembleStoryText( $( '.add_scene__wrapper' ).find( '.scene-story__text' ).val() ),
			'sceneIndex' : $( '.add_scene__wrapper' ).index(),
			'chapterIndex' : $( '.add_scene__wrapper' ).parent().parent().index()
		}
		if ( postData['sceneName'] != '' && postData['sceneStory'] != '' ) {
			updateStory( 'POST', postData, chronicleId );
		}
	}
});

$( '#story_list' ).on( 'click', '.btn__add-chapter', function() {
	if ( !$( this ).hasClass( 'disabled' ) ) {
		const loc = window.location.href;
		const chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
		let postData = {
			'chapterName' : $( '.add_chapter__wrapper' ).find( '.chapter-name' ).val(),
			'sceneName' : $( '.add_chapter__wrapper' ).find( '.scene-name' ).val(),
			'story' : assembleStoryText( $( '.add_chapter__wrapper' ).find( '.scene-story__text' ).val() ),
			'chapterIndex' : $( '.add_chapter__wrapper' ).index()
		}
		if ( postData['chapterName'] != '' && postData['sceneName'] != '' && postData['sceneStory'] != '' ) {
			updateStory( 'POST', postData, chronicleId );
		}
	}
});

function assembleStoryText( text ) {
	let textList = text.split( '\n\n' );
	let textStr = '';
	for ( index in textList ) {
		textStr += '<p>' + textList[index] + '</p>';
	}
	return textStr;
}
