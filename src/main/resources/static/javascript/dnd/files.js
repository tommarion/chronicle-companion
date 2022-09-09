
function loadCampaignSettings( campaignId ) {
	$.getJSON(base + 'campaign/' + campaignId + '/', function( campaignData ){
		campaignSettings = campaignData;
		$( '#loading__wrapper' ).addClass( 'hidden' );
		// populateCampaignSettings(campaignSettings);
		handleCampaignForDM();
	}).fail( function( xhr, status, error ){
	    console.log("An error has occurred loading chronicle settings for: " + campaignId);
	});
}