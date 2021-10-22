function handleRollResults( data ) {
	if ($( '#dice-results' ).children().length > 0) {
		$( '#dice-results' ).prepend( '<hr>' );
	}
	let classMod = '';
	if (data.player == user) {
		classMod = ' own-roll';
	}
	if (data.reroll) {
		classMod += ' reroll';
	}
	if (data.roll.regular.length == 0) {
		classMod += ' rouse';
	}
	$( '#dice-results' ).prepend( '<div class="dice-roll' + classMod + '">' + data.player + 
		'<br/><span class="sub-text">(' + getTimestamp(data.timestamp) + ')</span>' + assembleRoll( data.roll ) +
		'</div></div>' );
	playRandomDiceRollEffect();
	$( '#clear_dice-results' ).removeClass( 'active' );
}

function getTimestamp( timestamp ) {
	date = new Date(timestamp);
	hours = date.getHours();
	mins = date.getMinutes();
	secs = date.getSeconds();
	if (mins < 10) {
		mins = '0' + mins;
	}
	if (secs < 10) {
		secs = '0' + secs;
	}
	amPm = hours > 12 ? 'PM' : 'AM';
	if (hours == 0) {
		hours = 12;
	}
	if (hours > 12) {
		hours = hours % 12;
	}
	return hours + ':' + mins + ':' + secs + ' ' + amPm;
}

function assembleRoll( roll ) {
	result = '<div class="dice-result flex"';
	diceStr = '';
	count = 0;
	for (die in roll.regular) {
		diceStr += '<div class="die">' + getDie(roll.regular[die], false) + '</div>';
		count++;
	}
	for (die in roll.hunger) {
		diceStr += '<div class="die hunger">' + getDie(roll.hunger[die], true) + '</div>';
		count++;
	}
	if (count > 5) {
		count = 5;
	}
	result += ' style="width:' + (count * 58) + 'px;'
	result += '">' + diceStr + '</div>';

	return result;
}

function getDie( value, isHunger ) {
	dieStr = '<span data-value="' + value + '" class="';
	if (value == 10) {
		if (isHunger) {
			dieStr += 'icon_critical_success_hunger';
		} else {
			dieStr += 'icon_critical_success';
		}
	} else if( isHunger && value == 1) {
		dieStr += 'icon_bestial-failure';
	} else if ( value > 5 && value < 10 ) {
		dieStr += 'icon_success';
	} else {
		dieStr += 'icon_failure';
	}
	return dieStr + '"></span>';
}

$( '#hunger-dice__input-div' ).on ( 'click', function() {
	$( this ).toggleClass( 'selected' );
	isHungerDisabled = $( '#hunger-dice__input' ).prop( 'disabled' );
	$( '#hunger-dice__input' ).prop( 'disabled', !isHungerDisabled)
});
$( '#roll-type' ).on( 'click', function() {
	$( this ).toggleClass( 'active' );
	$( '#roll-type__dropdown' ).toggleClass( 'active' );
});
$( '#btn_roll-dice' ).on( 'click', function() {
	total = $( '#dice-pool__input' ).val();
	hunger = $( '#hunger-dice__input' ).val();
	includeHunger = $( '#hunger-dice__input-div' ).hasClass( 'selected' );
	if (isEmpty(total) || isEmpty(hunger) || hunger > total) {
		alert( "Please enter values for total and hunger, and ensure the total value is larger and try again!");
		return;
	}
	let postData = {
		'player' 	: user,
		'total' 	: parseInt(total),
		'hunger'	: includeHunger ? parseInt(hunger) : 0,
		'notify'	: 'everyone'
	};
	postDiceRoll( postData );
});

function isEmpty( num ) {
	return isNaN(num) || num === "" || num == null || num == undefined;
}

