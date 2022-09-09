import {
	ROUSE,
	ROLL_ACTION_REFERENCE,
	ROLL_REFERENCE,
	STORYTELLER,
	rollType,
	rerollType,
	DM,
	GM,
	REROLL_FAILURE, REROLL_CRIT, REROLL_SUCCESS, setRerollType, ICON_MAP
} from './vampire.js';
import { getUser } from '../common/cache.js';
import { postDiceRoll } from '../common/api.js';
import { openContextMenu } from "./tracker.js";

function handleRollResults( data ) {
	if ($( '#dice-results' ).children().length > 0) {
		$( '#dice-results' ).prepend( '<hr>' );
	}
	let classMod = '';
	let rerollText = data.rollFor;
	let rollElem = document.createElement( 'div' );
	if ( data.player === getUser() ) {
		$( rollElem ).addClass( 'own-roll' );
	}
	if ( data.reroll ) {
		$( rollElem ).addClass( 'reroll' );
		rerollText += ' - reroll'
	}
	if ( data.roll.regular.length === 0 ) {
		$( rollElem ).addClass( 'rouse' );
	}
	let aliasText = data.alias ? '<span class="alias sub-text"> (as ' + data.alias + ')</span>' : '';
	$( rollElem ).addClass( 'dice-roll' );
	let player = document.createElement( 'span' );
	$( player ).html( data.player + aliasText );
	let rollForElem = document.createElement( 'div' );
	$( rollForElem ).addClass( 'roll_for' ).html( rerollText );
	let timestampElem = document.createElement( 'span' );
	$( timestampElem ).html( '(' + getTimestamp(data.timestamp) + ')' );

	$( rollElem ).append( player )
				 .append( document.createElement( 'br' ) )
				 .append( rollForElem )
				 .append( timestampElem )
				 .append( assembleRoll( data.roll, data.rollFor ) );

	// $( '#dice-results' ).prepend( '<div class="dice-roll' + classMod + '">' + data.player + aliasText +
	// 	'<br/><div class="roll_for">' + rerollText + '</div><span class="sub-text">(' + getTimestamp(data.timestamp) + ')</span>' 
	// 	+ assembleRoll( data.roll, data.roll_for ) + '</div></div>' );

	if ( $( '#btn-roll' ).hasClass( 'active' ) || ( $( '#btn-roll' ).hasClass( 'default' ) && $( window ).width() > 1099 ) ) {
		$( rollElem ).addClass( 'seen' );
	}
	$( '#dice-results' ).prepend( rollElem );
	playRandomDiceRollEffect();
	$( '#clear_dice-results' ).removeClass( 'active' );
}

function getTimestamp( timestamp ) {
	let date = new Date(timestamp);
	let hours = date.getHours();
	let mins = date.getMinutes();
	let secs = date.getSeconds();
	if (mins < 10) {
		mins = '0' + mins;
	}
	if (secs < 10) {
		secs = '0' + secs;
	}
	let amPm = hours > 12 ? 'PM' : 'AM';
	if (hours == 0) {
		hours = 12;
	}
	if (hours > 12) {
		hours = hours % 12;
	}
	return hours + ':' + mins + ':' + secs + ' ' + amPm;
}

function assembleRoll( roll, rollFor ) {
	let rollValue = {
		'successes' : 0,
		'crits' : 0,
		'hungerCrits' : 0,
		'hungerCritFail': false
	}
	let result = '<div class="dice-result flex"';
	let count = 0;
	let diceStr = '';
	for ( let die in roll.regular) {
		let dieValue = roll.regular[die];
		diceStr += '<div class="die">' + getDie(dieValue, false) + '</div>';
		count++;
		if ( dieValue == 10 ) {
			rollValue['crits']++;
		} else if ( dieValue > 5 ) {
			rollValue['successes']++;
		}
	}
	for ( let die in roll.hunger) {
		let dieValue = roll.hunger[die];
		diceStr += '<div class="die hunger">' + getDie(dieValue, true) + '</div>';
		count++;
		console.log("DIE VALUE: ", dieValue);
		if ( dieValue == 10 ) {
			rollValue['hungerCrits']++;
		} else if ( dieValue > 5 ) {
			rollValue['successes']++;
		} else if ( dieValue == 1 ) {
			rollValue['hungerCritFail'] = true;
		}
	}
	result += '">' + diceStr + '</div>';
	result += '<div class="dice-result__tooltip">' + calculateRollResults( rollValue, rollFor ) + '</div>';
	return result;
}

