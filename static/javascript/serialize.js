function serializeSheet() {
	let characterObj = {};
	let missingValues = "";

	let name = $( '#character_name__wrapper input' ).val();
	if ( name == '' ) {
		missingValues = appendMissing( missingValues, "character name" );
	} else {
		characterObj[ 'name' ] = name;
	}

	let age = $( '#character_age__wrapper' ).find( 'input' ).val();
	if ( age ) {
		characterObj[ 'age' ] = age;
	}

	let born = $( '#character_born__wrapper' ).find( 'input' ).val();
	if ( born ) {
		characterObj[ 'born' ] = born;
	}

	let bio = $( '#character_bio__wrapper' ).find( 'textarea' ).val();
	if ( bio ) {
		characterObj[ 'bio' ] = bio;
	}

	let being = $( '#being__select' ).find( ':selected' ).text();
	characterObj[ 'being' ] = being;

	if ( being == KINDRED ) {
		let clan = $( '#character_clan' ).find( ':selected' ).text();
		if ( clan == 'Select Clan' ) {
			missingValues = appendMissing( missingValues, "clan" );
		} else {
			characterObj[ 'clan' ] = clan;
			if ( characterObj[ 'clan' ] == TREMERE ) {
				let house = $( '#character_house__select' ).find( ':selected' ).text();
				if ( house == 'Select House' ) {
					missingValues = appendMissing( missingValues, "house" );
				} else {
					characterObj[ 'house' ] = house
				}
			}
		}

		let embraced = $( '#character_embraced__wrapper' ).find( 'input' ).val();
		if ( embraced ) {
			characterObj[ 'embraced' ] = embraced;
		}

		let gen = $( '#character_generation__wrapper' ).find( 'input' ).val();
		if ( gen ) {
			characterObj[ 'generation' ] = gen;
		}

		let sire = $( '#character_sire__wrapper' ).find( 'input' ).val();
		if ( sire ) {
			characterObj[ 'sire' ] = sire;
		}

		let predatorType = $( '#add_predator_type' ).find( ':selected' ).text();
		if ( predatorType == 'Select Predator Type' ) {
			missingValues = appendMissing( missingValues, "predator type" );
		} else {
			characterObj[ 'predator_type' ] = predatorType;
		}

		let advAndFlaws = getAdvAndFlaws();
		if ( validAdvAndFlaws( advAndFlaws ) ) {
			characterObj[ 'advantages' ] = advAndFlaws.advantages;
			characterObj[ 'flaws' ] = advAndFlaws.flaws;
		} else {
			missingValues = appendMissing( missingValues, "advantages and/or flaws missing level values" );
		}

		let bloodPotency = $( '#add_blood_potency' ).val();
		if ( bloodPotency ) {
			characterObj[ 'blood_potency' ] = bloodPotency;
		} else {
			missingValues = appendMissing( missingValues, "blood potency" );
		}

		characterObj[ 'humanity' ] = $( '#add_humanity' ).val();

		let convAndTouch = getConvAndTouch();
		characterObj[ 'convictions' ] = convAndTouch.convictions;
		characterObj[ 'touchstones' ] = convAndTouch.touchstones;

	} else if ( being == GHOUL ) {
		let ghouled = $( '#character_ghouled__wrapper' ).find( 'input' ).val();
		if ( ghouled ) {
			characterObj[ 'ghouled' ] = ghouled;
		}
	} else if ( being == MORTAL ) {
		let touchstoneFor = $( '#character_touchstone_for' ).val();
		if ( touchstoneFor ) {
			characterObj[ 'touchstone_for' ] = touchstoneFor;
		}
	} else if ( being == WEREWOLF ) {
		let tribe = $( '#character_tribe' ).find( ':selected' ).text();
		if ( tribe ) {
			characterObj[ 'tribe' ] = tribe;
		} else {
			missingValues = appendMissing( missingValues, "tribe" );
		}
	}


	if ( being == KINDRED || being == GHOUL ) {
		let disciplineStr = getAddSheetDisciplines();
		if ( !disciplineStr ) {
			missingValues = appendMissing( missingValues, "disciplines" );
		} else {
			characterObj[ 'disciplines' ] = disciplineStr;
		}
	}

	if ( being == MORTAL || being == GHOUL ) {
		let retainerFor = $( '#character_retainer_for__select' ).find( ':selected' ).text();
		if ( retainerFor != 'None' ) {
			characterObj[ 'retainer_for' ] = retainerFor;
		}
	}

	if ( being == KINDRED || being == GHOUL || being == MORTAL || being == ANIMAL ) {
		let boundTo = $( '#character_bound_to__select' ).find( ':selected' ).text();
		if ( boundTo != 'None' ) {
			characterObj[ 'bound_to' ] = boundTo;
		}
	}
	if ( being == ANIMAL ) {
		let animal = $( '#character_animal__wrapper input' ).val();
		if ( animal != '' && animal != null && animal != undefined ) {
			characterObj[ 'animal' ] = animal;
		} else {
			missingValues = appendMissing( missingValues, "animal type" );
		}
	}

	if (missingValues != "") {
		alert( "Please enter values for: " + missingValues );
		return null;
	}
	let experience = $( '#add_experience' ).val();
	if ( experience ) {
		characterObj[ 'experience' ] = experience;
	} else {
		characterObj[ 'experience' ] = 0;
	}
	characterObj[ 'attributes' ] = getAddSheetAttributes( being );
	characterObj[ 'skills' ] = getAddSheetSkills();

	characterObj[ 'type' ] = $( '#player_sheet_add' ).data( 'type' );
	
	return characterObj;
}

