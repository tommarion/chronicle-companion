// TOOLBAR FUNCTIONALITY
let playerAddHidden = null;
let locationAddHidden = null;

$( '.hover-link' ).on( 'click', function() {
	if ( $( '#content' ).hasClass( 'stuck' )  && !$( this ).hasClass( 'active' )) {
		$( '#content .info' ).hide();
		$( '.hover-link.active' ).removeClass( 'active' );
		$( '#content' ).removeClass( 'stuck' );
		$( this ).trigger( 'mouseenter' );
		$( '#content' ).addClass( 'stuck' );
		$( '.btn-character.active, .btn-location.active, .btn-note.active' ).removeClass( 'active' );
	} else {
		$( '#content' ).toggleClass( 'stuck' );
	}
	$( this ).toggleClass( 'active' );
	$( '#btn-ref.active' ).trigger( 'click' );
});
$( '.hover-link' ).on( 'mouseenter', function(){
	if ( !$( '#content' ).hasClass( 'stuck' ) ) {
		$( '#content__wrapper' ).addClass('active');
		$( '#story__wrapper' ).addClass('hidden');
		$( '#' + replaceId($( this ).html()) ).show();
		$( '#content' )[0].scrollTo({top: 0, behavior: 'smooth'});
		playerAddHidden = $( '#player_sheet_add' ).hasClass( 'hidden' );
		if ( !playerAddHidden ) {
			$( '#player_sheet_add' ).addClass( 'hidden' );
		}
		locationAddHidden = $( '#location_add' ).hasClass( 'hidden' );
		if ( !locationAddHidden ) {
			$( '#location_add' ).addClass( 'hidden' );
		}
	}
});
$( '.hover-link' ).on( 'mouseleave', function(){
	if ( !$( this ).hasClass( 'active' ) ) {
		$( '#' + replaceId($( this ).html()) ).hide();
	}
	if ( !$( '#content').hasClass('stuck') ) {
		$( '#content__wrapper' ).removeClass('active');
		$( '#story__wrapper' ).removeClass('hidden');
		if ( !playerAddHidden && $( '#location_add' ).hasClass( 'hidden' ) ) {
			$( '#player_sheet_add' ).removeClass( 'hidden' );
		}
		playerAddHidden = null;
		if ( !locationAddHidden && $( '#player_sheet_add' ).hasClass( 'hidden' )  ) {
			$( '#location_add' ).removeClass( 'hidden' );
		}
		locationAddHidden = null;
	}
});


// I think I want to change this to tabbed functionality (maybe multiselect?) instead of toggle blocks
$( '.toolbar-item-header, .clan-compulsion-header' ).on( 'click', function() {
	$( this ).next().slideToggle();
});
$( '#character__wrapper, #character_sub_sheet' ).on( 'click', '.toolbar-item-header', function() {
	$( this ).next().slideToggle();
});

function replaceId( value ) {
	return value.toLowerCase().replaceAll( ' ', '-' ).replaceAll('<br>', '-');
}