function calculateRollResults( rollValue, rollFor ) {
	let evaluatedResults = {
		'successes' : rollValue['successes'],
		'isCrit' : false,
		'isMessyCrit' : false
	}
	if ( rollValue.crits > 0 && rollValue.hungerCrits > 0 ||
			rollValue.hungerCrits > 1 ) {
		evaluatedResults['isMessyCrit'] = true;
	} else if ( rollValue.crits > 1 ) {
		evaluatedResults['isCrit'] = true;
	}
	evaluatedResults['successes'] += Math.floor((rollValue.crits + rollValue.hungerCrits) / 2) * 4;
	evaluatedResults['successes'] += (rollValue.crits + rollValue.hungerCrits) % 2;
	let resultStr = evaluatedResults['successes'] + ' Success';
	if ( evaluatedResults['successes'] != 1 ) {
		resultStr += 'es';
	}
	if ( evaluatedResults['isMessyCrit'] ) {
		resultStr += ' with a Messy Crit';
	} else if ( evaluatedResults['isCrit'] ) {
		resultStr += ' with a Crit';
	}
	if ( evaluatedResults['successes'] == 0 && rollValue['hungerCritFail'] ) {
		if ( rollFor == ROUSE ) {
			return 'Gained Hunger';
		}
		return 'BESTIAL FAILURE!';
	}
	if ( rollFor == ROUSE ) {
		if (evaluatedResults['successes'] == 0 ) {
			return 'Gained Hunger';
		}
		return 'Hunger Remains';
	}
	return resultStr;
}

function getDie( value, isHunger ) {
	let dieStr = '<span data-value="' + value + '" class="';
	if (value == 10) {
		if (isHunger) {
			dieStr += 'icon_critical_success_hunger';
		} else {
			dieStr += 'icon_critical_success';
		}
	} else if( isHunger && value == 1) {
		dieStr += 'icon_bestial-failure';
	} else if ( value > 5 ) {
		dieStr += 'icon_success';
	} else {
		dieStr += 'icon_failure';
	}
	return dieStr + '"></span>';
}

function isEmpty( num ) {
	return isNaN(num) || num === "" || num == null || num == undefined;
}

function reroll( rerollAmount, rerollTypeHtml ) {
	if (rerollAmount > 3) {
		rerollAmount = 3;
	}
	let rerollElem = $( '.rerolling' );

	// REMOVE DICE FROM POOL
	let rerollPool = {
		'regular' 	: [],
		'hunger' 	: []
	};
	let totalRegular = 0;
	let removed = 0;

	rerollElem.find( '.die' ).each(function() {
		let span = $( this ).find( 'span' );
		if ( !$( this ).hasClass( 'hunger' ) ) {
			if (ICON_MAP[rerollTypeHtml] != span.attr( 'class' ) ||
					removed == rerollAmount) {
				console.log(span.attr('class'));
				rerollPool.regular.push( parseInt(span.data( 'value' )) );
			} else {
				removed++;
			}
		} else {
			rerollPool.hunger.push( parseInt(span.data( 'value' )) );
		}
		totalRegular++;
	});

	if (removed > 0) {
		let postData = {
			'player' 	: getUser(),
			'total' 	: removed,
			'hunger'	: 0,
			'reroll'	: rerollPool,
			'notify'	: $( '#btn_private-roll' ).hasClass( 'selected' ) ? 'private' : 'everyone',
			'rollFor'	: rerollType
		};
		postDiceRoll( postData );
	}

	rerollElem.removeClass( 'rerolling' ).parent().addClass( 'rerolled' );
}

function getRollValue( rollTypeName ) {
	let dicePool = 0;
	let characterSheet = $( '#character-sheet' );
	console.log(rollTypeName);

	$( '.roll-type__option.active' ).removeClass( 'active' );
	$( '#roll-type__text' ).val( rollTypeName );
	$( '#roll-type' ).removeClass( 'active' );
	$( '#roll-type__dropdown' ).removeClass( 'active' );

	if ( rollTypeName != ROUSE ) {
		if ( characterSheet.length == 0 ) {
			return;
		}
	}

	switch ( rollTypeName ) {
		case ROUSE:
			updateDiceInputs( 1, 1 );
			break;
		case WILL:
			updateDiceInputs( getSheetStatValue( 'willpower', true ), 0 );
			break;
		case REMORSE:
			updateDiceInputs( getSheetStatValue( 'humanity', true ), 0 );
			break;
		case FRENZY:
			const humVal = Math.floor(getSheetStatValue( 'humanity', true ) / 3);
			updateDiceInputs( (humVal == 0 ? 1 : humVal) + getSheetStatValue( 'willpower', true ), 0 );
			break;
		default:
			let rollAttributes = rollTypeName.split( ' + ' );
			updateDiceInputs( prepareSheetDicePool( rollAttributes ), getSheetStatValue( 'hunger', true ) );
	}
}

