import { upsertNote, renameSession } from './api.js';
import { tagReference, noteReference } from './common.js';
import { getAccount } from './cache.js';
import { formatDate } from './settings.js';

let sessionNameSave = null;
let noteNameSave = null;
let noteText = '';

const weirdBlock = 'span[style="background-color: rgba(30, 144, 255, 0.4)"]';

function buildSessionPage( sessionData, defaultVal ) {
	console.log(sessionData);
	$( '#story-text__wrapper' ).empty();
	let sessionWrapper = document.createElement( 'div' );
	let sessionName = document.createElement( 'input' );
	if ( sessionData.session.name != null ) {
		$( sessionName ).html( sessionData.session.name );
	}
	$( sessionName ).prop( 'placeholder', defaultVal )
		.addClass( 'session-name' )
		.on( 'focus', function() {
			sessionNameSave = $( this ).val()
		})
		.on( 'blur', function() {
			if ( $( this ).val() != sessionNameSave && confirm( 'Are you sure you want to rename this session?' ) ) {
				renameSession( $( '.session-notes__wrapper' ).data( 'id' ), $( this ).val() );
			} else {
				$( this ).val( sessionNameSave );
				sessionNameSave = null;
			}
		});
	$( sessionWrapper ).append( sessionName );
	let sessionDateWrapper = document.createElement( 'span' );
	$( sessionDateWrapper ).append( 'Started: ' )
		.append( formatDate(sessionData.session.date) )
		.addClass( 'sub-text' )
		.addClass( 'session-date__wrapper' );
	let sessionNotesWrapper = document.createElement( 'div' );
	let sessionNotesList = document.createElement( 'ul' );

	let filters = getFilterDefault();

	if ( sessionData.notes.length == 0 ) {
		let noteListItem = document.createElement( 'li' );
		let noteTextElem = document.createElement( 'span' )
		$( noteTextElem ).addClass( 'default-note-text note-text' )
			.attr( 'role', 'textbox' )
			.prop( 'contenteditable', true )
			.on( 'blur', function() {
				saveSessionNote( $( this ), null );
			}).on( 'keyup', function() {
				$( this ).find( '.tag-text' ).each(function() {
					processTagSpan( $( this ) );
				});
				removeWeirdBlock( $( this ).find( 'span:not(.tag-text)' ) );
				addTagSpan( $( this ) );
			});
		$( noteListItem ).append( noteTextElem );
		$( sessionNotesList ).append( noteListItem );
	} else {
		for ( let index in sessionData.notes ) {
			$( sessionNotesList ).append( buildNoteSpan( sessionData.notes[index].note, sessionData.notes[index].id, sessionData.notes[index].account_id ) );
		}
		$( sessionNotesList ).find( 'li' ).each( function() {
			let author = $( this ).find( '.note-character' );
			if ( author.length > 0 ) {
				if ( !filters.authors.includes( author.html() ) ) {
					filters.authors.push( author.html() );
				}
			}
			$( this ).find( '.tag-text' ).each( function() {
				if ( $( this ).hasClass( 'tag-type_location' ) ) {
					if ( !filters.locations.includes( $( this ).html() ) ) {
						filters.locations.push( $( this ).html() );
					}
				} else if ( $( this ).hasClass( 'tag-type_character') ) {
					if ( !filters.characters.includes( $( this ).html() ) ) {
						filters.characters.push( $( this ).html() );
					}
				} else {
					filters.tags.push( $( this ).html() );
				}
			})
		});
	}
	$( sessionNotesWrapper ).append( sessionNotesList )
		.data( 'id', sessionData.session.id )
		.addClass( 'session-notes__wrapper' );
	let addNoteWrapper = document.createElement( 'div' );

	let addNote = document.createElement( 'div' );
	$( addNote ).addClass( 'btn add-note__btn' ).html( 'Add' );
	$( addNoteWrapper )
		.append( buildFilterWrapper( filters, false ) )
		.append( addNote );
	$( '#story-text__wrapper' )
		.append( sessionWrapper )
		.append( sessionDateWrapper )
		.append( sessionNotesWrapper )
		.append( addNoteWrapper );
}

