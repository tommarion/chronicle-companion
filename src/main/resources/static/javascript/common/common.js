import { getBookIdFromURL, openBook, closeBook } from './book.js';
// import { addLoginClickHandlers, logout } from './login.js';
import { addToolbarClickHandlers, resizeOnlineStatus, diceRollsSeen } from './toolbar.js';
import { addSettingsHandlers } from './settings.js';
import { resizeCanvas } from './encounter.js';
import { handleChronicleClose } from '../vampire/chronicle.js';

export var base = getBaseURL();

function getState() {
	let loc = window.location.href;
	if ( loc.indexOf( '?' ) >= 0 ) {
		if ( loc.indexOf( '=' ) > 0 ) {
			return loc.substring( loc.indexOf( '?' ) + 1, loc.indexOf( '=' ) );
		} else {
			return loc.substring( loc.indexOf( '?' ) + 1 );
		}
	}
	return null;
}

let currentState = 'login';

export var user = '';

function setUser( updatedUser ) {
	user = updatedUser;
}

export var token = '';

function setToken( updatedToken ) {
	token = updatedToken;
}

export var account = '';

function setAccount( updatedAccount ) {
	account = updatedAccount;
}
const SETTINGS_MODE_APP = 'app';
export var settingsMode = SETTINGS_MODE_APP;
function setSettingsMode( mode ) {
	settingsMode = mode;
}

function getGameType() {
	if (window.location.href.includes('/dnd.html?')) {
		return 'dnd';
	} else if (window.location.href.includes('/vampire.html?')) {
		return 'vampire';
	}
}

export function getBaseURL() {
	console.log(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/');
	return window.location.protocol + '//' + document.domain + ':' + window.location.port + '/';
}

var started = false;

function toggleStarted() {
	started = !started;
}

export var tagReference = [];

function setTagReference( reference ) {
	tagReference = reference;
}

export var noteReference = {};

function setNoteReference( reference ) {
	noteReference = reference;
}

export var admin = false;
function setAdmin( isAdmin ) {
	admin = isAdmin;
}

window.addEventListener( 'popstate', event => {
	let state = getState();
	switch ( state ) {
		case null:
			break;
		case 'login':
			if (confirm("Are you sure you want to log out?")) {
				// logout();
				window.history.replaceState( { page : 'login' }, 'login', '?login' );
				window.history.pushState( { page : 'login' }, 'login', '?login' );
			} else {
				window.history.forward();
			}
			break;
		case 'chronicle_id':
		case 'campaign_id':
			if ( $( '.btn-book.opened' ).length == 0 ) {
				const bookId = getBookIdFromURL();
				$( '.btn-book' ).each( function(){
					if ( $( this ).data( 'id' ) == bookId ) {
						openBook( $( this ) );
					}
				});
			}
			$( '#password_entry__wrapper' ).addClass( 'hidden' );
			break;
		case 'chronicles':
			if ( started ) {
				handleChronicleClose();
				toggleStarted();
				closeBook( $( '.btn-book.opened' ), false ) 
			} else {
				if ( $( '.btn-book.opened' ).length > 0 ) {
					$( '.btn-book.opened' ).each(function(){ 
						closeBook( $( this ), false ) 
					});
				}
			}
			break;
		default:
	}

});

$( '#story__wrapper, #container' ).addClass( navigator.platform );

$( window ).on( 'resize', function() {
	resizeOnlineStatus();
	if ( $( '#btn-roll' ).hasClass( 'default' ) && $( window ).width() > 1099 )  {
		diceRollsSeen();
		$( '#btn-roll' ).attr( 'badge', null ).removeClass( 'badge' );
	}
	resizeCanvas();
});

addToolbarClickHandlers();
// addLoginClickHandlers();
addSettingsHandlers();

export { 
	setUser,
	setSettingsMode,
	getGameType,
	setToken,
	setAccount,
	toggleStarted,
	getState,
	// getAccount,
	setTagReference,
	setNoteReference,
	setAdmin
};