function prepareSheetDicePool( stats ) {
	const limitedSheet = $( '.strength' ).length == 0;
	if ( limitedSheet ) {
		let attributeValue = 0;
		switch ( stats[0] ) {
			case 'Strength':
			case 'Dexterity':
			case 'Stamina':
				attributeValue = getSheetStatValue( 'physical', false );
				break;
			case 'Charisma':
			case 'Manipulation':
			case 'Composure':
				attributeValue = getSheetStatValue( 'social', false );
				break;
			case 'Intelligence':
			case 'Wits':
			case 'Resolve':
				attributeValue = getSheetStatValue( 'mental', false );
				break;
		}
		console.log( stats[1] );
		let skillValue = getSheetStatValue( prepareStatName( stats[1] ), false );
		return skillValue > attributeValue ? skillValue : attributeValue;
	}
	
	return getSheetStatValue( prepareStatName( stats[0] ), false ) +
		getSheetStatValue( prepareStatName( stats[1] ), false );
}

function prepareStatName( stat ) {
	return stat.toLowerCase().replace( ' ', '_' );
}

function prepareDisciplineName( discipline ) {
	if ( discipline === 'animal ken' ) {
		return 'animal_ken';
	}
	return discipline.toLowerCase().replace( ' ', '-' ).replace( ' ', '-' );
}

function updateDiceInputs( total, hunger ) {
	$( '#dice-pool__input' ).val( total );
	if ( hunger != null ) {
		$( '#hunger-dice__input' ).val( hunger );
	}
}

function getSheetStatValue( stat, isTracker ) {
	if ( isTracker ) {
		let tracker = $( '#' + stat + '-tracker' );
		if ( tracker.length === 0 ) {
			return 0;
		}
		if ( stat === 'hunger' ) {
			return getTrackerTypeValue( tracker, 'level' );
		} else {
			let max = getTrackerTypeValue( tracker, 'maxlevel' );
			if ( stat === 'humanity' ) {
				let stains = getTrackerTypeValue( tracker, 'stains' );
				return 10 - max - stains;
			} else {
				let superficial = getTrackerTypeValue( tracker, 'superficial' );
				let aggravated = getTrackerTypeValue( tracker, 'aggravated' );
				return max - (superficial + aggravated);
			}
		}
	}
	if ( $( '.' + stat + ' .level' ).attr( 'class' ) ) {
		return parseInt( $( '.' + stat + ' .level' ).attr( 'class' )
			.replace( 'level level', '' ).replace( 'level expanded level', '' ) );
	} else if ( $( '.' + prepareDisciplineName( stat ) + ' .level' ).attr( 'class' ) ) {
		return parseInt( $( '.' + prepareDisciplineName( stat ) + ' .level' ).attr( 'class' )
			.replace( 'level level', '' ).replace( 'level expanded level', '' ) );
	} else {
		return 0;
	}
}

function getTrackerTypeValue( elem, type ) {
	let classes = elem.attr( 'class' ).split( ' ' );
	for ( let className in classes ) {
		if ( classes[className].includes( type ) ) {
			return parseInt( classes[className].replace( type, '' ) );
		}
	}
	return null;
}

function playRandomDiceRollEffect() {
	const rollEffectIndex = Math.floor(Math.random() * ($( 'audio.roll-effect' ).length)) + 1;
	$( '#effect__dice-roll_' + rollEffectIndex )[0].play();
}