function buildFilterWrapper( filters, activeFilterBtns ) {
	let filterBtnWrapper = document.createElement( 'div' );
	let filterBtn = document.createElement( 'div' );
	$( filterBtn ).addClass( 'btn btn-filter' )
	$( filterBtnWrapper ).addClass( 'btn-filter__wrapper' ).append( filterBtn );

	if ( filters.authors.length === 0 && filters.characters.length === 0 &&
			filters.locations.length === 0 && filters.tags.length === 0 ) {
		$( filterBtn ).addClass( 'disabled' );
		let noFilterCategories = document.createElement( 'div' );
		let noTags = document.createElement( 'div' );
		$( noTags ).addClass( 'no-tags' ).html( 'No Tags to Apply!' );
		$( noFilterCategories ).html( noTags );
		$( filterBtnWrapper ).append( noFilterCategories );
	} else {
		let filterDropdown = document.createElement( 'div' );
		let filterSelect = document.createElement( 'select' );
		let defaultFilterOption = document.createElement( 'option' );
		$( defaultFilterOption ).prop( 'selected', true ).prop( 'disabled', true ).html( 'Filter Option' );

		let authorsOptgroup = document.createElement( 'optgroup' );
		$( authorsOptgroup ).attr( 'label', 'Written By:' );
		let option = document.createElement( 'option' );
		$( option ).html( "Me" );
		$( authorsOptgroup ).append( option );
		for ( let i=0; i<filters.authors.length; i++ ) {
			let option = document.createElement( 'option' );
			$( option ).html( filters.authors[i] );
			$( authorsOptgroup ).append( option );
		}

		let charactersOptgroup = document.createElement( 'optgroup' );
		$( charactersOptgroup ).attr( 'label', 'CharacterContent Tags:' );
		for ( let i=0; i<filters.characters.length; i++ ) {
			let option = document.createElement( 'option' );
			$( option ).html( filters.characters[i] );
			$( charactersOptgroup ).append( option );
		}

		let locationsOptgroup = document.createElement( 'optgroup' );
		$( locationsOptgroup ).attr( 'label', 'Location Tags:' );
		for ( let i=0; i<filters.locations.length; i++ ) {
			let option = document.createElement( 'option' );
			$( option ).html( filters.locations[i] );
			$( locationsOptgroup ).append( option );
		}

		let tagsOptgroup = document.createElement( 'optgroup' );
		$( tagsOptgroup ).attr( 'label', 'Hashtags:' );
		for ( let i=0; i<filters.tags.length; i++ ) {
			let option = document.createElement( 'option' );
			$( option ).html( filters.tags[i] );
			$( tagsOptgroup ).append( option );
		}

		$( filterSelect ).append( defaultFilterOption )
			.append( authorsOptgroup )
			.append( charactersOptgroup )
			.append( locationsOptgroup )
			.append( tagsOptgroup );
		$( filterDropdown ).attr( 'id', 'filter-dropdown' ).append( filterSelect );
		$( filterBtnWrapper ).append( filterDropdown );
		$( filterBtn ).on( 'click', function() {
				if ( !$( this ).hasClass( 'disabled' ) ) {
					let selectedOption = $( '#filter-dropdown>select option:selected' );
					if ( $( '#filter-dropdown>select' ).val() != null ) {
						createFilterBtn( $( '#filter-dropdown>select' ).val(), selectedOption.parent().attr( 'label' ), activeFilterBtns );
						selectedOption.attr( 'disabled', true );
						$( '#filter-dropdown>select' ).val( 'Filter Option' );
					}
				}
			});
	}

	return filterBtnWrapper;
}
function getFilterDefault() {
	return {
		'authors'		: [],
		'characters' 	: [],
		'locations'		: [],
		'tags' 			: []
	};
}

