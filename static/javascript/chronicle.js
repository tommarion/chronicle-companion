function promptForUser() {
	$( '#users__wrapper' ).html( '<div class="close_users__wrapper"><div class="close_users btn">Back</div></div>' );
	for (character in chronicleSettings.characters.pc) {
		$( '#users__wrapper' ).append( '<div class="btn btn-user">' + character + '</div>');
	}
	$( '#users__wrapper' ).append( '<div class="btn btn-user btn-storyteller">' + STORYTELLER + '</div>' );
	$( '#users__wrapper' ).removeClass( 'hidden' );
}

$( '#users__wrapper' ).on( 'click', '.btn-user', function() {
	let value = $( this ).html();
	$( '#users__wrapper' ).addClass( 'hidden' );
	if ( value == STORYTELLER ) {
		if ( authenticated ) {
			handleChronicleForStoryteller();
		} else {
			$( '#password_entry__wrapper' ).removeClass( 'hidden' );
			$( '#user_password' ).focus();
		}
	} else {
		user = value;
		$( '#btn_raise-hand' ).removeClass( 'hidden' );
		showDiceDivs();
		processChronicle( chronicleSettings );
	}
});

$( '#pass_cancel' ).on( 'click', function() {
	$( '#password_entry__wrapper' ).addClass( 'hidden' );
	$( '#users__wrapper' ).addClass( 'hidden' );
});

$( '#pass_submit' ).on( 'click', function() {
	if ($( '#user_password' ).val() == 'schrecknet' ) {
		user = STORYTELLER;
		authenticated = true;
		if ( $( '#password_entry__wrapper' ).hasClass( 'settings' ) ) {
			$( '#password_entry__wrapper' ).removeClass( 'settings' );
			$( '#value-modifier__background' ).removeClass( 'hidden' );
			$( '#app_settings__wrapper' ).removeClass( 'hidden' );
		} else {
			handleChronicleForStoryteller();
		}
		$( '#password_entry__wrapper' ).addClass( 'hidden' );
	} else {
		alert( "Password is incorrect!" );
		$( '#user_password' ).val('');
	}
});

function handleChronicleForStoryteller() {
	showDiceDivs();
	processChronicle( chronicleSettings );
}

function showDiceDivs() {
	$( '#btn_roll-dice__wrapper' ).removeClass( 'hidden' );
	$( '#dice-roll__wrapper' ).removeClass( 'hidden' );
	$( '#roll-type__dropdown' ).removeClass( 'hidden' );
}
$( '#users__wrapper' ).on( 'click', '.close_users', function() {
	$( '#users__wrapper' ).addClass( 'hidden' );
});

$( '#user_password' ).on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $( '#pass_submit' ).trigger( 'click' );
    }
});

function processChronicle( chronicleData ) {
	settingsMode = SETTINGS_MODE_CHRONICLE;
    $( '#chronicles__wrapper' ).hide();
	$( '#story-toolbar' ).removeClass( 'hidden' );
	if ( chronicleSettings.embed_link ) {
		$( '#btn-relationship_map' ).removeClass( 'hidden' );
		$( '#relationship_map' ).attr( 'src', chronicleSettings.embed_link );
	}

    if ( user == 'Storyteller' ) {
		if (chronicleData.chapters.length == 0) {
			$( '#story-text__none__wrapper' ).removeClass( 'hidden' );
		} else {
		    let chapterStr = '';
			for (chapter in chronicleData.chapters) {
				let active = "";
				chapterStr += '<li class="chapter">' + (parseInt(chapter) + 1) + '</li>';
			}
			$( '#chapters__wrapper' ).html(chapterStr);

			$( $( '.chapter' )[0] ).trigger( 'click' );
		}
	} else {
    	$( '#btn-chronicle__settings' ).addClass( 'hidden' );
		$( '#story-toolbar' ).hide();
		$( '#character__wrapper' ).addClass( 'active' );
		processCharacterData( chronicleSettings.characters.pc[user].id );
	}
	processHandRaises();
	loadToolbarData();
}

function processChapter( index ) {
	let chapter = chronicleSettings.chapters[index];
	let chapterText = '<div class="header">Chapter ' + (index + 1) + ' ~ ' + chapter.name + '</div><br/>';
	
	for (scene in chapter.scenes) {
		chapterText += '<div class="scene-view__wrapper">';
		chapterText += '<div class="subheader">Scene ' + (parseInt(scene) + 1) + ' ~ ' + chapter.scenes[scene].name + '</div>' + 
		chapter.scenes[scene].story + '</div>';
	}
	
	$( '#story-text' ).html(chapterText);
	$( '#story-text' ).show();
}

function loadToolbarData() {
	$( '#pc__btns__wrapper' ).html( processCharacterList( 'pc' ));
	$( '#npc__btns__wrapper' ).html( processCharacterList( 'npc' ));
	$( '#locations__btns__wrapper' ).html( processLocations() );
}

// LOAD CHRONICLE FILE, CHARACTERS FILE, & LOCATIONS FROM DB

$( '#chronicles__wrapper' ).on( 'click', '.btn-chronicle', function() {
	if ( !$( this ).hasClass( 'disabled' ) ) {
		$( '#loading__wrapper' ).removeClass( 'hidden' );
		chronicleId = $( this ).data( 'id' );
		let loc = window.location.href;
		let append = "?chronicle_id=" + chronicleId;
		loadChronicleSettings( chronicleId );
		window.history.pushState( {} , '', append );
	}
});
