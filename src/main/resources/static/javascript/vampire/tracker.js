import { TRACKER_MAX, DAMAGE_STAINS, DAMAGE_SUPERFICIAL, DAMAGE_AGGRAVATED, HUNGER_LEVEL, rerollType, VALUE_TYPE_TRACKERS } from './vampire.js';
import { updateData } from '../common/socket.js';
import { reroll } from './dice.js';

function processContextMenu( trackerElem, clickType ) {
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const trackerId = trackerElem.attr( 'id' );
	
	if ( trackerId === 'humanity-tracker') {
		const maxLevel = getValueFromElementInArray( classes, TRACKER_MAX );
		const stains = getValueFromElementInArray( classes, DAMAGE_STAINS );
		const addStain = stains < (10 - maxLevel);
		const removeStain = stains > 0;

		openContextMenu([{ 
			'name' : 'Add Stains',
			'class' : 'addStains ',
			'enabled': addStain 
		},{
			'name' : 'Remove Stains',
			'class' : 'removeStains ',
			'enabled' : removeStain
		}], false);

	} else if ( trackerId == 'health-tracker' || trackerId == 'willpower-tracker' ) {
		const maxLevel = getValueFromElementInArray( classes, TRACKER_MAX );
		const superficial = getValueFromElementInArray( classes, DAMAGE_SUPERFICIAL );
		const aggravated = getValueFromElementInArray( classes, DAMAGE_AGGRAVATED );
		const removeSuperficialDmg = superficial > 0;
		const removeAggravatedDmg = aggravated > 0;
		const addSuperficialOrAggravatedDmg = aggravated < maxLevel;

		openContextMenu([{
			'name' : 'Add Superficial',
			'class' : trackerId + ' addSuperficial ',
			'enabled' : addSuperficialOrAggravatedDmg
		},{
			'name' : 'Remove Superficial',
			'class' : trackerId + ' removeSuperficial ',
			'enabled' : removeSuperficialDmg
		},{
			'name' : 'Add Aggravated',
			'class' : trackerId + ' addAggravated ',
			'enabled' : addSuperficialOrAggravatedDmg
		},{
			'name' : 'Remove Aggravated',
			'class' : trackerId + ' removeAggravated ',
			'enabled' : removeAggravatedDmg
		}], false)

	} else if ( trackerId === 'hunger-tracker' ) {
		const hunger = getValueFromElementInArray( classes, HUNGER_LEVEL );
		const addHunger = hunger < MAX_HUNGER;
		const removeHunger = hunger > 0;
		openContextMenu([{ 
			'name' 		: 'Add Hunger',
			'class' 	: 'addHunger ',
			'enabled' 	: addHunger 
		},
		{
			'name' 		: 'Remove Hunger',
			'class' 	: 'removeHunger ',
			'enabled' 	: removeHunger
		}], false);
	}
}

function openContextMenu( options, isReroll ) {
	$( '#value-modifier__background, #value-modifier__dialog' ).removeClass( 'hidden' );
	$( '#reference__wrapper, #title__wrapper' ).addClass( 'blur' );
 
	let optionStr = '<div id="options__wrapper" class="flex">';
	for ( let option in options ) {
		let disabledStr = '';
		if (!options[option].enabled) {
			disabledStr = ' disabled';
		}
		optionStr += '<div class="btn-option ' + options[option].class + disabledStr + '">' + options[option].name + '</div>';
	}
	optionStr += '</div>';

	$( '#dialog-text' ).html( optionStr );
}

$( '#btn__dialog-close' ).on( 'click', function() {
	$( '#value-modifier__background, #value-modifier__dialog' ).addClass( 'hidden' );
	$( '#reference__wrapper, #title__wrapper' ).removeClass( 'blur' );
	$( '#dialog-text' ).html( '' );
	$( '.btn-increase' ).removeClass( 'disabled' );
	$( '.btn-decrease' ).addClass( 'disabled' );
});

