import { STORYTELLER } from './vampire.js';
import { user } from '../common/common.js';
import { storyToolbarClick } from '../common/toolbar.js';
import { loadLocationById } from '../common/api.js';
import { buildNoteSpan } from '../common/notes.js';

function getLocationBtn( name, id ) {
	let locationBtn = document.createElement( 'div' );
	let locationName = document.createElement( 'div' );
	$( locationName ).addClass( 'name' ).html( name );
	$( locationBtn ).addClass( 'btn btn-location' ).data( 'id', id ).append( locationName );
	return locationBtn;
}
function processLocationData( locationBtn ) {
	loadLocationById( locationBtn.data( 'id' ), false, false );
}

function assembleLocationData( locationInfo ) {
	let locationWrapper = document.createElement( 'div' );
	$( locationWrapper ).addClass( 'full-width' );
	let header = document.createElement( 'div' );
	let headerSpan = document.createElement( 'span' );
	$( headerSpan ).addClass( 'header' ).html( locationInfo.name );
	$( header ).attr( 'id', 'location-header' ).append( headerSpan ).data( 'id', locationInfo.id );
	if ( user == STORYTELLER ) {
		let editBtn = document.createElement( 'div' );
		$( editBtn ).addClass( 'btn btn_edit location' ).html( 'Edit' );
		$( header ).append( editBtn );
	}
	if ( locationInfo.address ) {
		let map = document.createElement( 'iframe' );
		$( map ).addClass( 'location-map' ).attr({
			'frameborder': '0',
			'style':'border:0',
			'src':'//maps.google.com/maps?q=' + locationInfo.address.replaceAll( ' ', '+' ) + '&z=13&output=embed'
		});
		let address = document.createElement( 'span' );
		$( address ).addClass( 'sub-text' ).html( locationInfo.address );
		$( header ).append( document.createElement( 'br' ) ).append( map ).append( document.createElement( 'br' ) ).append( address );
	}
	$( locationWrapper ).append( header );
	if ( locationInfo.pic ) {
		let picWrapper = document.createElement('div');
		let pic = document.createElement( 'img' );
		$( pic ).attr( 'src', locationInfo.pic );
		$( picWrapper ).append( pic );
		$( locationWrapper ).append( picWrapper );
	}

	if ( locationInfo.description ) {
		let description = document.createElement( 'div' );
		$( description ).attr( 'id', 'location-description' ).html( locationInfo.description );
		$( locationWrapper ).append( description );
	}

	if ( locationInfo.havens && locationInfo.havens.length > 0 ) {
		let havensLabel = document.createElement( 'div' );
		$( havensLabel ).html( 'Haven For:' ).addClass( 'header small' );
		let havensWrapper = document.createElement( 'div' );
		$( havensWrapper ).addClass( 'flex' );
		for ( let index in locationInfo.havens ) {
			let characterBtn = document.createElement( 'div' );
			$( characterBtn ).addClass( 'btn btn-character' ).html( locationInfo.havens[index].name ).data( 'id', locationInfo.havens[index].id );
			$( havensWrapper ).append( characterBtn );
		}
		$( locationWrapper ).append( havensLabel ).append( havensWrapper );
	}

	if ( locationInfo.notes ) {
		let notesLabel = document.createElement( 'div' );
		$( notesLabel ).html( 'Notes:' ).addClass( 'header small' );
		let notesWrapper = document.createElement( 'ul' );
		for ( let i in locationInfo.notes ) {
			$( notesWrapper ).append( buildNoteSpan( locationInfo.notes[i].note, locationInfo.notes[i].id, locationInfo.notes[i].account_id ) );
		}
		$( locationWrapper ).append( notesLabel ).append( notesWrapper );
	}

	return locationWrapper;
}

function sortLocationsAlphabetical( locations ) {
	let original = {}
	for ( let locationName in locations ) {
		original[locationName.replace( 'The ', '' )] = locationName;
	}
	let locationsList = Object.keys(original).sort();
	return locationsList.map(location => original[location]);
}

export { getLocationBtn, processLocationData, assembleLocationData };