function buildNoteSpan( note, id, accountId ) {
	let sessionNoteWrapper = document.createElement( 'li' );
	let sessionNote = document.createElement( 'span' );
	$( sessionNote ).html( note )
		.addClass( 'note-text' );

	if ( accountId == getAccount() ) {
		$( sessionNote ).attr( 'role', 'textbox' )
			.prop( 'contenteditable', true )
			.on( 'focus', function(e) {
				e.stopPropagation();
				noteText = $( this ).html();
				$( '#tooltip' ).addClass( 'hidden' );
				setTimeout( function(){
					$( '.note-text:focus' ).addClass( 'focused' );
				}, 200);
			}).on( 'keyup', function() {
				$( this ).find( '.tag-text' ).each(function() {
					processTagSpan( $( this ) );
				});
				removeWeirdBlock( $( this ).find( 'span:not(.tag-text)' ) );
				addTagSpan( $( this ) );
			});
	} else {
		let noteCharacter = document.createElement( 'span' );
		$( noteCharacter ).html( noteReference[accountId] ).addClass( 'note-character' );
		$( sessionNoteWrapper ).addClass( 'no-edit' )
			.prepend( noteCharacter );
	}

	if ( id == null ) {
		$( sessionNote ).on( 'blur', function() {
			saveSessionNote( $( this ), noteText );
			$( this ).removeClass( 'focused' );
		});
	} else {
		$( sessionNote ).data( 'id', id )
			.on( 'blur', function() {
				updateNote( $( this ), noteText );
				$( this ).removeClass( 'focused' );
			});
	}
	$( sessionNoteWrapper ).append( sessionNote )
		.addClass( 'session-note__wrapper' )
		.on( 'click', function() {
			if ( !$( $( this ).find( 'span' )[0] ).is( ':focus' ) ) {
				$( this ).find( 'span' ).trigger( 'focus' );
				let childNodes = $( this ).find( 'span' )[0].childNodes;
				setCursorPosition( childNodes[childNodes.length-1], childNodes[childNodes.length-1].length );
			}
		});
	if ( accountId != null ) {
		$( sessionNoteWrapper ).data( 'accountId', accountId );
	}
	return sessionNoteWrapper;
}

function processTagSpan( spanElem ) {
	let container = spanElem.parent();
	if ( spanElem.html().substring( spanElem.html().length-6 ) == '&nbsp;' || spanElem.html().substring( spanElem.html().length-4 ) == '<br>' ) {
		$( '#tooltip' ).empty().addClass( 'hidden' );
		let childNodes = container[0].childNodes;

		if ( spanElem.html().substring( spanElem.html().length-6 ) == '&nbsp;' ) {
			spanElem.html( spanElem.html().substring( 0, spanElem.html().length-6 ) );
			container.html( container.html() + '&nbsp;' );
		} else if (spanElem.html().substring( spanElem.html().length-4 == '<br>' ) ) {
			spanElem.html( spanElem.html().substring( 0, spanElem.html().length-4 ) );
			for ( let node in childNodes ) {
				if ( childNodes[node].innerHTML == spanElem.html() ) {
					childNodes[node].parentNode.insertBefore( document.createElement( 'br' ), childNodes[node].nextSibling );
					setCursorPosition( childNodes[childNodes.length-1], childNodes[childNodes.length-1].length );
				}
			}
		}
		// container.focus();
		setCursorPosition( childNodes[childNodes.length-1], childNodes[childNodes.length-1].length );
		if ( spanElem.html().charAt(0) == '@' ) {
			processTagSpanReferences( spanElem, container[0] )
		}
	} else {	
		let tagRef = searchForTagReference( spanElem.html().substring(1) );
		if ( spanElem.html().charAt(0) == '@' ) {
			$( '#tooltip' ).empty();
			if ( tagRef.length > 0 ) {
				for ( let tag in tagRef ) {
					let refDiv = document.createElement( 'div' );
					$( refDiv ).html( tagRef[tag] );
					$( '#tooltip' ).append( refDiv );
				}
			} else {
				$( '#tooltip' ).html( 'No matching taggables!')
			}
			$( '#tooltip' ).css({
				'left': spanElem.offset().left,
				'top': spanElem.offset().top + 25,
			}).removeClass( 'hidden' );
		}
	}
}

