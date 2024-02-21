var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var pc;
var turnReady;
var datachannel;

var pcConfig = turnConfig;

var room = prompt('Enter room name:');

var socket = io.connect();

if (room !== '') {
    // socket.emit('create or join', room);
    console.log('Attempted to create or  join room', room);
}

socket.on('created', function (room) {
    console.log('Created room ' + room);
    isInitiator = true;
});

socket.on('full', function (room) {
    console.log('Room ' + room + ' is full');
});

socket.on('join', function (room) {
    console.log('Another peer made a request to join room ' + room);
    console.log('This peer is the initiator of room ' + room + '!');
    isChannelReady = true;
});

socket.on('joined', function (room) {
    console.log('joined: ' + room);
    isChannelReady = true;
});

socket.on('log', function (array) {
    console.log.apply(console, array);
});


socket.on('message', function (message, room) {
    console.log('Client received message:', message, room);
    if (message === 'gotuser') {
        maybeStart();
    } else if (message.type === 'offer') {
        if (!isInitiator && !isStarted) {
            maybeStart();
        }
        pc.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
    } else if (message.type === 'answer' && isStarted) {
        pc.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === 'candidate' && isStarted) {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        pc.addIceCandidate(candidate);
    } else if (message === 'bye' && isStarted) {
        handleRemoteHangup();
    }
});

function sendMessage(message, room) {
    console.log('Client sending message: ', message, room);
    socket.emit('message', message, room);
}


function maybeStart() {
    console.log('>>>>>>> maybeStart() ', isStarted, isChannelReady);
    if (!isStarted && isChannelReady) {
        console.log('>>>>>> creating peer connection');
        createPeerConnection();
        isStarted = true;
        console.log('isInitiator', isInitiator);
        if (isInitiator) {
            doCall();
        }
    }
}


window.onbeforeunload = function () {
    sendMessage('bye', room);
};
var datachannel
function createPeerConnection() {
    try {
        pc = new RTCPeerConnection(pcConfig);
        pc.onicecandidate = handleIceCandidate;
        console.log('Created RTCPeerConnnection');

        // Offerer side
        datachannel = pc.createDataChannel("filetransfer");
        datachannel.onopen =  (event) => {
            datachannel.send("oferer sent:THIS")
        };

        datachannel.onmessage =  (event)=> {
            console.log("The oferrer received a message"+event.data);
        }
        datachannel.onerror = (error) => {
        };

        datachannel.onclose = () => {
        };

        pc.ondatachannel = function (event) {
            var channel = event.channel;
            channel.onopen = function (event) {
                channel.send('ANSWEREROPEN');
            }

            const receivedBuffers = [];
            channel.onmessage = async (event) => {
                console.log("The Answerrer received a message"+event.data);
                const { data } = event;
                try {
                    if (data !== END_OF_FILE_MESSAGE) {
                        receivedBuffers.push(data);
                    } else {
                        const arrayBuffer = receivedBuffers.reduce((acc, arrayBuffer) => {
                            const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
                            tmp.set(new Uint8Array(acc), 0);
                            tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
                            return tmp;
                        }, new Uint8Array());
                        const blob = new Blob([arrayBuffer]);
                        channel.send("THE FILE IS READYYY")
                        console.log("file name", channel.label)
                        downloadFile(blob, channel.label);
                        channel.close();
                    }
                } catch (err) {
                    console.log('File transfer failed');
                }
            };
        };
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
}

function handleIceCandidate(event) {
    console.log('icecandidate event: ', event);
    if (event.candidate) {
        sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        }, room);
    } else {
        console.log('End of candidates.');
    }
}

function handleCreateOfferError(event) {
    console.log('createOffer() error: ', event);
}


function doCall() {
    console.log('Sending offer to peer');
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}


function doAnswer() {
    console.log('Sending answer to peer.');
    pc.createAnswer().then(
        setLocalAndSendMessage,
        onCreateSessionDescriptionError
    );
}

function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    sendMessage(sessionDescription, room);
}

function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
}


function hangup() {
    console.log('Hanging up.');
    stop();
    sendMessage('bye', room);
}

function handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
    isInitiator = false;
}

function stop() {
    isStarted = false;
    pc.close();
    pc = null;
}


var connectbutton = document.getElementById("connectbutton")
if (connectbutton) {
    connectbutton.addEventListener("click", () => {
        if (connectbutton.innerHTML !== "Connected") {
            socket.emit("create or join", room);
            sendMessage("gotuser", room);
            if (isInitiator) {
                maybeStart();
            }
        }
        connectbutton.innerHTML = "Connected";
    })
}

let file;
var fileInput = document.getElementById("inputfile");
fileInput.addEventListener("change", (event) => {
    file = event.target.files[0];
})
var sharefilebutton = document.getElementById("sharefile")
sharefilebutton.addEventListener("click", () => {
    shareFile()
})

const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';

const shareFile = async () => {
    console.log("Share file")
    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        console.log(arrayBuffer)
        for (let i = 0; i < arrayBuffer.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
            datachannel.send(arrayBuffer.slice(i, i + MAXIMUM_MESSAGE_SIZE));
        }
        datachannel.send(END_OF_FILE_MESSAGE);
    }
};

const downloadFile = (blob, fileName) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "e3.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove()
};
