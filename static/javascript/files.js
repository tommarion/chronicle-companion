function loadChronicleSettings( chronicleId ) {
	$.getJSON(base + 'chronicle/' + chronicleId + '/', function( chronicleData ){
		chronicleSettings = chronicleData;
		$( '#loading__wrapper' ).addClass( 'hidden' );
		promptForUser();
	}).fail( function(){
	    console.log("An error has occurred loading chronicle file: " + chronicleSettingsFilename);
	});
}
function loadCharacterById( characterId ) {
	$.getJSON(base + 'character/' + characterId + '/', function( characterData ){
		$( '#loading__wrapper' ).addClass( 'hidden' );
		$( '#character__wrapper' ).html( assembleCharacterData( characterData ) );
		$( '#story-text__wrapper' ).fadeOut();
		$( '#story-toolbar' ).fadeOut();
	}).fail( function(){
	    console.log("An error has occurred loading chronicle file: " + chronicleSettingsFilename);
	});
}

function postDiceRoll( postData ) {
	postData.timestamp = getTimestamp();
	$.ajax({
		url: base + 'roll/',
		type: 'POST',
		data: JSON.stringify(postData),
		contentType: 'application/json'
	});
}

function getTimestamp() {
	date = new Date();
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