function processTagSpanReferences( spanElem, parentDiv ) {
	let childNodes = parentDiv.childNodes;
	let tagRef = searchForTagReference( spanElem.html().substring(1).replaceAll( '<br>', '' ).replaceAll( '_', ' ' ) );
	if ( spanElem.html().charAt(0) != '@' ) {
		return;
	}
	if ( tagRef.length == 0  ) {
		for ( let childNode in childNodes ) { 
			if ( childNodes[childNode].innerHTML == spanElem.html() ) {
				childNodes[childNode].remove();
				break;
			}
		}
	} else {
		let tagRefItem = {};
		for ( let tag in tagReference ) {
			if ( tagReference[tag].name == tagRef[0] ) {
				tagRefItem = tagReference[tag]
				break;
			}
		}
		for ( let childNode in childNodes ) { 
			if ( childNodes[childNode].innerHTML == spanElem.html() ) {
				let childNodeRef = childNodes[childNode];
				let updatedSpan = document.createElement( 'span' );

				$( updatedSpan ).html( '@' + tagRef[0].replaceAll( ' ', '_' ) )
					.attr( 'role', 'textbox' )
					.addClass( 'tag-text' )
					.addClass( 'tag-type_' + tagRefItem.type )
					.addClass( 'tag-id_' + tagRefItem.id )
					.prop( 'contenteditable', true )
					.data( 'tag-type', tagRefItem.type )
					.data( 'tag-id', tagRefItem.id );
				parentDiv.insertBefore( updatedSpan, childNodes[childNode] );
				childNodeRef.remove();
			}
		}
	}
}

function removeWeirdBlock( spanElems ) {
	spanElems.each( function() {
		if ( $( this ).css( 'background-color' ) == 'rgba(30, 144, 255, 0.4)' ) {
			let savedText = $( this ).html();
			let container = $( this ).parent();
			$( this ).remove();
			container.html( container.html() + savedText );
			try {
				setCursorPosition( container[0].childNodes[0], container.html().length );
			} catch{

			}
		}
	});
}

function addTagSpan( spanElem ) {
	let spanText = spanElem.html();
	let spanLastChar = spanText.length-1;
	for (let index=0; index<spanText.length; index++) {
		if ( ( spanText.charAt(index) == '#' || spanText.charAt(index) == '@') &&
				(index == 0 || (index > 4 && (spanText.charAt(index-1) != '>' || spanText.charAt(index-2) == 'r' && spanText.charAt(index-3) == 'b' && spanText.charAt(index-4) == '<' ) ) ) ) {
			let updatedSpanText = "";
			let tagSpan = document.createElement( 'span' );
			$( tagSpan ).attr( 'role', 'textbox' )
				.addClass( 'tag-text' )
				.prop( 'contenteditable', true )
				.html( spanText.charAt(index) );
			updatedSpanText = spanText.substring( 0, index ) + tagSpan.outerHTML;
			if ( index < spanText.length -1 ) {
				updatedSpanText += spanText.substring( index+1 );
			}
			spanElem.html( updatedSpanText );
			let childNodes = spanElem[0].childNodes;
			for ( let node in childNodes ) {
				if ( childNodes[node].innerHTML == '#' ||
						childNodes[node].innerHTML == '@' ) {
					setCursorPosition( childNodes[node], 1 );
				}
			}
		}
	}
}

function setCursorPosition( span, position ) {
    var range = document.createRange()
    var sel = window.getSelection()
    
    range.setStart(span, position)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
}

