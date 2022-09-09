import { getChronicleId } from '../vampire/vampire-settings.js';
import { socket } from './socket.js';
import { user } from './common.js';

var myID;

function setMyID( id ) {
    myID = id;
}

var _peer_list = {};

function addIDToPeerList( id ) {
    _peer_list[id] = undefined;
}

const LOCAL = "local";

var mediaConstraints = {
    audio: false, // We want an audio track
    video: false // ...and we want a video track
};



document.addEventListener("DOMContentLoaded", ( event )=>{
    $( '#btn__mute' ).on( 'click', function() {
        $( this ).toggleClass( 'active' );
        setAudioMuteState( $( this ).hasClass( 'active' ) );      
    });
    $( '#btn__cam-disable' ).on( 'click', function() {
        $( this ).toggleClass( 'active' );
        setCameraDisabledState( $( this ).hasClass( 'active' ) );     
    }); 
    $( '#btn__chat-start' ).on( 'mouseenter', function(e) {
            $( '#tooltip' ).html( 'Loading Media Devices...' )
                .css({
                    'left': e.clientX - 100,
                    'top': e.clientY + 20
                }).removeClass( 'hidden' );
        }).on( 'mousemove', function(e) {
            $( '#tooltip' ).css({
                'left': e.clientX - 100,
                'top': e.clientY + 20
            });
        }).on( 'mouseleave', function() {
            $( '#tooltip' ).html( '' ).addClass( 'hidden' );
        });

    if ( navigator.mediaDevices ) {
        let hasInput = false;
        navigator.mediaDevices.enumerateDevices()
            .then( ( devices )=>{
                for ( let i in devices ) {
                    if ( devices[i].kind == 'videoinput' ) {
                        mediaConstraints.video = {
                            height: 360
                        };
                        hasInput = true;
                    }
                    if ( devices[i].kind == 'audioinput' ) {
                        hasInput = true;
                        mediaConstraints.audio = true;
                    }
                }
                if ( hasInput ) {   
                    $( '#btn__chat-start' ).off( 'mouseenter' ).off( 'mousemove' ).off( 'mouseleave' )
                        .on( 'click', function() {
                            if ( !$( this ).hasClass( 'disabled' ) ) {
                                addVideoElement( LOCAL, user );
                                initLocalVideo();
                                startCamera();
                                $( this ).addClass( 'disabled' );
                                $( '#btn__chat-hangup' ).removeClass( 'disabled' );
                            }
                        }).removeClass( 'disabled' );

                    $( '#btn__chat-hangup' ).on( 'click', function() {
                        if ( !$( this ).hasClass( 'disabled' ) ) {

                            $( this ).addClass( 'disabled' );
                            $( '#btn__chat-start' ).removeClass( 'disabled' );
                        }
                    });
                } else {
                    handleNoInput( false );
                }
            });


    } else {
        handleNoInput( true );
    }

});

function handleNoInput( sslError ) {
    let errorMessage = 'Unable to access camera or mic. ';

    if ( sslError ) {
        errorMessage += 'Make sure you are using https://';
    } else {
        errorMessage += 'Make sure you have input devices connected and refresh.';
    }

    $( '#btn__chat-start' ).off( 'mouseenter' )
        .on( 'mouseenter', function(e) {
            $( '#tooltip' ).html( errorMessage )
                .css({
                    'left': e.clientX - 100,
                    'top': e.clientY + 20
                }).removeClass( 'hidden' );
        }).on( 'mousemove', function(e) {
            $( '#tooltip' ).css({
                'left': e.clientX - 100,
                'top': e.clientY + 20
            });
        });
}

