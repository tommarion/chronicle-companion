function populateAdventureSettings( adventureSettings ) {
	$( '#chronicle_name__input' ).val( adventureSettings.name );
	$( '#chronicle_enabled' ).prop( 'checked', adventureSettings.enabled );
}


function getAdventureId() {
	let loc = window.location.href;
	if ( loc.indexOf( '?adventure_id=' ) == -1 ) {
		return null;
	}
	let adventureId = loc.substring( loc.indexOf( '?adventure_id=' ) + 14 );
	if ( adventureId.indexOf( '&' ) != -1 ) {
		adventureId = adventureId.substring( 0, adventureId.indexOf( '&' ) );
	}
	return adventureId;
}

export {
	getAdventureId,
	populateAdventureSettings
}