function saveSessionNote( noteSpan, defaultValue ) {
	if ( !$( '#tooltip' ).hasClass( 'hidden' ) ) {
		$( '#tooltip' ).empty().addClass( 'hidden' );
	}
	let tagSpans = noteSpan.find( '.tag-text' ).each( function() {
		processTagSpanReferences( $( this ), $( this ).parent()[0] );
	});
	if (noteSpan.html() != defaultValue && confirm( 'Are you sure you want to save this note text?' ) ) {
		upsertNote( null, noteSpan.html(), null, noteSpan.parent().parent().parent().data( 'id' ), assembleNoteTags( noteSpan ) );
	} else {
		if ( defaultValue == null || defaultValue == '' ) {
			noteSpan.parent().remove();
		} else {
			noteSpan.html( defaultValue );
		}
	}
}
function saveGeneralNote( noteSpan, defaultNoteValue, defaultName ) {
	let noteName = noteSpan.parent().parent().parent().find( '.note-name' ).val();
	console.log( noteSpan.html(), noteName );
	if ( !$( '#tooltip' ).hasClass( 'hidden' ) ) {
		$( '#tooltip' ).empty().addClass( 'hidden' );
	}
	let tagSpans = noteSpan.find( '.tag-text' ).each( function() {
		processTagSpanReferences( $( this ), $( this ).parent()[0] );
	});
	if ( ( noteSpan.html() != defaultNoteValue || noteName != defaultName ) && 
			confirm( 'Are you sure you want to save this note?' ) ) {
		upsertNote( noteName, noteSpan.html(), noteSpan.parent().data( 'id' ), null, assembleNoteTags( noteSpan ) );
	} else {
		console.log( noteSpan.html(), defaultNoteValue );
		if ( defaultNoteValue != null && defaultNoteValue != '' ) {
			noteSpan.html( defaultNoteValue );
		}
	}
}

function updateNote( noteSpan, defaultValue ) {
	if ( !$( '#tooltip' ).hasClass( 'hidden' ) ) {
		$( '#tooltip' ).empty().addClass( 'hidden' );
	}
	let tagSpans = noteSpan.find( '.tag-text' ).each( function() {
		processTagSpanReferences( $( this ), $( this ).parent()[0] );
	});
	if ( defaultValue != '' && noteSpan.html() != defaultValue && confirm( 'Are you sure you want to update this note text?' ) ) {
		upsertNote( null, noteSpan.html(), noteSpan.data( 'id' ), null, assembleNoteTags( noteSpan ) );
	} else {
		noteSpan.html( defaultValue );
	}
}

function assembleNoteTags( noteSpan ) {
	let tags = []
	noteSpan.find( '.tag-text' ).each(function() {
		if ( $( this ).html().charAt(0) == '@' ) {
			console.log( $( this ) );
			tags.push({
				'type': $( this ).data( 'tag-type' ),
				'id': $( this ).data( 'tag-id' )
			});
		} else {
			tags.push({
				'type': 'hashtag',
				'id': $( this ).html().substring(1)
			});
		}
	});
	return tags;
}

function buildNotePage( noteData ) {
	$( '#story-text__wrapper' ).empty();
	let noteWrapper = document.createElement( 'div' );
	let noteName = document.createElement( 'input' );
	let updateName = true;
	noteText = noteData.note;
	if ( noteData.name != null && noteData.name !== '' ) {
		$( noteName ).val( noteData.name );
	}
	if ( noteData.note == null || noteData.note === '' ) {
		updateName = false;
	}
	$( noteWrapper ).append( noteName );
	$( noteName ).prop( 'placeholder', 'Note Name' )
		.addClass( 'note-name' )
		.on( 'focus', function() {
			noteNameSave = $( this ).val()
		});
	let noteTextWrapper = document.createElement( 'div' );
	let noteTextElem = $( buildNoteSpan( noteData.note, noteData.id, getAccount() ) ).find( '.note-text' );
	$( noteTextElem ).off( 'blur' );
	$( noteTextWrapper ).append( noteTextElem )
		.on( 'click', function() {
			if ( !$( $( this ).find( 'span' )[0] ).is( ':focus' ) ) {
				$( this ).find( 'span' ).trigger( 'focus' );
				let childNodes = $( this ).find( 'span' )[0].childNodes;
				setCursorPosition( childNodes[childNodes.length-1], childNodes[childNodes.length-1].length );
			}
		});
	$( noteTextWrapper ).addClass( 'note__wrapper' ).data( 'id', noteData.id );
	let saveNoteWrapper = document.createElement( 'div' );
	let saveNote = document.createElement( 'div' );
	$( saveNote ).addClass( 'btn add-note__btn' )
		.html( 'Save' )
		.on( 'click', function() {
			saveGeneralNote( $( noteTextElem ), noteText, noteNameSave );
		});
	$( saveNoteWrapper ).append( saveNote );
	$( '#story-text__wrapper' )
		.append( noteWrapper )
		.append( noteTextWrapper )
		.append( saveNoteWrapper );
}

