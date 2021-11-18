function processLocations() {
	let locations = chronicleSettings.locations;
	let locationBtnStr = "";
	let locationsList = Object.keys(locations).sort();
	for (let locationName in locationsList) {
		locationBtnStr += '<div class="btn btn-location"><div>' + 
			locationsList[locationName] + '</div></div>';
	}
	locationBtnStr += '<div class="spacer"></div>';
	return locationBtnStr;
}

$( '#story-toolbar-content' ).on( 'click', '.btn-location', function() {
	if (! $( this ).hasClass( 'active' ) ) {
		$( '.btn-character.active' ).removeClass( 'active' );
		$( '.btn-location.active' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
		processLocationData( $( this ) );
		$( '#story-text__wrapper' ).fadeOut();
		$( '#story-toolbar' ).fadeOut();
		storyToolbarClick();
	}
});

function processLocationData( locationBtn ) {
	let locationName = locationBtn.find( 'div' ).html();
	let locationInfo = chronicleSettings.locations[locationName];
	$( '#character__wrapper' ).html( assembleLocationData( locationName, locationInfo ) )
		.attr( 'class', 'active' );
}

function assembleLocationData( locationName, locationInfo ) {
	console.log( locationInfo );
	let locationSheetStr = '<div><div id="location-header"><span class="header">' + locationName + '</span>';
	if (locationInfo.address) {
		locationSheetStr += '<br/><iframe class="location-map"\
			  frameborder="0" style="border:0"\
			  src="//maps.google.com/maps?q=' + locationInfo.address.replaceAll( ' ', '+' ) + '&z=13&output=embed">\
			</iframe>'
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
	if ( user == STORYTELLER && locationInfo.storyteller_notes) {
		locationSheetStr += '<div id="location-storyteller_notes">' + 
			locationInfo.storyteller_notes + '</div>';
	}
	locationSheetStr += '</div>';

	return locationSheetStr;
}
