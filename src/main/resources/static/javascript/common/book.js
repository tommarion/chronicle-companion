import { base, user, setUser, getGameType } from './common.js';
import { cacheUser } from './cache.js';
import { createChronicle, createCampaign, createAdventure } from './api.js';
import { handleChronicleLoad } from '../vampire/chronicle.js';

function getBookIdFromURL() {
	const loc = window.location.href;
	if (loc.includes('campaign_id')) {
		return loc.substring(loc.indexOf('campaign_id') + 12);
	} else if (loc.includes('chronicle_id')) {
		return loc.substring(loc.indexOf('chronicle_id') + 13);
	}
}

function buildNew() {
	let bookWrapper = document.createElement( 'div' );
	let books = [];
	books.push(buildBookDiv( 'New Campaign', {'enabled':true, 'character': null }, 'fate' ));
	books.push(buildBookDiv( 'New Adventure', {'enabled':true, 'character': null }, '7th' ));
	books.push(buildBookDiv( 'New Chronicle', {'enabled':true, 'character': null }, 'vampire' ));
	books.push(buildBookDiv( 'New Campaign', {'enabled':true, 'character': null }, 'dnd' ));

	for ( let book in books ) {
		$( books[book] ).on( 'click', function() {
			fixStyling();
			if ( $( this ).hasClass( 'opened' ) ) {
				$( this ).find( 'textarea' ).focus();
			} else {
				$( this ).find( 'textarea' )[0].value = '';
				$( this ).find( 'textarea' ).blur();
			}
		});
		$( bookWrapper ).append( books[book] );
	}

	$( bookWrapper ).addClass( 'btn-book__wrapper add' );

	setTimeout(function() {
		fixStyling()
	}, 250);

	return bookWrapper;
}

function addHoverHandler( book ) {
	$( '.btn-book.hover' ).removeClass( 'hover' );
	book.addClass( 'hover' );
	fixStyling( true );
}

function fixStyling( hover ) {
	const bookSpacing = 40;
	let openBook = $( '.btn-book__wrapper.add>.btn-book.opened' ).index();
	if ( hover ) {
		openBook = $( '.btn-book__wrapper.add>.btn-book.hover' ).index();
	}
	let reverseIndex = ( $( '.btn-book__wrapper.add>.btn-book' ).length - 1 ) - openBook;
	let openOffset = openBook >= 0 ? reverseIndex * bookSpacing : 0;
	let startingOffset = {
		top 	: openOffset,
		left 	: (openOffset * -1) - 70
	}

	$($( '.btn-book__wrapper.add>.btn-book' ).get().reverse()).each(function(index) {
		if ( index == reverseIndex ) {
			let leftOffset = '140';
			if ( hover ) {
				leftOffset = '70';
			}
			$( this ).css({
				'top'			: 0,
				'margin-left'	: 'calc( 50% - ' + leftOffset + 'px )'
			});
		} else {
			$( this ).css({
				'top'			: startingOffset.top - (bookSpacing * index),
				'margin-left'	: 'calc( 50% + ' + (startingOffset.left + (bookSpacing * index)) + 'px )'
			});
		}
		index--;
	});
	
}

function buildBook( name, data, type ) {
	let bookWrapper = document.createElement( 'div' );
	$( bookWrapper ).addClass( 'btn-book__wrapper' ).append( buildBookDiv( name, data, type ) );
	return bookWrapper;
}


