$( '#story-text__none' ).on( 'click', function() {
	$( '#value-modifier__background' ).removeClass( 'hidden' );
	$( '#chronicle_settings__wrapper' ).removeClass( 'hidden' );
});

$( '#btn-chronicle__settings' ).on( 'click', function(){
	if ( settingsMode == SETTINGS_MODE_APP ) {
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
			storyStr += getSceneStr( sceneCount, sceneObj.name, sceneObj.story, chapterObj.scenes.length > 1, true, false );
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
	sceneStr += "<input class='scene-name' value='" + name + "'/>";
	if ( isRemoveable ) {
		sceneStr += '<div class="btn btn__remove-scene">&times;</div>';
	}
	sceneStr += '</div>';
	sceneStr += '<div class="scene__wrapper' + wrapperDivClass + '">';
	

	sceneStr += '<textarea class="scene-story__text">' + story + '</textarea></div>';
	
	if ( isAdd ) {
		sceneStr += '<div class="btn btn__add-scene disabled">Add scene</div>';
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
	let locationsStr = '';
	for ( locationVal in locations ) {
		locationsStr += '<div class="btn btn_settings_location" data-id="' + locations[locationVal].rowid + 
			'"><div>' + locationVal + '</div></div>';
	}
	locationsStr += '<div class="btn btn_settings_location add"><div>+</div></div>';
	return locationsStr;
}

$( '#story_list' ).on( 'click', '.btn__remove-scene', function() {
	if (confirm( "Are you sure you want to remove this scene?")) {
		const sceneWrapper = $( this ).parent().parent();
		const chapterWrapper = sceneWrapper.parent().parent();

		const loc = window.location.href;
		const chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
		let postData = {
			'sceneIndex' : parseInt(sceneWrapper.index()),
			'chapterIndex' : parseInt(chapterWrapper.index())
		}
		updateStory( 'DELETE', postData, chronicleId );
		
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
	loadSheet()

	if ( $( this ).hasClass( 'add' ) ) {
		$( '#player_sheet_add' ).data( 'function', 'add' );
	} else {
		populateCharacterSheetSettings( $( this ).find( 'div' ).html(), $( this ).parent().attr( 'id' ).replace( '_list', '' ) );
		$( '#player_sheet_add' ).data( 'function', 'edit' );
		$( '#player_sheet_add' ).data( 'id', $( this ).data( 'id' ) );
	}

	$( '#character_discipline__select' ).html( '<option selected disabled>' + DISCIPLINE_OPTION_DEFAULT + '</option>' );
	for (discipline in DISCIPLINES) {
		if ( discipline == BLOOD_SORCERY_RITUALS || discipline == 'Thin-Blood Alchemy' ) {
			continue;
		}
		$( '#character_discipline__select' ).append( '<option>' + discipline + '</option>' );
	}
	updateTrackers();
	populateCharacterEntryData();
	$( '#character_name__wrapper>input' ).focus();
});

$( '#chronicle_settings' ).on( 'click', '.btn_settings_location', function() {
	$( '#location_add' ).removeClass( 'hidden' );
	$( '#value-modifier__dialog' ).removeClass( 'hidden' );
	populateHavenSelect();
	if ( $( this ).hasClass( 'add' ) ) {
		$( '#location_add__wrapper' ).data( 'function', 'add' );
	} else {
		$( '#location_add__wrapper' ).data( 'function', 'edit' );
		$( '#location_add__wrapper' ).data( 'id',  $( this ).data( 'id' ) );
		populateLocationForm( $( this ).find( 'div' ).html() );
	}
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
			let chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
			if ( chronicleId.indexOf( '&' ) != -1 ) {
				chronicleId = chronicleId.substring( 0, chronicleId.indexOf( '&' ) );
			}
			if ( $( '#player_sheet_add' ).data( 'function' ) == 'edit' ) {
				characterObj['id'] = $( '#player_sheet_add' ).data( 'id' );
				saveCharacter( 'PUT', characterObj, chronicleId );
			} else {
				saveCharacter( 'POST', characterObj, chronicleId );
			}
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
		const loc = window.location.href;
		const chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
		if ( locationObj ) {
			if ( $( '#location_add__wrapper' ).data( 'function' ) == 'edit' ) {
				locationObj['id'] = $( '#location_add__wrapper' ).data( 'id' );
				saveLocation( 'PUT', locationObj, chronicleId );
			} else {
				saveLocation( 'POST', locationObj, chronicleId );
			}
		}
	}
});
$( '#location_add__wrapper' ).on( 'change', '#location_add_haven', function() {
	if ( $( '#location_add_haven' ).val().includes( 'None' ) ) {
		$( '#location_add_haven' ).val( 'None' );
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

function populateCharacterEntryData() {
	const selectClasses = $( '#character_bound_to__select, #character_touchstone_for, #character_retainer_for' );
	selectClasses.html( '<option selected>None</option>' );
	
	for ( character in chronicleSettings.characters.pc ) {
		if (chronicleSettings.characters.pc[character].being == KINDRED ) {
			selectClasses.append( '<option value="' + chronicleSettings.characters.pc[character].id +
				'">' + character + '</option>' );
		}
	}
	for ( character in chronicleSettings.characters.npc ) {
		if (chronicleSettings.characters.npc[character].being == KINDRED ) {
			selectClasses.append( '<option value="' + chronicleSettings.characters.npc[character].id +
				'">' + character + '</option>' );
		}
	}
}

function clearAndCloseCharacterSheetForm() {
	$( '#player_sheet_add' ).addClass( 'hidden' );
	$( '#value-modifier__dialog' ).addClass( 'hidden' );
	$( '#player_sheet__wrapper input, #player_sheet__wrapper textarea' ).val( '' );
	$( '#player_sheet_add .clear' ).html( '' );
	$( '#character_clan' ).val( 'Select Clan' );
	$( '#player_sheet_add' ).removeData( 'type' );
	$( '#player_sheet_add' ).removeData( 'function' );
	$( '#player_sheet_add' ).removeData( 'id' );
	$( '#add_humanity' ).val(7);
	$( '#add_blood_potency' ).val(1);
	$( '#add_experience' ).val(0);
}
function clearAndCloseLocationForm() {
	$( '#location_add' ).addClass( 'hidden' );
	$( '#value-modifier__dialog' ).addClass( 'hidden' );
	$( '#location_add__wrapper input, #location_add__wrapper textarea' ).val( '' );
	$( '#location_add_visible' ).prop( "checked", false );
	$( '#location_add__wrapper' ).removeData( 'function' );
	$( '#location_add__wrapper' ).removeData( 'id' );
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
	const attrObj = $( '#attr_stats__wrapper' ).find( '.' + $( '#attr-title' ).html().replace( ' ', '_' ) );
	attrObj.find( '.level' ).attr( 'class', $( '#attr_level' ).attr( 'class' ) );
	const specialty = $( '#attr_specialty>input' ).val();
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
	updateTrackers();
	closeAndClearAttrWindow();
});

function updateTrackers() {
	let healthStat = 'stamina';
	let willpowerStat1 = 'composure';
	let willpowerStat2 = 'resolve';
	if ( $( '#attr_stats__wrapper' ).find( '.stamina' ).length == 0 ) {
		healthStat = 'physical'
		willpowerStat1 = 'social';
		willpowerStat2 = 'mental';
	}
	$( '#add_health' ).val( parseInt( getStatValue( healthStat ) ) + 3 );
	$( '#add_willpower' ).val( parseInt( getStatValue( willpowerStat1 ) ) + 
		parseInt( getStatValue( willpowerStat2 ) ) );
}

function closeAndClearAttrWindow() {
	$( '#attr_edit__wrapper' ).addClass( 'hidden' );
	$( '#attr_edit__window' ).find( 'input' ).val( '' );
	$( '#attr_level' ).attr( 'class', 'level level0' );
}

$( '#attr_level' ).on( 'click', function( event ) {
	const expanded = $( this ).hasClass( 'expanded' );
	const levelWidth = parseInt( $( '#attr_level' ).width() );
	const maxValue = expanded ? 10 : 5;
	const classValue = expanded ? 'level expanded level' : 'level level';
	$( this ).attr( 'class', classValue + Math.ceil( event.offsetX / ( levelWidth / maxValue ) ) );

});

$( '#remove__level' ).on( 'click', function() {
	$( '#attr_level' ).attr( 'class', 'level level0' );
});

$( '#btn-add_discipline' ).on( 'click', function() {
	let selected = $( '#character_discipline__select' ).find( ':selected' );

	if ( selected.text() != DISCIPLINE_OPTION_DEFAULT && !$( this ).hasClass( 'disabled' ) ) {
		addDiscipline( selected.text() );
		$( '#character_discipline__select' ).val( DISCIPLINE_OPTION_DEFAULT );
		$( this ).addClass( 'disabled' );
	}
});

function addDiscipline( discipline ) {
	discString = '<div class="discipline_add__wrapper ' + discipline.replace( ' ', '_' ).replace( ' ', '_' ) + 
		'"><div class="discipline-name">' + discipline + '</div><div class="disc_remove btn">&times;</div>';
	if ( discipline == BLOOD_SORCERY_RITUALS ) {
		const bloodSorceryLevel = parseInt( $( '.Blood_Sorcery' ).find( '.level' ).attr( 'class' ).replace( 'level level', '' ) );
		if ( bloodSorceryLevel == 0 ) {
			return;
		}
		discString += '<div class="rituals__list"></div><div class="ritual_add__wrapper"><select class="ritual add">';
		discString += '<option selected disabled>Select Ritual</option>';
		discString += getBloodSorceryRitualOptions( bloodSorceryLevel );
		discString += '</select><div class="btn_ritual_add btn">Add</div></div>';
	} else {
		if ( discipline == "Blood Sorcery" ) {
			$( '#character_discipline__select' ).append( '<option>' + BLOOD_SORCERY_RITUALS + '</option>' );
		}
		discString += '<div class="level level0"></div>';
	}
	discString += '<div class="powers_list"></div></div>';
	$( '#disciplines__list__wrapper' ).append( discString );
	$( '#character_discipline__select' ).find( 'option[value="' + discipline + '"]' ).remove();
}

$( '#add_disciplines__wrapper' ).on( 'click', '.btn_ritual_add', function() {
	addRitual();
});

function addRitual() {
	$( '.rituals__list' ).append( '<select class="ritual">' + $( '.ritual.add' ).html() + '</select>' );
	$( '.rituals__list .ritual:last-child' ).val( $( '.ritual.add' ).find( ':selected' ).html() );
	$( '.ritual.add' ).find( ':selected' ).remove();
	$( '.ritual.add' ).val( 'Select Ritual' );
}

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
	addPowers( $( this ).next(), $( this ).prev().prev().text(), level );
});

function addPowers( container, discipline, level ) {
	let currentPowerIndex = 0;
	container.find( '.power__wrapper' ).each(function() {
		currentPowerIndex++;
		if (currentPowerIndex > level) {
			$( this ).remove();
		}
	});

	for (let i=currentPowerIndex; i<level; i++) {
		let powersString = '<div class="power__wrapper"><select><option selected disabled>Select Power</option>';
		const disciplineValues = DISCIPLINES[discipline];
		for (powerLevel in disciplineValues) {
			if (powerLevel <= i) {
				for (power in disciplineValues[powerLevel]) {
					powersString += '<option>' + disciplineValues[powerLevel][power].name + '</option>';
				}
			}
		}
		powersString += '</select></div>';
		container.append( powersString );
	}
}

function getStatValue( stat ) {
	console.log( 'Getting value for stat: ' + stat );
	return $( '#attr_stats__wrapper' ).find( '.' + stat ).find( '.level' ).attr( 'class' ).replace( 'level level', '' ).replace( 'level expanded level', '' );
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
		$( this ).parent().prev().append( getDetailStr( value, $( this ).hasClass( 'has_level' ) ? 0 : null ) );
		$( this ).prev().val( '' );
	}
});

function getDetailStr( value, level ) {
	let detailStr = '<div class="flex">';
	if ( level ) {
		detailStr += '<input value="' + value + '"/><div class="level level' + level + '""></div>';
	} else {
		detailStr += '<input class="wide" value="' + value + '"/>';
	}
	detailStr += '<div class="remove_detail btn">&times;</div></div>';
	return detailStr;
}

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
				$( '#loading__wrapper' ).removeClass( 'hidden' );
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
				$( '#loading__wrapper' ).removeClass( 'hidden' );
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
				$( '#loading__wrapper' ).removeClass( 'hidden' );
				postData['sceneIndex'] = $( this ).parent().parent().index();
				postData['chapterIndex'] = $( this ).parent().parent().parent().parent().index();
				postData['value'] = assembleStoryText( postData['value'] )
				if ( chronicleSettings.chapters[postData['chapterIndex']].scenes[postData['sceneIndex']].story != postData['value'] ) {
					console.log(postData, chronicleSettings.chapters);
					if ( postData['value'] == '' ) {
						$( this ).val( chronicleSettings.chapters[postData['chapterIndex']].scenes[postData['sceneIndex']].story );
					} else {
						console.log(chronicleSettings.chapters[postData['chapterIndex']].scenes[postData['sceneIndex']].story, postData['value']);
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
	if ( text.indexOf( '<p>') != -1 ) {
		return text;
	}
	let textList = text.split( '\n\n' );
	let textStr = '';
	for ( index in textList ) {
		textStr += '<p>' + textList[index] + '</p>';
	}
	return textStr;
}

$( '#disciplines__list__wrapper' ).on( 'click', '.disc_remove', function() {
	const discipline = $( this ).parent().find( '.discipline-name' ).html();
	if ( discipline == "Blood Sorcery" ) {
		$( '.discipline_add__wrapper.Blood_Sorcery_Rituals' ).remove();
		$( '#character_discipline__select option[value="' + BLOOD_SORCERY_RITUALS + '"]' ).remove();
	}
	$( this ).parent().remove();
});

$( '#being__select' ).on( 'change', function() {
	loadSheet( $( this ).val() );
	showHideBeingEntries();
});

function showHideBeingEntries() {
	const beingVal = $( '#being__select' ).val().toLowerCase();
	$( '#player_sheet__wrapper .optional' ).each(function() {
		if ( $( this ).hasClass( beingVal ) ) {
			$( this ).show();
		} else {
			$( this ).hide();
		}
	});
}

function loadSheet( being ) {
	$( '#attr_stats__wrapper' ).html( assembleCharacterSheetData( {}, LIMITED_SHEET.includes( being ) ) );
}

