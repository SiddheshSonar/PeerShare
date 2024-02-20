const { pc, handleIceCandidate, datachannel, datachannel, END_OF_FILE_MESSAGE, downloadFile } = require('./main');

function createPeerConnection() {
    try {
        pc = new RTCPeerConnection(pcConfig);
        pc.onicecandidate = handleIceCandidate;
        console.log('Created RTCPeerConnnection');

        // Offerer side
        datachannel = pc.createDataChannel("filetransfer");
        datachannel.onopen = (event) => {
            datachannel.send("oferer sent:THIS");
        };

        datachannel.onmessage = (event) => {
            console.log("The oferrer received a message" + event.data);
        };
        datachannel.onerror = (error) => {
        };

        datachannel.onclose = () => {
        };

        pc.ondatachannel = function (event) {
            var channel = event.channel;
            channel.onopen = function (event) {
                channel.send('ANSWEREROPEN');
            };

            const receivedBuffers = [];
            channel.onmessage = async (event) => {
                console.log("The Answerrer received a message" + event.data);
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
                        channel.send("THE FILE IS READYYY");
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
exports.createPeerConnection = createPeerConnection;
