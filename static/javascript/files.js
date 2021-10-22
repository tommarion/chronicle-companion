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
		alert();
		$( '#locations_list' ).html( getChronicleSettingsLocations( data.locations ) );
		clearAndCloseLocationForm();
		alert();
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

// function saveChronicleSettings( fileType ) {
// 	var zip = new JSZip();

// 	const folderName = chronicleSettingsFilename.substring(0, 
// 		chronicleSettingsFilename.indexOf('.'))

// 	var saveData = zip.folder(folderName);
// 	const chronicleStr = JSON.stringify(chronicleSettings[fileType], undefined, 4);

// 	saveData.file( updateFilename (chronicleSettingsFilename, fileType ), chronicleStr);

// 	zip.generateAsync({ 
// 		type: 'blob'
// 	}).then( function( content ) {
// 	    saveAs(content,  getZipFolderName( folderName ));
// 	});
// }

// function updateFilename( filename, addition ) {
// 	return filename.replace( '.vtm', '-' + addition + '.vtm' ); 
// }

// function getZipFolderName( folderName ) {
//     var today = new Date();
//     // var y = today.getFullYear();
//     // JavaScript months are 0-based.
//     var m = today.getMonth() + 1;
//     var d = today.getDate();
//     // Military time??
//     var h = today.getHours();
//     var mi = today.getMinutes();
//     // var s = today.getSeconds();
//     return folderName 
//     	// + "-" + y 
//     	+ "-" + m + "-" + d + "T" + h + "-" + mi 
//     	// + "-" + s
//     	+ '.zip';
// }

// $( '#btn_save-settings' ).on( 'click', function() {
// 	if (confirm("Download a zip file of the Chronicle settings?\n(Only contains character data right now)")) {
// 		saveChronicleSettings( 'characters' );
// 	}
// });

// $( '#btn_save-settings' ).on( 'click', function() {
// 	// loadChronicleSettings( filename... );
// });


