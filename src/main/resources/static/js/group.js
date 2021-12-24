const conn = new WebSocket('ws://localhost:8080/group');

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
    let configuration = {
        iceServers: [
            {
                urls: "turn:13.209.34.30",
                username: "smilegate",
                credential: "1q2w3e4r"
            }
        ]
    }

    playVideoFromCamera(constraints);

    peerConnection = new RTCPeerConnection(configuration);

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
    peerConnection.createOffer(function(offer) {
        send({
            event : "offer",
            data : offer
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

// 카메라 마이크 설정
const setMediaDevices = async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

// 재생
async function playVideoFromCamera(constraints) {
    try {
        const stream = await setMediaDevices(constraints);
        const video = document.createElement('video');
        await addVideoStream(video, stream);
    } catch (error) {
        console.log('Error opening video camera', error);
    }
}

async function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}
