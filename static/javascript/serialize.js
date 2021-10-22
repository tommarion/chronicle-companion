function serializeSheet() {
	let characterObj = {};
	let missingValues = "";

	let name = $( '#character_name__wrapper input' ).val();
	if ( name == '' ) {
		missingValues = appendMissing( missingValues, "character name" );
	} else {
		characterObj[ 'name' ] = name;
	}

	let clan = $( '#character_clan' ).find( ':selected' ).text();
	if ( clan == 'Select Clan' ) {
		missingValues = appendMissing( missingValues, "clan" );
	} else {
		characterObj[ 'clan' ] = clan;
	}

	let disciplineStr = getAddSheetDisciplines();
	if ( !disciplineStr ) {
		missingValues = appendMissing( missingValues, "disciplines" );
	} else {
		characterObj[ 'disciplines' ] = disciplineStr;
	}

	let age = $( '#character_age__wrapper' ).find( 'input' ).val();
	if ( age ) {
		characterObj[ 'age' ] = age;
	}

	let born = $( '#character_born__wrapper' ).find( 'input' ).val();
	if ( born ) {
		characterObj[ 'born' ] = born;
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

	let bio = $( '#character_bio__wrapper' ).find( 'textarea' ).val();
	if ( bio ) {
		characterObj[ 'bio' ] = bio;
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

	let experience = $( '#add_experience' ).val();
	if ( experience ) {
		characterObj[ 'experience' ] = experience;
	} else {
		characterObj[ 'experience' ] = 0;
	}
	characterObj[ 'humanity' ] = $( '#add_humanity' ).val();

	let convAndTouch = getConvAndTouch();
	characterObj[ 'convictions' ] = convAndTouch.convictions;
	characterObj[ 'touchstones' ] = convAndTouch.touchstones;

	if (missingValues != "") {
		alert("Please enter values for: " + missingValues);
		return null;
	}
	characterObj[ 'attributes' ] = getAddSheetAttributes();
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

function getAddSheetAttributes() {
	let attributesObj = {};
	for ( attributesType in CHARACTER_ATTRIBUTES ) {
		let attributeType = CHARACTER_ATTRIBUTES[attributesType].type;
		for ( attribute in CHARACTER_ATTRIBUTES[attributesType].attributes ) {
			let attributeName = CHARACTER_ATTRIBUTES[attributesType].attributes[attribute];
			let value = getStatValue( attributeName );
			attributesObj[attributeName] = value;
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

	let description = $( '#location_add_decription' ).val();
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
	if ( haven ) {
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
