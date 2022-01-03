const conn = new WebSocket("ws://localhost:8080/channels");

conn.onopen = async function() {
    console.log("Connected to the signaling server");
    await initialize();
}

conn.onmessage = async function(msg) {
    console.log("Got message", msg.data);
    let content = JSON.parse(msg.data);
    let data = content.data;
    switch (content.event) {
        // when somebody wants to call us
        case "offer":
            handleOffer(data);
            break;
        case "answer":
            handleAnswer(data);
            break;
        // when a remote peer sends an ice candidate to us
        case "candidate":
            handleCandidate(data);
            break;
        default:
            break;
    }
};

async function send(message) {
    await conn.send(JSON.stringify(message));
}

let peerConnection;
let dataChannel;

async function initialize() {
    let configuration = null;

    /**
     * iceServers: [
     {
                urls: "turn:13.209.34.30",
                username: "smilegate",
                credential: "1q2w3e4r"
            }
     ]
     */
    await playVideoFromCamera(constraints);

    peerConnection = new RTCPeerConnection(configuration);
    console.log(peerConnection);

    // Setup ice handling
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            send({
                event : "candidate",
                data : event.candidate
            });
        }
    };

    // creating data channel
    dataChannel = peerConnection.createDataChannel("dataChannel", {
        reliable : true
    });
    console.log(dataChannel);

    dataChannel.onerror = function(error) {
        console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function(event) {
        console.log("message:", event.data);
    };

    dataChannel.onclose = function() {
        console.log("data channel is closed");
    };

    peerConnection.ondatachannel = function (event) {
        dataChannel = event.channel;
    };
}

function createOffer() {
    var name = document.getElementById('name').value;
    var room = document.getElementById('roomName').value;

    document.getElementById('room-header').innerText = 'ROOM ' + room;
    document.getElementById('join').style.display = 'none';
    document.getElementById('room').style.display = 'block';

    peerConnection.createOffer(function(offer) {
        send({
            id : 'joinRoom',
            name : name,
            room : room,
        });
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        alert("Error creating an offer");
    });
}

function handleOffer(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event : "answer",
            data : answer
        });
    }, function(error) {
        alert("Error creating an answer");
    });

};

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
};


let constraints = {
    video: true,
    audio: true
};

const videoGrid = document.getElementById('video-grid');

// 재생
async function playVideoFromCamera() {
    try {
        const video = document.createElement('video');
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        addVideoStream(video, stream);
    } catch (error) {
        console.log('Error opening video camera', error);
    }
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
