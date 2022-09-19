import { LIMITED_SHEET, ENABLE, DISABLE, KINDRED, DISCIPLINE_OPTION_DEFAULT, DISCIPLINES, BLOOD_SORCERY_RITUALS } from './vampire.js';
import { assembleCharacterSheetData } from './character.js';
import { populateCharacterSheetSettings, serializeSheet, serializeLocation } from './serialize.js';
import { storyToolbarClick } from '../common/toolbar.js';
import { saveCharacter, updateEmbedLink, loadCharactersByChronicle, saveLocation, loadLocationById, toggleStoryEnabled } from '../common/api.js';
import { account, getState } from '../common/common.js';

$( '.btn-chronicle-enabled input, #story_list input' ).on( 'click', function( e ) {
	e.stopPropagation();
});

// for some reason we go back to login the first time we use this??
let weirdPatch = false;
function handleToggleEnabledResponse( response ) {
	let selector = $( ".btn-chronicle[data-id='" + response.id + "'], " + 
		".btn-chronicle-enabled[data-id='" + response.id + "']" );
	if ( response.enabled ) {
		selector.removeClass( 'disabled' );
	} else {
		selector.addClass( 'disabled' );
	}
}

function populateChronicleSettings( chronicleSettings ) {
	$( '#chronicle_name__input' ).val( chronicleSettings.name );
	$( '#chronicle_relationship_url' ).val( chronicleSettings.embed_link );
	$( '#chronicle_enabled' ).prop( 'checked', chronicleSettings.enabled );
}

$( '#story_list' ).on( 'click', '.toolbar-item-header', function() {
	$( this ).next().slideToggle();
});

function locationEdit( clickElem ) {
	$( '#location_add' ).removeClass( 'hidden' );
	if ( clickElem ){
		$( '#location_add__wrapper' ).data( 'function', 'edit' );
		$( '#location_add__wrapper' ).data( 'id',  clickElem.data( 'id' ) );
		loadLocationById( clickElem.parent().data( 'id' ), true, false );
	} else {
		$( '#location_add__wrapper' ).data( 'function', 'add' );
	}
	loadCharactersByChronicle( true )
}

$( '#character_sheet_cancel' ).on( 'click', function() {
	if ( confirm("Are you sure you want to cancel character creation?\nForm will be cleared") ) {
		clearAndCloseCharacterSheetForm( true );
	}
});

$( '#character_sheet_save' ).on( 'click', function() {
	if ( confirm("Are you sure you want to save this character?\nYou will be able to edit it later") ) {
		const characterObj = serializeSheet();
		if ( characterObj ) {
			const loc = window.location.href;
			if ( $( '#player_sheet_add' ).data( 'function' ) == 'edit' ) {
				characterObj['id'] = $( '#player_sheet_add' ).data( 'id' );
				saveCharacter( 'PUT', characterObj );
			} else {
				saveCharacter( 'POST', characterObj );
			}
		}
	}
});
$( '#btn__cancel_location' ).on( 'click', function() {
	if ( confirm("Are you sure you want to cancel location entry?\nForm will be cleared") ) {
		clearAndCloseLocationForm( true );
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
				saveLocation( 'PUT', locationObj );
			} else {
				saveLocation( 'POST', locationObj );
			}
		}
	}
});
$( '#location_add__wrapper' ).on( 'change', '#location_add_haven', function() {
	if ( $( '#location_add_haven' ).val().includes( 'None' ) ) {
		$( '#location_add_haven' ).val( 'None' );
	}
});

function populateHavenSelect( characters ) {
	$( '#location_add_haven' ).html( '<option selected>None</option>' );
	
	for ( let character in characters ) {
		$( '#location_add_haven' ).append( '<option value="' + characters[character].id +
			'">' + character + '</option>' );
	}
}

function populateCharacterEntryData( characters ) {
	const selectClasses = $( '#character_bound_to__select, #character_touchstone_for, #character_retainer_for' );
	selectClasses.html( '<option selected>None</option>' );
	
	for ( let character in characters ) {
		if ( characters[character].being === KINDRED ) {
			selectClasses.append( '<option value="' + characters[character].id +
				'">' + characters[character].name + '</option>' );
		}
	}
}

