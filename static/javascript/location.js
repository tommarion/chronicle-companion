function processLocations() {
	let locations = chronicleSettings.locations;
	let locationBtnStr = "";
	let locationsList = Object.keys(locations).sort();
	for (let locationName in locationsList) {
		locationBtnStr += '<div class="btn btn-location"><div>' + 
			locationsList[locationName] + '</div></div>';
	}
	locationBtnStr += '<div class="spacer"></div>';
	$( '#story-toolbar-content' ).html(locationBtnStr);
}

$( '#story-toolbar-content' ).on( 'click', '.btn-location', function() {
	if (! $( this ).hasClass( 'active' ) ) {
		$( '.btn-character.active' ).removeClass( 'active' );
		$( '.btn-location.active' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
		processLocationData( $( this ) );
		storyToolbarClick();
	}
});

function processLocationData( locationBtn ) {
	let locationName = locationBtn.find( 'div' ).html();
	let locationInfo = chronicleSettings.locations[locationName];
	$( '#character__wrapper' ).html( assembleLocationData( locationName, locationInfo ) );
}

function assembleLocationData( locationName, locationInfo ) {
	console.log( locationInfo );
	let locationSheetStr = '<div><div id="location-header"><span class="header">' + locationName + '</span>';
	if (locationInfo.address) {
		locationSheetStr += '<br/><span class="sub-text">' + locationInfo.address + '</span>';
	}
	locationSheetStr += '</div>';
	if (locationInfo.pic) {
		locationSheetStr += '<div><img src="' + locationInfo.pic + '"/></div>';
	}
	if (locationInfo.description) {
		locationSheetStr += '<div id="location-description">' + 
			locationInfo.description + '</div>';
	}
	locationSheetStr += '</div>';

	return locationSheetStr;
}