function startCamera() {
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then((stream)=>{
            document.getElementById("local__video").srcObject = stream;
            setAudioMuteState( $( '#btn__mute' ).hasClass( 'active' ) );                
            setCameraDisabledState(false);
        })
        .catch((e)=>{
            mediaConstraints.video = false;
            navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then((stream)=>{
                document.getElementById("local__video").srcObject = stream;
                setAudioMuteState(false);
            })
            .catch((e)=>{
                console.log("getUserMedia Error! ", e);
                alert("Error! Unable to access camera or mic! ");
            });
        });
}


function closeConnection(peer_id)
{
    if(peer_id in _peer_list)
    {
        try {
            _peer_list[peer_id].onicecandidate = null;
            _peer_list[peer_id].ontrack = null;
            _peer_list[peer_id].onnegotiationneeded = null;
        } catch (e) {
            
        }

        delete _peer_list[peer_id]; // remove user from user list
    }
}

function log_user_list()
{
    for(let key in _peer_list)
    {
        console.log(`${key}: ${_peer_list[key]}`);
    }
}

//---------------[ webrtc ]--------------------    

var PC_CONFIG = {
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302', 
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                    'stun:stun3.l.google.com:19302',
                    'stun:stun4.l.google.com:19302'
                ]
        },
    ]
};

function log_error(e){
    console.log("[ERROR] ", e);
}

function sendViaServer(data){
    socket.emit("chat-data", data);
}


function start_webrtc()
{
    console.log("PEER LIST");
    console.log(_peer_list);
    // send offer to all other members
    for(let peer_id in _peer_list)
    {
        invite(peer_id);
    }
}

function invite(peer_id)
{
    if(_peer_list[peer_id]){console.log("[Not supposed to happen!] Attempting to start a connection that already exists!")}
    else if(peer_id === myID){console.log("[Not supposed to happen!] Trying to connect to self!");}
    else
    {
        console.log(`Creating peer connection for <${peer_id}> ...`);
        createPeerConnection(peer_id);

        let local_stream = document.getElementById("local__video").srcObject;
        setTimeout( function() {
            local_stream.getTracks().forEach((track)=>{_peer_list[peer_id].addTrack(track, local_stream);});
        }, 1000);
    }
}

function createPeerConnection(peer_id)
{
    _peer_list[peer_id] = new RTCPeerConnection(PC_CONFIG);

    _peer_list[peer_id].onicecandidate = (event) => {handleICECandidateEvent(event, peer_id)};
    _peer_list[peer_id].ontrack = (event) => {handleTrackEvent(event, peer_id)};
    _peer_list[peer_id].onnegotiationneeded = () => {handleNegotiationNeededEvent(peer_id)};
}


function handleNegotiationNeededEvent(peer_id)
{
    _peer_list[peer_id].createOffer()
    .then((offer)=>{return _peer_list[peer_id].setLocalDescription(offer);})
    .then(()=>{
        console.log(`sending offer to <${peer_id}> ...`);
        sendViaServer({
            "sender_id": myID,
            "target_id": peer_id,
            "type": "offer",
            "sdp": _peer_list[peer_id].localDescription
        });
    })
    .catch(log_error);
} 

function handleOfferMsg(msg)
{   
    let peer_id = msg['sender_id'];

    console.log(`offer recieved from <${peer_id}>`);
    
    createPeerConnection(peer_id);
    let desc = new RTCSessionDescription(msg['sdp']);
    _peer_list[peer_id].setRemoteDescription(desc)
    .then(()=>{
        let local_stream = document.getElementById("local__video").srcObject;
        local_stream.getTracks().forEach((track)=>{_peer_list[peer_id].addTrack(track, local_stream);});
    })
    .then(()=>{return _peer_list[peer_id].createAnswer();})
    .then((answer)=>{return _peer_list[peer_id].setLocalDescription(answer);})
    .then(()=>{
        console.log(`sending answer to <${peer_id}> ...`);
        sendViaServer({
            "sender_id": myID,
            "target_id": peer_id,
            "type": "answer",
            "sdp": _peer_list[peer_id].localDescription
        });
    })
    .catch(log_error);
}

