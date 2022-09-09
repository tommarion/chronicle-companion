import { base, user, getGameType } from './common.js';
import {cacheToken, getAccount} from './cache.js';
import { addBadge } from './toolbar.js';
import { getOnlineStatus, registerToken } from './api.js';
import { ping, updateEncounterCharacterPos, updateEncounterCharacterColor, updateEncounterCharacterVisible } from './encounter.js';
import { handleRollResults } from '../vampire/dice.js';
import { handleToggleEnabledResponse, getChronicleId } from '../vampire/vampire-settings.js';
import { getUrlVariable } from '../vampire/vampire.js';
import { assembleCharacterData } from '../vampire/character.js';
import { setMyID, addIDToPeerList, addVideoElement, start_webrtc, closeConnection, handleOfferMsg, handleAnswerMsg, handleNewICECandidateMsg, removeVideoElement } from './webrtc-chat.js';

let protocol = window.location.protocol;
export var socket;
if ( protocol === 'https:' ) {
	socket = io( protocol + '//' + document.domain + ':9092');
} else {
	socket = io.connect(':9092');
}
/*
 EXAMPLE
	socket.emit( 'data update', {
		'type' : 'tracker',					tracker | skill | attribute | notes
		'tracker' : 'willpower',			(for tracker) willpower | health | humanity | hunger
		'damage_type' : 'superficial',		(for tracker) superficial | aggravated
		'skill_name' : ''					(for skill) strength | dexterity...
		'attriute_name' : ''				(for attribute) strength | dexterity...
		'character_id' : 1,
		'value' : 1
	});
*/
function updateData( data ) {
	data.account_id = getAccount();
	socket.emit( 'vampire data update', data );
}

socket.on( 'vampire data updated', function( data ) {
	console.log( "DATA UPDATED!", data);
	if (data.id == getUrlVariable('character=')) {
		$( '#character__wrapper' ).html( assembleCharacterData( data ) );
	} else {
		console.log(data.id, getUrlVariable('character='))
	}
});

socket.on( 'roll results', function( data ) {
	if (data.notify != 'private' ||
		user == 'Storyteller' ||
		user == data.player) {
		handleRollResults(data);
	}
	addBadge( $( '#btn-roll' ), null );
});

socket.on( 'online/update', function( data ) {
	getOnlineStatus();
});

socket.on( 'play sound-effect', function( data ) {
	$( '#' + data['sound-effect'] )[0].play();
});

// HAND WRAPPER

function processHandRaises() {
	if (user == 'Storyteller') {
		socket.on( 'hand raised', function( data ) {
			var elems = $( '#hand__wrapper:contains(' + data.character + ')');
			if (elems.length > 0 && elems.find('.btn').hasClass('btn_hand-raised')) {
				$( '.btn_hand-raised:contains(' + data.character + ')' ).addClass('remind');
			} else {
				$( '#hand__wrapper>div' ).append( '<div class="btn btn_hand-raised">' + data.character + '</div>' );
				resizeHandWrapper();
			}
			$( '#notification_effect' )[0].play();
		});

		$( '#hand__wrapper' ).on( 'click', '.btn_hand-raised', function() {
			$( this ).remove();
			resizeHandWrapper();
			socket.emit( 'acknowledge hand', { 'character' : $( this ).html() } )
		})
	} else {
		$( '#btn_raise-hand' ).on( 'click', function() {
			alert( "Storyteller notified!");
			socket.emit( 'raise hand', { 'character' : user } );
		});

		socket.on( 'hand acknowledged', function( data ) {
			console.log( "HAND ACKNOWLEDGED!", data);
			if (user == data.character) {
				alert('Storyteller achnowledged notification!');
			}
		});
	}
}

socket.on( 'vampire chronicle toggle enabled', function( data ) {
	console.log( "CHRONICLE ENABLED", data );
	handleToggleEnabledResponse( data );
});

function resizeHandWrapper() {
	const hands = $( '#hand__wrapper>div' ).children().length;
	let height = 0;

	if (hands == 1) {
		height = 100;
	} else if (hands > 1) {
		height = 100 + ((hands - 1) * 75);
	}

	$( '#hand__wrapper' ).css( 'height' , height + 'px' );
}

