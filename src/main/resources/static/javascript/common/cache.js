const CACHE_KEY_CHRONICLE = 'chronicleSettings';
const CACHE_KEY_ACCOUNT = 'accountSettings';
const CACHE_KEY_PLAYER = 'playerSettings';
const CACHE_KEY_TOKEN = 'token';

// CACHE THE SETTINGS DATA IN THE BROWSER 
function cacheChronicleSettings( chronicleName, chronicleId ) {
	sessionStorage.setItem( CACHE_KEY_CHRONICLE, JSON.stringify({
		'name' 	: chronicleName,
		'id'	: chronicleId
	}) );
}
function retrieveCachedChronicleSettings() {
	let settingsStr = sessionStorage.getItem( CACHE_KEY_CHRONICLE );
	if ( settingsStr ) {
		return JSON.parse( settingsStr );
	}
	return null;
}
function getChronicleId() {
	let chronicleSettings = retrieveCachedChronicleSettings();
	return chronicleSettings ? chronicleSettings.id : null;
}

function cacheAccountSettings( accountId ) {
	sessionStorage.setItem( CACHE_KEY_ACCOUNT, accountId);
}
function getAccount() {
	return sessionStorage.getItem( CACHE_KEY_ACCOUNT );
}

function cacheToken( token ) {
	sessionStorage.setItem( CACHE_KEY_TOKEN, token);
}
function getToken() {
	return sessionStorage.getItem( CACHE_KEY_TOKEN );
}

function cacheUser( userId ) {
	sessionStorage.setItem( CACHE_KEY_PLAYER, userId);
}
function getUser() {
	return sessionStorage.getItem( CACHE_KEY_PLAYER );
}
function verifyCacheForCampaignLoad() {
	return sessionStorage.getItem( CACHE_KEY_ACCOUNT ) != null && 
		sessionStorage.getItem( CACHE_KEY_TOKEN ) != null ;
}

export {
	cacheChronicleSettings,
	getChronicleId,
	cacheAccountSettings,
	getAccount,
	getUser,
	cacheUser,
	getToken,
	cacheToken,
	verifyCacheForCampaignLoad
}