function appendMissing( current, value ) {
	let missingValues = current;
	if (missingValues != "") {
		missingValues += ", ";
	}
	missingValues += "advantages and/or flaws missing level values";
	return missingValues;
}

function getAddSheetAttributes( being ) {
	let attributesObj = {};
	for ( attributesType in CHARACTER_ATTRIBUTES ) {
		let attributeType = CHARACTER_ATTRIBUTES[attributesType].type;
		if ( LIMITED_SHEET.includes( being ) ) {
			let value = getStatValue( attributeType );
			attributesObj[attributeType] = value;
		} else {
			for ( attribute in CHARACTER_ATTRIBUTES[attributesType].attributes ) {
				let attributeName = CHARACTER_ATTRIBUTES[attributesType].attributes[attribute];
				let value = getStatValue( attributeName );
				attributesObj[attributeName] = value;
			}
		}
	}
	return attributesObj;
}

function getAddSheetSkills() {
	let skillsObj = {};
	for (skill in CHARACTER_SKILLS) {
		let skillName = CHARACTER_SKILLS[skill].replace( ' ', '_' );
		skillsObj[skillName] = getStatValue( skillName );

		let specialty = getSpecialty( skillName );
		if ( specialty ) {
			skillsObj[ skillName + '_specialty' ] = specialty;
		}
	}
	return skillsObj;
}

function getAddSheetDisciplines() {
	let disciplinesList = [];
	$( '.discipline_add__wrapper' ).each(function() {
		let disciplinesObj = {};
		disciplinesObj[ 'name' ] = $( this ).find( '.discipline-name' ).html();
		if ( disciplinesObj[ 'name' ] == BLOOD_SORCERY_RITUALS ) {
			let ritualsStr = '[';
			let ritualsList = $( this ).find( '.rituals__list select' );
			if ( ritualsList.length == 0 ) {
				disciplinesObj = null;
				return;
			}
			for ( let i=0; i<ritualsList.length; i++ ) {
				let ritualStr = $( ritualsList[i] ).find( ':selected' ).text();
				if ( ritualsStr == "Select Ritual" ) {
					disciplinesObj = null;
					return;
				}
				if ( i > 0 ) {
					ritualsStr += ', ';
				}
				ritualsStr += '\"' + ritualStr + '\"';
			}
			ritualsStr += ']';
			disciplinesObj[ 'rituals' ] = ritualsStr;
		} else {
			disciplinesObj[ 'level' ] = $( this ).find( '.level' ).attr( 'class' )
				.replace( 'level level', '' );
			let powersStr = '[';
			let powersList = $( this ).find( '.powers_list select' );
			if ( powersList.length == 0 ) {
				disciplinesObj = null;
				return;
			}
			for ( let i=0; i<powersList.length; i++ ) {
				let powerStr = $( powersList[i] ).find( ':selected' ).text();
				if ( powerStr == "Select Power" ) {
					disciplinesObj = null;
					return;
				}
				if ( i > 0 ) {
					powersStr += ', ';
				}
				powersStr += '\"' + powerStr + '\"';
			}
			powersStr += ']';
			disciplinesObj[ 'powers' ] = powersStr;
		}
		if ( disciplinesObj ) {
			disciplinesList.push( disciplinesObj );
		}
	});
	return disciplinesList;
}