function clearAndCloseCharacterSheetForm( close ) {
	if ( close ) {
		$( '#player_sheet_add' ).addClass( 'hidden' );
		$( '#value-modifier__dialog' ).addClass( 'hidden' );
	}
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
function clearAndCloseLocationForm( close ) {
	if ( close ) {
		$( '#location_add' ).addClass( 'hidden' );
		$( '#value-modifier__dialog' ).addClass( 'hidden' );
	}
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
	let discString = '<div class="discipline_add__wrapper ' + discipline.replace( ' ', '_' ).replace( ' ', '_' ) + 
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
	for ( let ritualLevel in rituals ) {
		if ( ritualLevel >= level ) {
			break;
		}
		for ( let ritual in rituals[ritualLevel] ) {
			ritualsStr += '<option>' + rituals[ritualLevel][ritual] + '</option>';
		}
	}
	return ritualsStr;
}

$( '#disciplines__list__wrapper' ).on( 'click', '.level', function( event ) {
	handleDisciplineLevelClick( event.offsetX, $( this ) );
});

function handleDisciplineLevelClick( offsetX, clickElem ) {
	const levelWidth = parseInt( $( '#attr_level' ).width() );
	const level = Math.ceil( offsetX / ( levelWidth / 5 ) );
	clickElem.attr( 'class', 'level level' + level );
	const clickIndex = clickElem.parent().index();
	$( '.discipline_add__wrapper' ).each(function() {
		if ( $( this ).index() == clickIndex ) {
			addPowers( clickElem.next(), clickElem.prev().prev().text(), level );
		} else {
			addPowers( $( this ).find( '.powers_list' ), $( this ).find( '.discipline-name' ).text(), parseInt($( this ).find( '.level' ).attr( 'class' ).replace( 'level level', '' )));
		}
	});
}


$( '#disciplines__list__wrapper' ).on( 'change', '.power__wrapper select', function() {
	$( this ).parent().parent().prop( 'disabled', false );
	let powerValues = {};
	$( this ).parent().parent().find( '.power__wrapper' ).each( function() {
		powerValues[$( this ).index()] = $( this ).find( 'option:selected' ).val();
	});
	$( this ).parent().parent().find( '.power__wrapper' ).each( function() {
		let powerWrapper = $( this );
		let index = $( this ).index();
		powerWrapper.find( 'option' ).each( function() {
			$( this ).prop( 'disabled', Object.values( powerValues ).includes( $( this ).val() ) && powerValues[index] != $( this ).val() );
		});
	});
});
function addPowers( container, discipline, level ) {
	let currentPowerIndex = container.find( '.power__wrapper' ).length;
	let savedValues = {}
	container.find( '.power__wrapper' ).each(function() {
		savedValues[$( this ).index()] = $( this ).find( 'select' ).val();
	});
	container.find( '.power__wrapper' ).remove();

	for ( let i=0; i<level; i++) {
		let powerWrapper = document.createElement( 'div' );
		let discSelect = document.createElement( 'select' );
		let defaultOption = document.createElement( 'option' );
		$( defaultOption ).html( 'Select Power' ).prop( 'selected', true ).prop( 'disabled', true );
		$( discSelect ).append( defaultOption );
		$( powerWrapper ).append( discSelect ).addClass( 'power__wrapper' );
		const disciplineValues = DISCIPLINES[discipline];
		for ( let powerLevel in disciplineValues ) {
			if (powerLevel <= i) {
				for ( let power in disciplineValues[powerLevel]) {
					let amalgam = disciplineValues[powerLevel][power].amalgam;
					let requirement = disciplineValues[powerLevel][power].requirement;
					if ( (amalgam == null || hasAmalgam( amalgam ) && (requirement == null || meetsRequirement( requirement )) ) ) {
						let powerOption = document.createElement( 'option' );
						$( powerOption ).html( disciplineValues[powerLevel][power].name )
						$( discSelect ).append( powerOption );
						$( powerOption ).prop( 'disabled', isPowerSelected( container, disciplineValues[powerLevel][power].name ) );
					}
				}
			}
		}
		container.append( powerWrapper );

		if ( i<currentPowerIndex && savedValues[i] != null ) {
			$( discSelect ).val(savedValues[i]);	
		}
	}
	
	$( '.powers_list select:first-child' ).trigger( 'change' );
}

function hasAmalgam( amalgam ) {
	if ( $( '#disciplines__list__wrapper' ).find( '.' + amalgam.name ).length > 0 ) {
		return parseInt($( '#disciplines__list__wrapper' ).find( '.' + amalgam.name + ' .level' ).attr( 'class' ).replace( 'level level', ' ' ).replace( 'level expanded level', '' )) >= amalgam.level;
	}
	return false;
}

function meetsRequirement( requirement ) {
	if ( $( '#disciplines__list__wrapper' ).find( '.' + requirement.discipline ).length > 0 ) {
		if ( parseInt($( '#disciplines__list__wrapper' ).find( '.' + requirement.discipline + ' .level' ).attr( 'class' ).replace( 'level level', ' ' ).replace( 'level expanded level', '' )) >= requirement.level ) {
			$( '#disciplines__list__wrapper' ).find( '.' + requirement.discipline + ' select[name="discipline"]' ).each( function() {
				if ( $( this ).val() == requirement.name ) {
					return true;
				}
			});
		}
	}
	return false;
}

function isPowerSelected( powersList, power ) {
	powersList.find( 'option' ).each( function() {
		if ( $( this ).val() == power ) {
			return true;
		}
	});
	return false;
}

function getStatValue( stat ) {
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
		$( this ).parent().prev().append( getDetailStr( value, $( this ).hasClass( 'has_level' ) ? "0" : null ) );
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

function assembleStoryText( text ) {
	if ( text.indexOf( '<p>') != -1 ) {
		return text;
	}
	let textList = text.split( '\n\n' );
	let textStr = '';
	for ( let index in textList ) {
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
	$( '.discipline_add__wrapper' ).each(function() {
		addPowers( $( this ).find( '.powers_list' ), $( this ).find( '.discipline-name' ).text(), parseInt($( this ).find( '.level' ).attr( 'class' ).replace( 'level level', '' )));
	});
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
	$( '#attr_stats__wrapper' ).html( assembleCharacterSheetData( {}, LIMITED_SHEET.includes( being ), null ) );
}

function vampireCharacterEditSheet( btnElem ) {
	$( '#player_sheet_add' ).removeClass( 'hidden' );
	$( '#player_sheet_add' ).data( 'type', 'npc' );

	loadSheet();

	if ( btnElem ) {
		loadCharacterById( $( btnElem ).parent().data( 'id' ), null, true );
		$( '#player_sheet_add' ).data( 'function', 'edit' );
		$( '#player_sheet_add' ).data( 'id', btnElem.data( 'id' ) );
	} else {
		$( '#player_sheet_add' ).data( 'function', 'add' );
	}

	$( '#character_discipline__select' ).html( '<option selected disabled>' + DISCIPLINE_OPTION_DEFAULT + '</option>' );
	for ( let discipline in DISCIPLINES) {
		if ( discipline == BLOOD_SORCERY_RITUALS || discipline == 'Thin-Blood Alchemy' ) {
			continue;
		}
		$( '#character_discipline__select' ).append( '<option>' + discipline + '</option>' );
	}
	updateTrackers();
	loadCharactersByChronicle( false );
	$( '#character_name__wrapper>input' ).focus();
}


$ ( '#character__wrapper' ).on( 'click', '.btn_edit', function() {
	if ( $( this ).hasClass( 'character' ) ) {
		vampireCharacterEditSheet( $( this ) );
		storyToolbarClick( $( this ), $( '#player_sheet_add' ) );
	} else if ( $( this ).hasClass( 'location' ) ) {
		locationEdit( $( this ) );
		storyToolbarClick( $( this ), $( '#location_add' ) );
	}
});

$( '#chronicle_relationship_url' ).on( 'blur', function() {
	if (confirm("Are you sure you want to update the Relationship map url?")) {
		updateEmbedLink({
			'account_id': account,
			'url'		: $( '#chronicle_relationship_url' ).val(),
			'type'		: 'vampire'
		});
	} else {
		let revertValue = '';
		if ($( '#relationship_map' ).length == 1  && $( '#relationship_map' ).attr( 'src' ) != undefined ) {
			revertValue = $( '#relationship_map' ).attr( 'src' );
		}
		$( '#chronicle_relationship_url' ).val( revertValue )
	}
});

$( '#chronicle_enabled' ).on( 'change', function(){
	toggleStoryEnabled( $( this ).prop( 'checked' ), 'chronicle' );
});

$( '#close_chronicle__btn' ).on( 'click', function() {
	window.history.back();
	if ( getState() == 'chronicle_id' ) {
		if (weirdPatch) {
			window.history.back();
		} else {
			weirdPatch = true;
		}
	}
});

function getChronicleId() {
	let loc = window.location.href;
	if ( loc.indexOf( '?chronicle_id=' ) === -1 ) {
		return null;
	}
	let chronicleId = loc.substring( loc.indexOf( '?chronicle_id=' ) + 14 );
	if ( chronicleId.indexOf( '&' ) !== -1 ) {
		chronicleId = chronicleId.substring( 0, chronicleId.indexOf( '&' ) );
	}
	return chronicleId;
}

export { 
	populateChronicleSettings, 
	vampireCharacterEditSheet, 
	loadSheet, 
	addDiscipline, 
	addPowers, 
	addRitual, 
	getDetailStr, 
	updateTrackers, 
	locationEdit, 
	clearAndCloseLocationForm, 
	clearAndCloseCharacterSheetForm, 
	handleDisciplineLevelClick, 
	getStatValue, 
	getSpecialty, 
	getChronicleId, 
	populateHavenSelect, 
	populateCharacterEntryData, 
	handleToggleEnabledResponse 
};


