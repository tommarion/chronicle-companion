import { base, user } from '../common/common.js';

let users = [ "DM" ];

export const SETTINGS_MODE_CAMPAIGN = 'campaign';

let campaignSettings = {};
export var INITIATIVE = 'initiative';

let rollType = '';
function setRollType( type ) {
	rollType = type;
}

$( '#container' ).addClass( navigator.platform );

$( '#pass-login__input, #user-login__input' ).on( 'keyup', function( e ) {
	if ( e.key == 'Enter' || e.keyCode == 13 ) {
		$( '#login_submit' ).trigger( 'click' );
	}
});

$( '#user-login__input' ).focus();

export { setRollType };