function loadChronicleSettings( chronicleId ) {
	$.getJSON(base + 'chronicle/' + chronicleId + '/', function( chronicleData ){
		chronicleSettings = chronicleData;
		$( '#loading__wrapper' ).addClass( 'hidden' );
		populateChronicleSettings(chronicleSettings);
		promptForUser();
	}).fail( function( xhr, status, error ){
	    console.log("An error has occurred loading chronicle settings for: " + chronicleId);
	});
}
function loadCharacterById( characterId ) {
	$.getJSON(base + 'character/' + characterId + '/', function( characterData ){
		$( '#loading__wrapper' ).addClass( 'hidden' );
		$( '#character__wrapper' ).html( assembleCharacterData( characterData ) );
		$( '#story-text__wrapper' ).fadeOut();
		$( '#story-toolbar' ).fadeOut();
	}).fail( function( xhr, status, error ){
	    console.log("An error has occurred loading character data for: " + characterId);
	});
}

function postDiceRoll( postData ) {
	postData.timestamp = new Date().toUTCString();
	$.ajax({
		url: base + 'roll/',
		type: 'POST',
		data: JSON.stringify(postData),
		contentType: 'application/json'
	});
}

function saveCharacter( postData, chronicleId ) {
	$.ajax({
		url: base + 'chronicle/' + chronicleId + '/characters/',
		type: 'POST',
		data: JSON.stringify(postData),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		console.log( "ADD RESPONSE: ", data )
		chronicleSettings = data;
		$( '#pc_list' ).html( getChronicleSettingsCharacters( data.characters.pc ) );
		$( '#npc_list' ).html( getChronicleSettingsCharacters( data.characters.npc ) );
		clearAndCloseCharacterSheetForm();
	}).fail( function( xhr, status, error ) {
		console.log(xhr);
	    const response = JSON.parse(xhr.responseText);
	    console.log( "An error has occurred saving character data for: " + postData.name, response );
	    alert( "There was a problem saving the character sheet data: " + response.message );
	    return false;
	});
}

function saveLocation( postData, chronicleId ) {
	$.ajax({
		url: base + 'chronicle/' + chronicleId + '/locations/',
		type: 'POST',
		data: JSON.stringify(postData),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		chronicleSettings = data;
		$( '#locations_list' ).html( getChronicleSettingsLocations( data.locations ) );
		clearAndCloseLocationForm();
	}).fail( function( xhr, status, error ) {
		console.log(xhr);
	    const response = JSON.parse(xhr.responseText);
	    console.log( "An error has occurred saving character data for: " + postData.name, response );
	    alert( "There was a problem saving the character sheet data: " + response.message );
	    return false;
	});
}

function toggleChronicleEnabled( chronicleId, enabled ) {
	let url = base + 'chronicle/' + chronicleId;
	if (enabled == ENABLE) {
		url += '/enable/';
	} else {
		url += '/disable/';
	}
	$.ajax({
		url: url,
		type: 'GET',
	}).done(function( data, status, xhr ) {
		handleToggleEnabledResponse( data );
	});
}

function updateStory( type, postData, chronicleId ) {
	console.log(postData)
	$.ajax({
		url: base + 'chronicle/' + chronicleId + '/chapters/',
		type: type,
		data: JSON.stringify(postData),
		contentType: 'application/json'
	}).done(function( data, status, xhr ) {
		chronicleSettings = data;
		$( '#story_list' ).html( getChronicleSettingsStory( data.chapters ) );
		// clearAndCloseLocationForm();
	}).fail( function( xhr, status, error ) {
		console.log(xhr);
	    const response = JSON.parse(xhr.responseText);
	    console.log( "An error has occurred saving character data for: " + postData.name, response );
	    alert( "There was a problem saving the character sheet data: " + response.message );
	    return false;
	});
}