function buildBookDiv( name, data, type ) {
	let book = document.createElement( 'div' );
	let bookPage = document.createElement( 'div' );
	let bookCoverWrapper = document.createElement( 'div' );
	let bookCover = document.createElement( 'div' );
	let bookCoverOverlay = document.createElement( 'div' );
	let bookTitle = document.createElement( 'div' );
	let bookCoverBack = document.createElement( 'div' );
	let bookType = '';
	if ( type == 'vampire' ) {
		bookType = 'chronicle';
	} else if ( type == 'dnd' ) {
		bookType = 'campaign';
	} else if ( type == '7th' ) {
		bookType = 'adventure';
	} else if ( type == 'fate' ) {
		bookType = type;
	}
	if ( !data.enabled ) {
		$( book ).addClass( 'disabled' );
	}
	$( bookPage ).addClass( 'book-page' );

	if ( data.character ) {
		for ( let character in data.character ) {
			let characterBtn = document.createElement( 'div' );
			let characterBtnName = document.createElement( 'span' );
			$( characterBtnName ).html( character );
			$( characterBtn )
				.addClass( 'btn btn-user' )
				.html( 'Play as: ' )
				.append( document.createElement( 'br' ))
				.append( characterBtnName )
				.data( 'id', data.character[character] )
				.on('click', function( e ) {
					bookUserBtnClickHandler( e, $( this ), bookType );
				});
			$( bookPage ).append( characterBtn );
		}
	} else {
		let chronicleInput = document.createElement( 'textarea' );
		$( chronicleInput ).on( 'click', function( e ) { e.stopPropagation() });
		$( chronicleInput ).addClass( bookType + '-name' );
		let characterBtn = document.createElement( 'div' );
		let createChronicleBtn = document.createElement( 'span' );
		$( createChronicleBtn ).html( 'Create' );
		$( characterBtn )
			.addClass( 'btn btn-create' )
			.append( createChronicleBtn )
			.on('click', function( e ) {
				bookCreateBtnClickHandler( e, $( this ), bookType );
			});
		$( bookPage ).append( chronicleInput ).append( characterBtn );
	}

	$( bookTitle ).html( name );
	$( bookCover ).addClass( 'book-cover' );
	$( bookCoverOverlay ).addClass( 'book-cover-overlay' ).append( bookTitle );
	$( bookCoverBack ).addClass( 'book-cover-back' ).on( 'click', function( e ) {
		bookBtnCoverClickHandler( e, $( this ) );
	});
	$( bookCoverWrapper ).addClass( 'book-cover__wrapper' )
		.append( bookCover )
		.append( bookCoverOverlay )
		.append( bookCoverBack );
	$( book ).addClass( 'btn-book btn-' + bookType )
		.data( 'id', data.id )
		.data( 'game_type', type )
		.append( bookPage ).append( bookCoverWrapper )
		.on('click', function( e ){
			bookBtnClickHandler( e, $( this ), bookType );
		})
		.on( 'mouseenter', function( e ) {
			$( '#tooltip' ).html( name ).css({
				'left': e.clientX,
				'top': e.clientY + 25,
			}).removeClass( 'hidden' );
		})
		.on( 'mousemove', function( e ) {
			$( '#tooltip' ).css({
				'left': e.clientX,
				'top': e.clientY + 25,
			});
		})
		.on( 'mouseleave', function( e ) {
			$( '#tooltip' ).html( '' ).addClass( 'hidden' );
		});
	return book;
}


function bookBtnClickHandler( e, btnElem, type ) {
	e.stopPropagation();
	if ( !btnElem.hasClass( 'disabled' ) ) {
		if ( btnElem.hasClass( 'opened' ) ) {
			closeBook( $( btnElem ), true );
		} else {
			if ( btnElem.data( 'id' ) ) {
				window.history.pushState( { page : type } , type, '?' + type + '_id=' + btnElem.data( 'id' ) );
			} else {
				window.history.pushState( { page : type } , type, '?new-' + type );
			}
			openBook( btnElem );
		}
	}
}

function openBook( bookElem ) {
	if ( $( '.btn-book.opened' ).length > 0 ) {
		closeBook( $( '.btn-book.opened' ), true );
	}
	bookElem.addClass( 'opened' );
	setTimeout(function(){
		bookElem.find( '.book-page>div' ).fadeIn(250);
	}.bind( bookElem ), 500);
}

function closeBook( bookElem, goBack ) {
	bookElem.removeClass( 'opened' );
	bookElem.find( '.book-page>div' ).hide();
	if ( goBack ) {
		window.history.back();
	}
}