function getAdvAndFlaws() {
	let advAndFlaws = { 
		"advantages" : [],
		"flaws" : []
	};
	$( '#advantages__list' ).find( '.flex' ).each( function() {
		if ( $( this ).find( 'input' ).val() != '' ) {
			advAndFlaws.advantages.push({ 
				"name" : $( this ).find( 'input' ).val(),
				"level" : $( this ).find( '.level' ).attr( 'class' ).replace( 'level level', '' ) 
			});
		}
	});
	$( '#flaws__list' ).find( '.flex' ).each( function() {
		if ( $( this ).find( 'input' ).val() != '' ) {
			advAndFlaws.flaws.push({ 
				"name" : $( this ).find( 'input' ).val(),
				"level" : $( this ).find( '.level' ).attr( 'class' ).replace( 'level level', '' ) 
			});
		}
	});
	return advAndFlaws;
}

function validAdvAndFlaws( advAndFlaws ) {
	for (adv in advAndFlaws.advantages ) {
		if ( advAndFlaws.advantages[adv].level == 0 ) {
			return false;
		}
	}
	for (flaw in advAndFlaws.flaws ) {
		if ( advAndFlaws.flaws[flaw].level == 0 ) {
			return false;
		}
	}
	return true;
}

function getConvAndTouch() {
	let convAndTouch = { 
		"convictions" : [],
		"touchstones" : []
	};
	$( '#convictions__list' ).find( '.flex' ).each( function() {
		if ( $( this ).find( 'input' ).val() != '' ) {
			convAndTouch.convictions.push( $( this ).find( 'input' ).val() );
		}
	});
	$( '#touchstones__list' ).find( '.flex' ).each( function() {
		if ( $( this ).find( 'input' ).val() != '' ) {
			convAndTouch.touchstones.push( $( this ).find( 'input' ).val() );
		}
	});
	return convAndTouch;
}


function serializeLocation() {
	let locationObj = {};
	let name = $( '#location_add_name' ).val();

	if ( name ) {
		locationObj[ 'name' ] = name;
	} else {
		alert( 'Please enter a name for this location' );
		return null;
	}

	let description = $( '#location_add_description' ).val();
	if ( description ) {
		locationObj[ 'description' ] = description;
	}

	let storyteller_notes = $( '#location_add_storyteller_notes' ).val();
	if ( storyteller_notes ) {
		locationObj[ 'storyteller_notes' ] = storyteller_notes;
	}

	let address = $( '#location_add_address' ).val();
	if ( address ) {
		locationObj[ 'address' ] = address;
	}

	let haven = $( '#location_add_haven' ).find( ':selected' ).val();
	if ( haven && haven != 'None' ) {
		locationObj[ 'haven' ] = haven;
	}

	locationObj[ 'visible' ] = $( '#location_add_visible' ).prop( 'checked' );

	return locationObj;
}

function serializeStory() {
	let storyObj = [];
	chapterWrappers = $( '.chapter__wrapper:not(.add)' ).each(function() {
		let chapterObj = {};
		chapterObj['name'] = $( this ).prev().find( 'input' ).val();
		chapterObj['scenes'] = [];
		$( this ).find( '.scene__wrapper:not(.add)' ).each(function() {
			let sceneObj = {};
			sceneObj['name'] = $( this ).prev().find( 'input' ).val();
			sceneObj['story'] = $( this ).find( 'textarea' ).val();
			chapterObj['scenes'].push(sceneObj);
		});
		storyObj.push(chapterObj);
	});
	return storyObj;
}


