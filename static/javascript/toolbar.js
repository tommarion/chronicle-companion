// TOOLBAR FUNCTIONALITY

$( '.hover-link' ).on( 'click', function() {
	if ( $( '#content' ).hasClass( 'stuck' )  && !$( this ).hasClass( 'active' )) {
		$( '#content .info' ).hide();
		$( '.hover-link.active' ).removeClass( 'active' );
		$( '#content' ).removeClass( 'stuck' );
		$( this ).trigger( 'mouseenter' );
		$( '#content' ).addClass( 'stuck' );
	} else {
		$( '#content' ).toggleClass( 'stuck' );
	}
	$( this ).toggleClass( 'active' );
});
$( '.hover-link' ).on( 'mouseenter', function(){
	if ( !$( '#content' ).hasClass( 'stuck' ) ) {
		$( '#content__wrapper' ).addClass('active');
		$( '#' + replaceId($( this ).html()) ).show();
	}
});
$( '.hover-link' ).on( 'mouseleave', function(){
	if ( !$( this ).hasClass( 'active' ) ) {
		$( '#' + replaceId($( this ).html()) ).hide();
	}
	if ( !$( '#content').hasClass('stuck') ) {
		$( '#content__wrapper' ).removeClass('active');
	}
});

$( '.toolbar-item-header, .clan-compulsion-header' ).on( 'click', function() {
	$( this ).next().slideToggle();
});

// SHOW / HIDE TOOLBAR

$( '#btn__ref-show-hide__wrapper' ).on( 'click', function() {
	if ( $( '#btn__ref-show-hide' ).hasClass('active') ) {
		$( '#btn__ref-show-hide' ).removeClass( 'active' );
		$( '#toolbar__wrapper' ).addClass('slideLeft');
		$( '#content__wrapper' ).addClass('hidden');
	} else {
		$( '#btn__ref-show-hide' ).addClass( 'active' );
		$( '#toolbar__wrapper' ).removeClass('slideLeft');
		$( '#content__wrapper' ).removeClass('hidden');
	}
});

$( '#btn__show-hide-character' ).on( 'click', function(){
	if ( $( this ).hasClass( 'active' ) ) {
		$( this ).removeClass( 'active' );
		$( '#character__wrapper' ).removeClass( 'active' );
		$( '#story-text__wrapper' ).fadeIn();
		$( '#story-toolbar' ).fadeIn();
	} else {
		$( this ).addClass( 'active' );
		$( '#character__wrapper' ).addClass( 'active' );
		$( '#story-text__wrapper' ).fadeOut();
		$( '#story-toolbar' ).fadeOut();
	}
});

$( '#story-toolbar' ).on( 'click', '.btn', function(){
	if ( !$( this ).hasClass( 'active' ) ) {
		$( '#story-toolbar .btn.active' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
		if ( $( this ).hasClass( 'characters' ) ) {
			let type = $( this ).html().toLowerCase();
			processCharacterList( type.substring(0, type.length-1) );
		} else if ( $( this ).hasClass( 'locations' ) ) {
			processLocations();
		}
		if (!$( 'story-toolbar-overlay' ).hasClass('active' ) ) {
			$( '#story-toolbar-overlay' ).addClass( 'active' );
		}
		$( '#story-text__wrapper' ).addClass( 'min' );
	} else {
		$( this ).removeClass( 'active' );
		$( '#story-toolbar-overlay' ).removeClass( 'active' );
		$( '#story-text__wrapper' ).removeClass( 'min' );
	}
});

$( '#chapters__wrapper' ).on( 'click', '.chapter', function() {
	if ( !$( this ).hasClass( 'active' ) ) {
		$( '.chapter.active' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
		processChapter( $( this ).index() );
	}
});

function storyToolbarClick() {
	$( '#character__wrapper' ).addClass( 'active' );
	$( '#story-toolbar-overlay' ).removeClass( 'active' );
	$( '#story-text__wrapper' ).removeClass( 'min' );
	$( '#btn__show-hide-character' ).removeClass( 'hidden' );
	$( '#btn__show-hide-character' ).addClass( 'active' );
	$( '#notes.active, .characters.active, .locations.active' ).removeClass( 'active' );
}

function replaceId( value ) {
	return value.toLowerCase().replaceAll( ' ', '-' );
}