$( '#value-modifier__dialog' ).on( 'click', '.btn-option', function(){
	if (!$( this ).hasClass( 'disabled' ) ) {
		var trackerId = '';

		if ($( this ).hasClass( 'willpower-tracker' ) ) {
			trackerId = '#willpower-tracker';
		} else if ($( this ).hasClass( 'health-tracker' ) ) {
			trackerId = '#health-tracker';
		}

		if ($( this ).hasClass( 'addHunger' ) ) {
			updateHunger( 'add' );
		} else if ($( this ).hasClass( 'removeHunger' ) ) {
			updateHunger( 'remove' );
		} else if ($( this ).hasClass( 'addStains' ) ) {
			addStains();
		} else if ($( this ).hasClass( 'removeStains' ) ) {
			removeStains();
		} else if ($( this ).hasClass( 'addSuperficial' ) ) {
			let isReroll = $( this ).hasClass( 'reroll' );
			if ( isReroll ) {
				reroll(
					parseInt($( '#dialog-value' ).html()),
					$( this ).html()
				);
				$( this ).parent().find( '.roll_for' ).html( rerollType + ' (REROLLED)' ); 
			}
			addSuperficial( trackerId, isReroll );
		} else if ($( this ).hasClass( 'removeSuperficial' ) ) {
			removeSuperficial( trackerId );
		} else if ($( this ).hasClass( 'addAggravated' ) ) {
			addAggravated( trackerId );
		} else if ($( this ).hasClass( 'removeAggravated' ) ) {
			removeAggravated( trackerId );
		}
		$( '#btn__dialog-close' ).trigger( 'click' );
		$( '#dialog-value' ).html('1');
	}
});


// SUPERFICIAL DAMAGE


function addSuperficial( trackerId, isReroll ) {
	const trackerElem = $( trackerId );
	if (trackerElem.length === 0) {
		return;
	}
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const maxLevel = getValueFromElementInArray( classes, TRACKER_MAX );
	const superficial = getValueFromElementInArray( classes, DAMAGE_SUPERFICIAL );
	const aggravated = getValueFromElementInArray( classes, DAMAGE_AGGRAVATED );
	const addSuperficialDmg = superficial + aggravated < maxLevel;
	const addAggravatedDmg = aggravated < maxLevel;
	const superficialChange = isReroll ? 1 : parseInt($( '#dialog-value' ).html());

	let characterBioElem = trackerElem.parent().parent().parent().parent().parent().find( '.characterName' );
	let characterName = characterBioElem.html();
	let characterType = characterBioElem.attr( 'class' ).replace( 'header ', '' ).replace( ' characterName' , '' );
	let characterId = characterBioElem.parent().data( 'id' );
	let trackerType = trackerElem.attr( 'id' ).includes( 'health' ) ? 'health' : 'willpower';

	updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, trackerType, DAMAGE_SUPERFICIAL, superficialChange, false);
}

function removeSuperficial( trackerId ) {
	const trackerElem = $( trackerId );
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const superficial = getValueFromElementInArray( classes, DAMAGE_SUPERFICIAL );
	const superficialChange = parseInt($( '#dialog-value' ).html());

	let characterBioElem = trackerElem.parent().parent().parent().parent().parent().find( '.characterName' );
	let characterName = characterBioElem.html();
	let characterType = characterBioElem.attr( 'class' ).replace( 'header ', '' ).replace( ' characterName' , '' );
	let characterId = characterBioElem.parent().data( 'id' );
	let trackerType = trackerElem.attr( 'id' ).includes( 'health' ) ? 'health' : 'willpower';
	// let newSuperficial = superficial - superficialChange;

	updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, trackerType, DAMAGE_SUPERFICIAL, superficialChange, true);
}


// AGGRAVATED DAMAGE



