function promptForUser() {
	for (character in chronicleSettings.characters.pc) {
		$( '#users__wrapper' ).append( '<div class="btn btn-user">' + character + '</div>');
	}
	$( '#users__wrapper' ).append( '<div class="btn btn-user btn-storyteller">' + STORYTELLER + '</div>' );
	$( '#users__wrapper' ).removeClass( 'hidden' );
}

$( '#users__wrapper' ).on( 'click', '.btn-user', function() {
	let value =$( this ).html();
	$( '#users__wrapper' ).remove();
	if (value == STORYTELLER) {
		$( '#password_entry__wrapper' ).removeClass( 'hidden' );
		$( '#user_password' ).focus();
	} else {
		user = value;
		$( '#password_entry__wrapper' ).remove();
		$( '#btn_raise-hand' ).removeClass( 'hidden' );
		$( '#btn_roll-dice__wrapper' ).removeClass( 'hidden' );
		processChronicle( chronicleSettings );
	}
});
$( '#pass_submit' ).on( 'click', function() {
	if ($( '#user_password' ).val() == 'schrecknet' ) {
		user = STORYTELLER;
		$( '#btn_roll-dice__wrapper' ).removeClass( 'hidden' );
		processChronicle( chronicleSettings );
		$( '#password_entry__wrapper' ).remove();
	} else {
		alert( "Password is incorrect!" );
		$( '#user_password' ).val('');
	}
});

$( '#user_password' ).on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $( '#pass_submit' ).trigger( 'click' );
    }
});

function processChronicle( chronicleData ) {
    $( '#chronicles__wrapper' ).hide();
	$( '#story-toolbar' ).removeClass( 'hidden' );

    if ( user == 'Storyteller' ) {
	    let chapterStr = '';
		for (chapter in chronicleData.chapters) {
			let active = "";
			chapterStr += '<li class="chapter">' + (parseInt(chapter) + 1) + '</li>';
		}
		$( '#chapters__wrapper' ).html(chapterStr);

		$( $( '.chapter' )[0] ).trigger( 'click' );
	} else {
		$( '#story-toolbar' ).hide();
		$( '#character__wrapper' ).addClass( 'active' );
		processCharacterData( chronicleSettings.characters.pc[user].id );
	}
	processHandRaises();
}

function processChapter( index ) {
	let chapter = chronicleSettings.chapters[index];
	let chapterText = '<div class="header">Chapter ' + (index + 1) + ' ~ ' + chapter.name + '</div><br/>';
	
	for (scene in chapter.scenes) {
		chapterText += '<div class="subheader">Scene ' + (parseInt(scene) + 1) + ' ~ ' + chapter.scenes[scene].name + '</div>' + 
		'<p>' + chapter.scenes[scene].story + '</p><br/>';
	}
	
	$( '#story-text' ).html(chapterText);
	$( '#story-text' ).show();
}

// LOAD CHRONICLE FILE, CHARACTERS FILE, & LOCATIONS FROM DB

$( '#chronicles__wrapper' ).on( 'click', '.btn-chronicle', function() {
	$( '#loading__wrapper' ).removeClass( 'hidden' );
	chronicleId = $( this ).data( 'id' );
	let loc = window.location.href;
	let append = "?chronicle_id=" + chronicleId;
	loadChronicleSettings( chronicleId );
	window.history.pushState( {} , '', append );
});