// DESERIALIZE

function populateCharacterSheetSettings( name, type ) {
	const characterData = chronicleSettings.characters[type][name];
	$( '#character_name__wrapper input' ).val( name );
	$( '#character_clan' ).val( characterData['clan'] );
	$( '#character_age__wrapper input' ).val( characterData['apparent_age'] );
	$( '#character_born__wrapper input' ).val( characterData['born'] );
	$( '#character_embraced__wrapper input' ).val( characterData['embraced'] );
	$( '#character_generation__wrapper input' ).val( characterData['generation']);
	$( '#character_sire__wrapper input' ).val( characterData['sire']);
	$( '#add_predator_type' ).val( characterData['predator_type'] );
	$( '#character_bio__wrapper textarea' ).val( characterData['bio'] );
	$( '#add_blood_potency' ).val( characterData['blood_potency' ] );
	$( '#add_experience' ).val( characterData['experience' ] );
	$( '#add_humanity' ).val( characterData.sheet.trackers.humanity_max );
	for ( index in characterData.sheet.disciplines ) {
		let disciplineObj = characterData.sheet.disciplines[index]
		addDiscipline( disciplineObj.discipline );
		let container = $( '.discipline_add__wrapper.' + disciplineObj.discipline.replace( ' ', '_' ).replace( ' ', '_' ) );
		let powers = JSON.parse( disciplineObj.powers )
		container.find( '.level' ).attr( 'class' , 'level level' + disciplineObj.level );
		if ( disciplineObj.discipline == BLOOD_SORCERY_RITUALS ) {
			for (ritual in powers) {
				$( '.ritual.add' ).val( powers[ritual] );
				addRitual();
			}
		} else {
			addPowers( container.find( '.powers_list' ), disciplineObj.discipline, disciplineObj.level );
			for ( index in powers ) {
				$( container.find( '.power__wrapper' )[index] ).find( 'select' ).val( powers[index] );
			}
		}
		$( '#character_discipline__select' ).find( 'option[value="' + disciplineObj.discipline + '"]' ).remove();
	}
	parseDetails( $( '#advantages__list' ), characterData.sheet.advantages )
	parseDetails( $( '#flaws__list' ), characterData.sheet.flaws )
	parseDetails( $( '#convictions__list' ), characterData.sheet.convictions )
	parseDetails( $( '#touchstones__list' ), characterData.sheet.touchstones )
	for ( attrType in characterData.sheet.attributes ) {
		for ( attr in characterData.sheet.attributes[attrType] ) {
			const level = characterData.sheet.attributes[attrType][attr];
			$( '#attr_stats__wrapper' ).find( '.' + attr ).find( '.level' ).attr( 'class', 'level level' + level );
		}
	}
	for ( skill in characterData.sheet.skills ) {
		const level = characterData.sheet.skills[skill];
		$( '#attr_stats__wrapper' ).find( '.' + skill ).find( '.level' ).attr( 'class', 'level level' + level );
	}
	updateTrackers();
}

function parseDetails( container, details ) {
	for ( index in details ) {
		container.append( getDetailStr( details[index].name, details[index].level ) );
	}
}

function populateLocationForm( name ) {
	const locationData = chronicleSettings.locations[name];
	$( '#location_add_name' ).val( name );
	$( '#location_add_visible' ).prop( 'checked', locationData.visible_on_map );
	if ( locationData.address ) {
		$( '#location_add_address' ).val( locationData.address );
	}
	if ( locationData.description ) {
		$( '#location_add_description' ).val( locationData.description );
	}
	if ( locationData.storyteller_notes ) {
		$( '#location_add_address' ).val( locationData.storyteller_notes );
	}
	if ( locationData.havens && locationData.havens.length > 0 ) {
		$( '#location_add_haven' ).val( locationData.havens );
	} else {
		$( '#location_add_have' ).val( 'None' );
	}
}