function addAggravated( trackerId ) {
	const trackerElem = $( trackerId );
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const maxLevel = getValueFromElementInArray( classes, TRACKER_MAX );
	const superficial = getValueFromElementInArray( classes, DAMAGE_SUPERFICIAL );
	const aggravated = getValueFromElementInArray( classes, DAMAGE_AGGRAVATED );
	const addAggravatedDmg = superficial + aggravated < maxLevel;
	const addAggravatedRemoveSuperficial = aggravated < maxLevel;
	const aggravatedChange = parseInt($( '#dialog-value' ).html());

	let characterBioElem = trackerElem.parent().parent().parent().parent().parent().find( '.characterName' );
	let characterName = characterBioElem.html();
	let characterType = characterBioElem.attr( 'class' ).replace( 'header ', '' ).replace( ' characterName' , '' );
	let characterId = characterBioElem.parent().data( 'id' );
	let trackerType = trackerElem.attr( 'id' ).includes( 'health' ) ? 'health' : 'willpower';
	let newAggravated = aggravated + aggravatedChange;

	if ( addAggravatedDmg ) {
		updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, trackerType, DAMAGE_AGGRAVATED, aggravatedChange, false);
	} else if ( addAggravatedRemoveSuperficial ) {
		// let newSuperficial = superficial - aggravatedChange;
		
		updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, trackerType, DAMAGE_SUPERFICIAL, aggravatedChange, true);
		updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, trackerType, DAMAGE_AGGRAVATED, aggravatedChange, false);
	}
}
function removeAggravated( trackerId ) {
	const trackerElem = $( trackerId );
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const aggravated = getValueFromElementInArray( classes, DAMAGE_AGGRAVATED );
	let characterBioElem = trackerElem.parent().parent().parent().parent().parent().find( '.characterName' );
	let characterName = characterBioElem.html();
	let characterId = characterBioElem.parent().data( 'id' );
	let trackerType = trackerElem.attr( 'id' ).includes( 'health' ) ? 'health' : 'willpower';
	const aggravatedChange = parseInt($( '#dialog-value' ).html());
	// const newAggravated = aggravated - aggravatedChange;

	updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, trackerType, DAMAGE_AGGRAVATED, aggravatedChange, true);
}


// STAIN DAMAGE


function addStains() {
	const trackerElem = $( '#humanity-tracker' );
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const stains = getValueFromElementInArray( classes, DAMAGE_STAINS );
	const stainChange = parseInt($( '#dialog-value' ).html());
	let characterBioElem = trackerElem.parent().parent().parent().parent().parent().find( '.characterName' );
	let characterName = characterBioElem.html();
	let characterId = characterBioElem.parent().data( 'id' );
	// let newStains = stains + stainChange;

	updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, 'humanity', DAMAGE_STAINS, stainChange, false);
}

function removeStains() {
	const trackerElem = $( '#humanity-tracker' );
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const stains = getValueFromElementInArray( classes, DAMAGE_STAINS );
	const stainChange = parseInt($( '#dialog-value' ).html());
	let characterBioElem = trackerElem.parent().parent().parent().parent().parent().find( '.characterName' );
	let characterName = characterBioElem.html();
	let characterId = characterBioElem.parent().data( 'id' );
	// let newStains = stains - stainChange;

	updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, 'humanity', DAMAGE_STAINS, stainChange, true);
}


// HUNGER DAMAGE

function updateHunger( operation ) {
	const trackerElem = $( '#hunger-tracker' );
	const classes = trackerElem.attr( 'class' ).split( ' ' );
	const hunger = getValueFromElementInArray( classes, HUNGER_LEVEL );
	const hungerChange = parseInt($( '#dialog-value' ).html());
	let characterBioElem = trackerElem.parent().parent().parent().parent().parent().find( '.characterName' );
	let characterName = characterBioElem.html();
	let characterType = characterBioElem.attr( 'class' ).replace( 'header ', '' ).replace( ' characterName' , '' );
	let characterId = characterBioElem.parent().data( 'id' );

	let remove = false;
	remove = operation === 'remove';

	updateCharacterValue( characterId, VALUE_TYPE_TRACKERS, 'hunger', null, hungerChange, remove );
	$( '#hunger-dice__input' ).val( remove ? hunger - hungerChange : hunger + hungerChange );
}

function updateCharacterValue( characterId, type, tracker, damageType, value, remove ) {
	let updateSettings = {
		'character_id' 	: characterId,
		'type' 			: type,
		'value' 		: value,
		'remove'		: remove
	};
	if ( tracker ) {
		updateSettings['tracker'] = tracker;
	}
	if ( damageType ) {
		updateSettings['damage_type'] =  damageType;
	}
	updateData(updateSettings);
}


// HELPER FUNCTIONS


function getValueFromElementInArray( array, elem ) {
	for ( let str in array ) {
		if ( array[str].includes( elem ) ) {
			return parseInt( array[str].replace( elem, '' ) );
		}
	}
	return null;
}

export {
	processContextMenu,
	openContextMenu
}