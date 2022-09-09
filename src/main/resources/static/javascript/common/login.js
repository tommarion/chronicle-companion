import { buildBook, buildNew, fixBookPosition } from './book.js';
import { submitAccountRegister } from './api.js';


function validateLogin( userElem, passElem, passConfirmElem ) {
	const userInput = userElem.val();
	const passInput = passElem.val();
	let passConfirmInput = null
	if ( passConfirmElem ) {
		passConfirmInput = passConfirmElem.val();
	}
	let errorString = '';
	if ( userInput === '' ) {
		userElem.addClass( 'error' );
		errorString = 'Error, must enter value for user';
	// } else if ( userInput.length < 5 ) {
	// 	userElem.addClass( 'error' );
	// 	errorString = 'Error, value for user must be longer than 5 characters';
	} else {
		userElem.removeClass( 'error' );
	}
	if ( passInput === '' ) {
		passElem.addClass( 'error' );
		if ( errorString === '' ) {
			errorString = 'Error, must enter value for password';
		} else {
			errorString += ' and password';
		}
	// } else if ( userInput.length < 5 ) {
	// 	userElem.addClass( 'error' );
	// 	if ( errorString == '' ) {
	// 		errorString = 'Error, value for user must be longer than 5 characters';
	// 	} else {
	// 		errorString += ' and value for user must be longer than 5 characters';
	// 	}
	} else if ( userInput.length > 20 ) {
		userElem.addClass( 'error' );
		if ( errorString === '' ) {
			errorString = 'Error, value for user must be shorter than 20 characters';
		} else {
			errorString += ' and value for user must be shorter than 20 characters';
		}
	} else if ( passInput.length < 5 ) {
		passElem.addClass( 'error' );
		if ( errorString === '' ) {
			errorString = 'Error, value for password must be longer than 5 characters';
		} else {
			errorString += ' and value for password must be longer than 5 characters';
		}
	} else if ( passInput.length > 20 ) {
		passElem.addClass( 'error' );
		if ( errorString === '' ) {
			errorString = 'Error, value for password must be shorter than 20 characters';
		} else {
			errorString += ' and value for password must be shorter than 20 characters';
		}
	} else {
		passElem.removeClass( 'error' );
	}
	if ( passConfirmElem && passConfirmInput !== passInput ) {
		passElem.addClass( 'error' );
		passConfirmElem.addClass( 'error' );
		if ( errorString === '' ) {
			errorString = 'Error, values for password and confirm password do not match';
		} else {
			errorString += ' and values for password and confirm password do not match';
		}
	}
	if ( errorString === '' ) {
		return true;
	} else {
		alert(errorString);
		return false;
	}
}


function logout() {
	$( '#login__wrapper' ).show();
	$( '#campaign-books__wrapper, #chronicle-books__wrapper' ).addClass( 'hidden' );
}


function processLoginError() {
	$( '#pass-login__input').val( '' ).addClass( 'error' ).focus();
}

// function addLoginClickHandlers() {
	$( '#register-toggle' ).on( 'click', function() {
		if ( $( this ).html() === 'Login' ) {
			$( '.register' ).hide();
			$( '.login' ).show();
			$( this ).html( 'Register' );
		} else {
			$( '.register' ).show();
			$( '.login' ).hide();
			$( this ).html( 'Login' );
		}
	});


	$( '#login_submit' ).on( 'click', function() {
		if ( $( '#register-toggle' ).html() === 'Login' ) {
			if ( validateLogin( $( '#user-login__input' ), $( '#pass-login__input' ), $( '#pass_confirm-login__input' ) ) ) {
				submitAccountRegister({
					username: $( '#user-login__input' ).val(),
					password: $( '#pass-login__input' ).val()
				}, handleLoginCallback, processLoginError);
			}
		}
	});
	$( '#user-login__input' ).on('keyup', function (e) {
	    if (e.key === 'Enter' || e.keyCode === 13) {
	        $( '#pass_submit' ).focus();
	    }
	});
	$( '#pass-login__input' ).on('keyup', function (e) {
	    if (e.key === 'Enter' || e.keyCode === 13) {
			alert();
	        $( '#pass_submit' ).trigger( 'click' );
	    }
	});
// }



function processCampaignData( data ) {
	console.log(data);
	window.history.replaceState( null, 'login', '?login' );
	$( '#user-login__input' ).val( '' );
	$( '#pass-login__input' ).val( '' );
	window.history.pushState({ page : 'campaign' }, 'campaigns', '?campaigns');
	$( '#login__wrapper' ).hide();
	$( '#loading__wrapper' ).addClass( 'hidden' );
	$( '#campaign-books' ).empty();
	let first = true;
	for ( let chronicle in data) {
		let bookBtn = buildBook( chronicle, data[chronicle], data[chronicle]['gameType'] );
		if ( first ) {
			$( bookBtn ).addClass( 'is-selected' );
			first = false;
		}
		$( '#campaign-books' ).append( bookBtn );
	}
	$( '#campaign-books' ).append( buildNew() );
	$( '#campaign-books__wrapper' ).removeClass( 'hidden' );
	if ( Object.keys(data).length === 0 ) {
		$( '#campaign-books-right' ).addClass( 'disabled' );
	}
	if ( data ) {
		let bookIndex = -1;
		$( '.btn-book' ).each(function(index) {
			if ( $( this ).data( 'id' ) === data['campaign_id'] ) {
				bookIndex = index;
				return false;
			}
		});
		if ( bookIndex >= 0 ) {
			let book = $( '.btn-book' )[bookIndex];
			fixBookPosition( bookIndex );
			$( book ).trigger( 'click' );
			if ( data['open'] && confirm( 'Open "' + $( book ).find( '.book-cover-overlay>div' ).html() + '"?' ) ) {
				$( book ).find( '.btn-user' ).trigger( 'click' );
			}
		}
	}
}

export { processCampaignData };