function sendPingData( pingData ) {
	pingData.account = getAccount();
	socket.emit( getGameType() + ' ping', pingData );
}

socket.on( 'vampire handle ping', function( data ) {
	addBadge( $( '#btn-maps' ), $( '#encounter__wrapper' ) );
	ping( data );
});

function sendEncounterCharacterPos( pos, characterAccountId, characterId ) {
	console.log( characterAccountId );
	socket.emit( getGameType() + ' encounter character pos', { 
		'account': getAccount(),
		'chronicle_id': getChronicleId(),
		'coords': pos,
		'character_account_id': characterAccountId,
		'character_id': characterId,
		'encounter_id': $( '#encounter__wrapper' ).data( 'id' )
	});
}

socket.on( 'vampire handle encounter character pos', function( data ) {
	addBadge( $( '#btn-maps' ), $( '#encounter__wrapper' ) );
	updateEncounterCharacterPos( data );
});

function sendEncounterCharacterColor( color, characterAccountId, characterId ) {
	socket.emit( getGameType() + ' encounter character color', {
		'account': getAccount(),
		'chronicle_id': getChronicleId(),
		'color': color,
		'character_account_id': characterAccountId,
		'character_id': characterId,
		'encounter_id': $( '#encounter__wrapper' ).data( 'id' )
	});
}

socket.on( 'vampire handle encounter character color', function( data ) {
	addBadge( $( '#btn-maps' ), $( '#encounter__wrapper' ) );
	updateEncounterCharacterColor( data );
});

function sendEncounterCharacterVisible( visible, characterAccountId, characterId ) {
	socket.emit( getGameType() + ' encounter character visible', {
		'account': getAccount(),
		'chronicle_id': getChronicleId(),
		'visible': visible,
		'character_account_id': characterAccountId,
		'character_id': characterId,
		'encounter_id': $( '#encounter__wrapper' ).data( 'id' )
	});
}

socket.on( 'vampire handle encounter character visible', function( data ) {
	addBadge( $( '#btn-maps' ), $( '#encounter__wrapper' ) );
	updateEncounterCharacterVisible( data );
});

socket.on("user-connect", (data)=>{
    console.log("user-connect ", data);
    let peer_id = data["sid"];
    let display_name = data["name"];
    addIDToPeerList(peer_id); // add new user to user list
    addVideoElement(peer_id, display_name);
});
socket.on("user-disconnect", (data)=>{
    console.log("user-disconnect ", data);
    let peer_id = data["sid"];
    closeConnection(peer_id);
    removeVideoElement(peer_id);
});
socket.on("user-list", (data)=>{
    console.log("user list recvd ", data);
    setMyID( data["my_id"] );
    if( "list" in data) // not the first to connect to room, existing user list recieved
    {
        let recvd_list = data["list"];  
        // add existing users to user list
        for( let peer_id in recvd_list )
        {
            addIDToPeerList(peer_id);
            addVideoElement(peer_id, recvd_list[peer_id]);
        } 
        start_webrtc();
    }    
});

socket.on("chat-data", (msg)=>{
    switch(msg["type"])
    {
        case "offer":
            handleOfferMsg(msg);
            break;
        case "answer":
            handleAnswerMsg(msg);
            break;
        case "new-ice-candidate":
            handleNewICECandidateMsg(msg);
            break;
    }
});

socket.on("registration request received", (token)=>{
	registerToken(token);
});
socket.on("update online", () => {
	getOnlineStatus();
});

function emitRegistrationRequest() {
	socket.emit("register", {});
}

function emitTokenRegistered() {
	socket.emit("token registered", {});
}

function emitRollResults(rollResults) {
	socket.emit("roll", rollResults);
}

export { 
	processHandRaises,
	updateData,
	sendPingData,
	sendEncounterCharacterPos,
	sendEncounterCharacterColor,
	sendEncounterCharacterVisible,
	emitTokenRegistered,
	emitRegistrationRequest,
	emitRollResults
};