function setDiceHandlers() {
	$( '#hunger-dice__input' ).on( 'change', function() {
		if ( $( '#dice-pool__input' ).val() < $( this ).val() ) {
			$( '#dice-pool__input' ).val( $( this ).val() );
		}
	});
	$( '#dice-pool__input' ).on( 'change', function() {
		if ( $( '#hunger-dice__input' ).val() > $( this ).val() ) {
			$( this ).val( $( '#hunger-dice__input' ).val() );
		}
	});
	$( '#hunger-dice__input-div' ).on( 'click', function() {
		$( this ).toggleClass( 'selected' );
		let isHungerDisabled = $( '#hunger-dice__input' ).prop( 'disabled' );
		$( '#hunger-dice__input' ).prop( 'disabled', !isHungerDisabled)
	});
	$( '#btn_private-roll' ).on( 'click', function() {
		$( this ).toggleClass( 'selected' );
		$( '#private-roll' ).toggleClass( 'open' );
	});

	$( '#roll-type__text' ).autocomplete({
		source: Object.keys(ROLL_ACTION_REFERENCE),
		select: function ( event, ui ) {
			rollType = ui.item.label;
			let rollValue = ROLL_REFERENCE[ROLL_ACTION_REFERENCE[rollType]];
			if ( rollValue == undefined ) {
				rollValue = rollType;
			}
			getRollValue( rollValue );
		    return false;
	  	}
	});
	$( '#btn_roll-dice' ).on( 'click', function() {
		const includeHunger = $( '#hunger-dice__input-div' ).hasClass( 'selected' );
		const total = parseInt($( '#dice-pool__input' ).val());
		const hunger = includeHunger ? parseInt($( '#hunger-dice__input' ).val()) : 0;
		if (isEmpty(total) || isEmpty(hunger) || hunger > total ) {
			alert( "Please enter values for total and hunger, and ensure the total value is larger and try again!");
			return;
		}
		let rollAlias = $( '#rolling_as .roller' ).html();
		let postData = {
			'player' 	: getUser(),
			'alias'		: getUser() === STORYTELLER || getUser() === DM || getUser() === GM ? rollAlias : null,
			'total' 	: total,
			'hunger'	: hunger,
			'notify'	: $( '#btn_private-roll' ).hasClass( 'selected' ) ? 'private' : 'everyone',
			'rollFor'	: rollType
		};
		postDiceRoll( postData );
	});

	$( '#dice-roll__window' ).on( 'click', '.dice-roll.own-roll .dice-result', function() {
		if ( !($( this ).parent().hasClass( 'reroll' ) || 
				$( this ).parent().hasClass( 'rerolled' ) ||
				$( this ).parent().hasClass( 'rouse' )) ) {
			$( '.rerolling' ).removeClass( 'rerolling' );
			$( this ).addClass( 'rerolling' );
			let enabled = false;
			if ( getUser() === STORYTELLER || getUser() === DM || getUser() === GM ) {
				enabled = true;
			} else {
				const classes = $( '#willpower-tracker' ).attr( 'class' ).split( ' ' );
				const maxLevel = getValueFromElementInArray( classes, TRACKER_MAX );
				const aggravated = getValueFromElementInArray( classes, DAMAGE_AGGRAVATED );
				enabled = aggravated < maxLevel;
			}
			openContextMenu([{ 
				'name' 		: REROLL_FAILURE,
				'class' 	: 'willpower-tracker addSuperficial reroll ',
				'enabled' 	: enabled
			},{ 
				'name' 		: REROLL_CRIT,
				'class' 	: 'willpower-tracker addSuperficial reroll ',
				'enabled' 	: enabled
			},{ 
				'name' 		: REROLL_SUCCESS,
				'class' 	: 'willpower-tracker addSuperficial reroll ',
				'enabled' 	: enabled
			}], true);
			setRerollType($( this ).parent().find( '.roll_for' ).html());
		}
	});

	$( '#roll-type__text' ).on( 'click', function() {
		$( this ).select();
	});

	$( '#clear_dice-results' ).on( 'click', function() {
		if ( $( this ).hasClass( 'active' ) ) {
			$( '#dice-results>*' ).removeClass( 'hidden' );
		} else {
			$( '#dice-results>*' ).addClass( 'hidden' );
		}
		$( this ).toggleClass( 'active' );
	});


	$( '#rolling_as ').on( 'click', function() {
		$( this ).removeClass( 'open' ).find( '.roller' ).html( '' );
		$( '.btn_roll_as.active' ).removeClass( 'active' );
	});
}

export { setDiceHandlers, getRollValue, prepareDisciplineName, handleRollResults, getSheetStatValue, updateDiceInputs, reroll };