function handleAnswerMsg(msg)
{
    let peer_id = msg['sender_id'];
    console.log(`answer recieved from <${peer_id}>`);
    let desc = new RTCSessionDescription(msg['sdp']);
    console.log( peer_id );
    console.log( _peer_list[peer_id] );
    _peer_list[peer_id].setRemoteDescription(desc).catch((e)=>{
        console.log("handleAnswerMsg Error! ", e);
        alert("Error handling answer message! ");
    });
}


function handleICECandidateEvent(event, peer_id)
{
    if(event.candidate){
        sendViaServer({
            "sender_id": myID,
            "target_id": peer_id,
            "type": "new-ice-candidate",
            "candidate": event.candidate
        });
    }
}

function handleNewICECandidateMsg(msg)
{
    console.log(`ICE candidate recieved from <${msg["sender_id"]}>`);
    var candidate = new RTCIceCandidate(msg.candidate);
    _peer_list[msg["sender_id"]].addIceCandidate(candidate)
    .catch(log_error);
}


function handleTrackEvent(event, peer_id)
{
    console.log(`track event recieved from <${peer_id}>`);
    
    if(event.streams)
    {
        getVideoObj(peer_id).srcObject = event.streams[0];
    }
}

function initLocalVideo() {
    let myVideo = document.getElementById("local__video");
    myVideo.onloadeddata = ()=>{
        console.log("W,H: ", myVideo.videoWidth, ", ", myVideo.videoHeight);

        socket.emit( "join-room", 
            { 
                'room_id'      : getChronicleId(),
                'display_name' : user,
                'mute_audio'   : $( '#btn__mute' ).hasClass( 'active' ),
                'disable_cam'  : $( '#btn__cam-disable' ).hasClass( 'active' )
            });
    };

}


function makeVideoElement(element_id, display_name)
{
    let wrapper_div = document.createElement("div");
    let vid_wrapper = document.createElement("div");
    let vid = document.createElement("video");
    let name_text = document.createElement("div");

    wrapper_div.id = element_id;
    vid.id = element_id + "__video";
    if ( element_id == LOCAL ) {
        vid.muted = true;
    }
    vid.playsInline = true;

    wrapper_div.className = "shadow video-item";
    vid_wrapper.className = "vid-wrapper";
    name_text.className = "display-name";
    
    vid.autoplay = true;        
    name_text.innerText = display_name;

    vid_wrapper.appendChild(vid);
    wrapper_div.appendChild(vid_wrapper);
    wrapper_div.appendChild(name_text);

    return wrapper_div;
}

function addVideoElement( element_id, display_name ) {
    let videoElement = makeVideoElement(element_id, display_name);
    if ( element_id == LOCAL ) {
        $( "#chat-content__wrapper" ).prepend( videoElement );      
    } else {
        $( "#chat-content__wrapper" ).append( videoElement );
    }
}
function removeVideoElement(element_id)
{    
    let v = getVideoObj(element_id);
    if ( v ) {
        if(v.srcObject){
            v.srcObject.getTracks().forEach(track => track.stop());
        }
        v.removeAttribute("srcObject");
        v.removeAttribute("src");
        document.getElementById( element_id).remove();
    }
}

function getVideoObj(element_id)
{
    return document.getElementById( element_id + '__video' );
}

function setAudioMuteState(flag)
{
    let local_stream = document.getElementById("local__video").srcObject;
    local_stream.getAudioTracks().forEach((track)=>{track.enabled = !flag;});
}
function setCameraDisabledState(flag)
{
    let local_stream = document.getElementById("local__video").srcObject;
    local_stream.getVideoTracks().forEach((track)=>{track.enabled = !flag;});
}

export {
    setMyID,
    addIDToPeerList,
    addVideoElement,
    start_webrtc,
    closeConnection,
    handleOfferMsg,
    handleAnswerMsg,
    handleNewICECandidateMsg,
    removeVideoElement
};

