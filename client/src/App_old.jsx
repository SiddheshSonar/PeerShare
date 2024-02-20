import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const App = () => {
  const [isChannelReady, setIsChannelReady] = useState(false);
  const [isInitiator, setIsInitiator] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [room, setRoom] = useState('');
  const [peer, setPeer] = useState(null);

  const pcConfig = {
    iceServers: [
      {
        urls: [
          "stun:bn-turn1.xirsys.com"
        ]
      },
      {
        username: "67JVSBLop5DqymSoHACKdBZmSQz_19LJX8Hk-bkVSGNu_FhzuoxZ52EFYmEX43-0AAAAAGXLXc9zdGVwaGVuMDM=",
        credential: "d588ed62-ca69-11ee-a4f6-0242ac140004",
        urls: [
          "turn:bn-turn1.xirsys.com:80?transport=udp",
          "turn:bn-turn1.xirsys.com:3478?transport=udp",
          "turn:bn-turn1.xirsys.com:80?transport=tcp",
          "turn:bn-turn1.xirsys.com:3478?transport=tcp",
          "turns:bn-turn1.xirsys.com:443?transport=tcp",
          "turns:bn-turn1.xirsys.com:5349?transport=tcp"
        ],
      },
    ],
  }

  useEffect(() => {
    const roomName = prompt('Enter room name:');
    setRoom(roomName);
  }, []);

  const socket = io.connect("http://localhost:3000");

  useEffect(() => {
    if (room !== '') {
      socket.emit('create or join', room);
      console.log('Attempted to create or join room', room);
    }
  }, [room]);

  socket.on('created', (room) => {
    console.log('Created room ' + room);
    setIsInitiator(true);
  });

  socket.on('full', (room) => {
    console.log('Room ' + room + ' is full');
  });

  socket.on('join', (room) => {
    console.log('Another peer made a request to join room ' + room);
    console.log('This peer is the initiator of room ' + room + '!');
    setIsChannelReady(true);
  });

  socket.on('joined', (room) => {
    console.log('joined: ' + room);
    setIsChannelReady(true);
  });

  socket.on('log', (array) => {
    console.log.apply(console, array);
  });

  socket.on('joined', (message, room) => {
    console.log('Client received message:', message, room);
    if (message === 'gotuser') {
      maybeStart();
    }
  });

  const maybeStart = () => {
    console.log('>>>>>>> maybeStart() ', isStarted, isChannelReady);
    if (!isStarted && isChannelReady) {
      console.log('>>>>>> creating peer connection');
      createPeerConnection();
      setIsStarted(true);
      console.log('isInitiator', isInitiator);
      if (isInitiator) {
        doCall();
      }
    }
  };

  useEffect(() => {
    const onBeforeUnload = () => {
      console.log("this is the end")
      sendMessage('bye', room);
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [room]);

  const createPeerConnection = () => {
    try {
      const newPeer = new SimplePeer({
        initiator: isInitiator,
        trickle: false,
        config: pcConfig,
      });

      console.log("new peer", newPeer);

      newPeer.on('signal', (data) => {
        sendMessage(data, room);
      });

      newPeer.on('data', (data) => {
        // Handle data received from peer
      });

      newPeer.on('error', (err) => {
        console.error('error', err);
        // Handle error
      });

      newPeer.on('close', () => {
        console.log('CLOSE');
        // Handle close
      });

      setPeer(newPeer);
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object.');
    }
  };

  const sendMessage = (message, room) => {
    console.log('Client sending message: ', message, room);
    socket.emit('message', message, room);
  };

  const doCall = () => {
    console.log('Sending offer to peer');
    peer.signal('something'); // signal to start WebRTC negotiation
  };

  const handleRemoteHangup = () => {
    console.log('Session terminated.');
    setIsInitiator(false);
  };

  const hangup = () => {
    console.log('Hanging up.');
    setIsStarted(false);
    peer.destroy();
    setPeer(null);
    console.log("this is the end")  
    sendMessage('bye', room);
  };

  const shareFile = async () => {
    const fileInput = document.getElementById("inputfile");
    const file = fileInput.files[0];
    
    if (!peer) {
      console.error('Peer connection not established.');
      return;
    }
  
    const fileSize = file.size;
    const chunkSize = 16 * 1024; // 16KB
    let offset = 0;
  
    while (offset < fileSize) {
      const chunk = file.slice(offset, offset + chunkSize);
      peer.send(chunk);
      offset += chunkSize;
    }
  };
  

  const downloadFile = (blob, fileName) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div>
      <h1>Send files peer to peer</h1>
      <input type="file" id="inputfile" />
      <button onClick={shareFile}>Share File</button>
      <button id="connectbutton" onClick={hangup}>Disconnect</button>
    </div>
  );
};

export default App;