function searchForTagReference( tagText ) {
	return tagReference.map(t => t.name)
		.filter(t => t.toLowerCase().includes( tagText.replaceAll( '_', ' ' ).toLowerCase() ) )
		.sort();

}

function createFilterBtn( value, type, btnFilters ) {
	let filterAppliedBtn = document.createElement( 'div' );
	if ( type == 'Written By:' ) {
		$( filterAppliedBtn ).addClass( 'written-by' );
		$( '.btn.btn-filter-applied.written-by' ).trigger( 'click' );
	}
	$( filterAppliedBtn ).addClass( 'btn btn-filter-applied' )
		.html( value ).on( 'click', function() {
			$( this ).remove();

			$( '#filter-dropdown>select option' ).each( function() {
				if ( $( this ).html() == value ) {
					$( this ).attr( 'disabled', false );
				}
			});
			if ( btnFilters ) {
				filterNotes();
			}
		});
	$( '#filter-dropdown' ).append( filterAppliedBtn );
	if ( btnFilters ) {
		filterNotes();
	}
}

function filterNotes() {
	if ( $( '.btn-filter-applied' ).length == 0 ) {
		$( '.session-note__wrapper' ).show();
		return;
	}
	$( '.session-note__wrapper' ).each( function() {
		let note = $( this );
		let show = true;
		$( '.btn-filter-applied' ).each( function() {
			if (!noteFilters( note, $( this ).html(), $( this ).hasClass( 'written-by' ) )) {
				show = false;
			}
		});
		if ( show ) {
			note.show();
		} else {
			note.hide();
		}
	});
}

function noteFilters( note, value, author ) {
	if ( author ) {
		let author = note.find( '.note-character' );
		if ( author.length > 0 ) {
			return (value != 'Me' && author.html() == value);
		} else {
			return value == 'Me';
		}
	} else {
		let containsTag = false;
		note.find( '.tag-text' ).each( function() {
			if ( $( this ).html() == value ) {
				containsTag = true;
			}
		});
		return containsTag;
	}
}

function buildSearchPage( filters ) {
	$( '#story-text__wrapper' ).empty();
	let searchWrapper = document.createElement( 'div' );
	let searchHeader = document.createElement( 'div' );
	let searchBarWrapper = document.createElement( 'div' );
	let searchBar = document.createElement( 'input' );
	let searchBtn = document.createElement( 'div' );
	let notesWrapper = document.createElement( 'div' );

	$( searchBar ).addClass( 'search-notes__input' )
		.attr( 'placeholder', 'Enter Search Term');
	$( searchBtn ).addClass( 'btn btn__search-notes' )
		.html( 'Search' )
		.on( 'click', function() {
			alert( "SENDING SEARCH TERM TO API");
		});
	$( notesWrapper ).addClass( 'session-notes__wrapper' );

	$( searchBarWrapper ).addClass( 'flex' )
		.append( searchBar )
		.append( searchBtn );
	$( searchHeader ).addClass( 'note-search__header' )
		.append( searchBarWrapper )
		.append( buildFilterWrapper( filters, true ) );
	$( searchWrapper ).addClass( 'note-search__wrapper' )
		.append( searchHeader )
		.append( notesWrapper );

	$( '#story-text__wrapper' ).append( searchWrapper );
}

export { 
	buildSessionPage,
	buildNotePage,
	buildNoteSpan,
	buildSearchPage,
	createFilterBtn
};