function bookBtnCoverClickHandler( e, bookElem ) {
	e.stopPropagation();
	if ( bookElem.parent().parent().hasClass( 'opened' ) ){
		closeBook( bookElem.parent().parent(), true );
	}
}

function bookUserBtnClickHandler( e, bookElem, type ) {
	e.stopPropagation();
	let value = bookElem.find( 'span' ).html();
	// $( '#users__wrapper' ).addClass( 'hidden' );
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	cacheUser( value );
	$( '#loading__wrapper' ).addClass( 'hidden' );
	if ( type == 'chronicle' ) { 
		// $( '#chronicle-books__wrapper' ).addClass( 'hidden' );
		let chronicleId = bookElem.parent().parent().data( 'id' );
		window.location.href = base + 'vampire.html?chronicle_id=' + chronicleId;
	} else if ( type == 'campaign' ) {
		// $( '#campaign-books__wrapper' ).addClass( 'hidden' );
		let campaignId = bookElem.parent().parent().data( 'id' );
		window.location.href = base + 'dnd.html?campaign_id=' + campaignId;
	} else if ( type == 'adventure' ) {
		// $( '#adventure-books__wrapper' ).addClass( 'hidden' );
		let adventureId = bookElem.parent().parent().data( 'id' );
		window.location.href = base + '7th-sea.html?adventure_id=' + adventureId;
	} else {
		alert( 'This game type is not yet supported or there is an error!' );
	}
}

function bookCreateBtnClickHandler( e, bookElem, type ) {
	e.stopPropagation();
	if ( type == 'chronicle' ) {
		// $( '#chronicle-books__wrapper' ).addClass( 'hidden' );
		$( '#loading__wrapper' ).removeClass( 'hidden' );
		createChronicle( bookElem.parent().find( '.chronicle-name' ).val() );
	} else if ( type == 'campaign' ) {
		// $( '#campaign-books__wrapper' ).addClass( 'hidden' );
		$( '#loading__wrapper' ).removeClass( 'hidden' );
		createCampaign( bookElem.parent().find( '.campaign-name' ).val() );
	} else if ( type == 'adventure' ) {
		// $( '#adventure-books__wrapper' ).addClass( 'hidden' );
		$( '#loading__wrapper' ).removeClass( 'hidden' );
		createAdventure( bookElem.parent().find( '.adventure-name' ).val() );
	}
}

$( '.btn-book-pos' ).on( 'click', function() {
	if ( !$( this ).hasClass( 'disabled' ) ) {
		let currentPos = 0;
		if ( $( '#campaign-books' ).data( 'pos' ) ) {
			currentPos = parseInt( $( '#campaign-books' ).data( 'pos' ) );
		}
		if ( $( this ).attr( 'id' ) == 'campaign-books-right' ) {
			currentPos++;
		} else {
			currentPos--;
		}
		fixBookPosition( currentPos );
		if ( $( '.btn-book.opened' ).length > 0 ) {
			closeBook( $( '.btn-book.opened' ), true );
		}
		fixStyling();
	}
});

function fixBookPosition( currentPos ) {
	$( '#campaign-books' ).data( 'pos', currentPos );
	if ( currentPos == 0 ) {
		$( '#campaign-books-left' ).addClass( 'disabled' );
	} else {
		$( '#campaign-books-left' ).removeClass( 'disabled' );
	}
	if ( currentPos == $( '.btn-book__wrapper' ).length - 1 ) {
		$( '#campaign-books-right' ).addClass( 'disabled' );
	} else {
		$( '#campaign-books-right' ).removeClass( 'disabled' );
	}
	$( '#campaign-books' ).css( 'left', (-50 * currentPos) + 'vw' );

	$( '.btn-book__wrapper.is-selected' ).removeClass( 'is-selected' );
	$( $( '.btn-book__wrapper' )[currentPos] ).addClass( 'is-selected' );
}

if ( $( '#campaign-books>*' ).length == 1 ) {
	$( '#campaign-books-right' ).addClass( 'disabled' );
}

export {
	getBookIdFromURL,
	buildBook,
	openBook,
	closeBook,
	buildNew,
	fixBookPosition
};


