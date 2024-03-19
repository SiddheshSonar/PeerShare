// const net = require('net');
import net from 'net';

class LamportClock {
  constructor() {
    this.time = 0;
  }

  getTime() {
    return this.time;
  }

  // Update time as max of current time and received event time + 1
  receiveAction(receivedTime) {
    this.time = Math.max(this.time, receivedTime) + 1;
  }

  // Send an action, increment own time
  sendAction() {
    this.time++;
    return this.time;
  }
}

// TCP server
const server = net.createServer(socket => {
  console.log('Client connected.');

  const clock = new LamportClock();

  socket.on('data', data => {
    const receivedTime = parseInt(data.toString());
    clock.receiveAction(receivedTime);
    console.log(`Received message from client at time ${receivedTime}. Lamport time: ${clock.getTime()}`);

    // Echo back the updated Lamport time to the client
    socket.write(clock.getTime().toString());
  });

  socket.on('end', () => {
    console.log('Client disconnected.');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// TCP client
const client1 = new net.Socket();
const client2 = new net.Socket();

client1.connect(3000, 'localhost', () => {
  console.log('Connected to server (Client 1)');
  const clock = new LamportClock();
  const message = clock.sendAction().toString();
  client1.write(message);

  client1.on('data', data => {
    const receivedTime = parseInt(data.toString());
    clock.receiveAction(receivedTime);
    console.log(`Received updated Lamport time from server (Client 1): ${clock.getTime()}`);
  });
});

client2.connect(3000, 'localhost', () => {
  console.log('Connected to server (Client 2)');
  const clock = new LamportClock();
  const message = clock.sendAction().toString();
  client2.write(message);

  client2.on('data', data => {
    const receivedTime = parseInt(data.toString());
    clock.receiveAction(receivedTime);
    console.log(`Received updated Lamport time from server (Client 2): ${clock.getTime()}`);
  });
});
