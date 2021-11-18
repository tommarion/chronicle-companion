// CACHE THE SETTINGS DATA IN THE BROWSER 
function cacheChronicleSettings() {
	localStorage.setItem( CACHE_KEY_CHRONICLE, JSON.stringify(chronicleSettings) );
}

function retrieveCachedChronicleSettings() {
	let settingsStr = localStorage.getItem( CACHE_KEY_CHRONICLE );
	if ( settingsStr ) {
		return JSON.parse( settingsStr );
	}
	return null;
}

function updateCharacterValue( characterType, characterName, valueType, valueSubtype, valueName, valueSubname, value ) {
	let characterSheetValue = chronicleSettings.characters[characterType][characterName].sheet[valueType];
	if ( valueSubtype ) {
		characterSheetValue[valueSubtype][valueName][valueSubname] = value;
	} else if ( valueSubname ) {
		characterSheetValue[valueName][valueSubname] = value;
	} else {
		characterSheetValue[valueName] = value;
	}
	cacheChronicleSettings();
}

function mockUpdateCharacterValue( characterType, characterName, valueType, valueSubtype, valueName, valueSubname, value ) {
	let mockChronicleSettings = JSON.parse(JSON.stringify(chronicleSettings));
	let characterSheetValue = mockChronicleSettings.characters[characterType][characterName].sheet[valueType];
	if ( valueSubtype ) {
		characterSheetValue[valueSubtype][valueName][valueSubname] = value;
	} else if ( valueSubname ) {
		characterSheetValue[valueName][valueSubname] = value;
	} else {
		characterSheetValue[valueName] = value;
	}
	console.log( mockChronicleSettings );
}

$( '#btn_clear-cache' ).on( 'click', function() {
	if (confirm("Clear cached settings?")) {
		localStorage.clear();
	}
})