$( '#dice-roll__window' ).on( 'click', '.dice-roll.own-roll .dice-result', function() {
	if ( !($( this ).parent().hasClass( 'reroll' ) || 
			$( this ).parent().hasClass( 'rerolled' ) ||
			$( this ).parent().hasClass( 'rouse' )) ) {
		$( '.rerolling' ).removeClass( 'rerolling' );
		$( this ).addClass( 'rerolling' );
		const classes = $( '#willpower-tracker' ).attr( 'class' ).split( ' ' );
		const maxLevel = getValueFromElementInArray( classes, TRACKER_MAX );
		const aggravated = getValueFromElementInArray( classes, DAMAGE_AGGRAVATED );
		const enabled = aggravated < maxLevel;
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
	}
});

function reroll( rerollAmount, rerollType ) {
	if (rerollAmount > 3) {
		rerollAmount = 3;
	}
	rerollElem = $( '.rerolling' );

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
			if (ICON_MAP[rerollType] != span.attr( 'class' ) ||
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
			'player' 	: user,
			'total' 	: removed,
			'hunger'	: 0,
			'reroll'	: rerollPool,
			'notify'	: 'everyone'
		};
		postDiceRoll( postData );
	}

	rerollElem.removeClass( 'rerolling' ).parent().addClass( 'rerolled' );
}

$( '.roll-type__option' ).on( 'click', function() {
	if ( !$( this ).hasClass( 'active' ) ) {
		let dicePool = 0;
		let rollType = $( this ).html();
		let characterSheet = $( '#character-sheet' );

		$( '.roll-type__option.active' ).removeClass( 'active' );
		$( '#roll-type__text' ).html( rollType );
		$( this ).addClass( 'active' );
		$( '#roll-type' ).toggleClass( 'active' );
		$( '#roll-type__dropdown' ).toggleClass( 'active' );

		if ( rollType != ROUSE ) {
			if ( characterSheet.length == 0 ) {
				return;
			}
		}

		switch ( rollType ) {
			case ROUSE:
				updateDiceInputs( 1, 1 );
				break;
			case DEX_ATH:
				updateDiceInputs( getStatValue( 'dexterity', false ) + getStatValue( 'athletics', false ), null );
				break;
			case STR_BRW:
				updateDiceInputs( getStatValue( 'strength', false ) + getStatValue( 'brawl', false ), null );
				break;
			case WTS_AWR:
				updateDiceInputs( getStatValue( 'wits', false ) + getStatValue( 'awareness', false ), null );
				break;
			case WILL:
				updateDiceInputs( getStatValue( 'willpower', true ), null );
				break;
		}
	}
});

$( '#clear_dice-results' ).on( 'click', function() {
	if ( $( this ).hasClass( 'active' ) ) {
		$( '#dice-results>*' ).removeClass( 'hidden' );
	} else {
		$( '#dice-results>*' ).addClass( 'hidden' );
	}
	$( this ).toggleClass( 'active' );
});

function updateDiceInputs( total, hunger ) {
	$( '#dice-pool__input' ).val( total );
	if (hunger) {
		$( '#hunger-dice__input' ).val( hunger );
	}
}

function getStatValue( stat, isTracker ) {
	if (isTracker) {
		let tracker = $( '#' + stat + '-tracker' );
		let max = getTrackerTypeValue( tracker, 'maxlevel' );
		let superficial = getTrackerTypeValue( tracker, 'superficial' );
		let aggravated = getTrackerTypeValue( tracker, 'aggravated' );
		return max - (superficial + aggravated);
	}
	return parseInt($( '.' + stat + ' .level' ).attr( 'class' ).replace( 'level level', '' ));
}

function getTrackerTypeValue( elem, type ) {
	console.log( elem.attr( 'class' ) );
	let classes = elem.attr( 'class' ).split( ' ' );
	for ( className in classes ) {
		if ( classes[className].includes( type ) ) {
			return parseInt( classes[className].replace( type, '' ) );
		}
	}
	return null
}

function playRandomDiceRollEffect() {
	const rollEffectIndex = Math.floor(Math.random() * ($( 'audio.roll-effect' ).length)) + 1;
	$( '#effect__dice-roll_' + rollEffectIndex )[0].play();
}

