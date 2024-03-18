import { Server as NTPServer } from 'ntp-time';

const server = new NTPServer();

server.handle((message, response) => {
    console.log('Server message:', message);

    message.transmitTimestamp = Math.floor(Date.now() / 1000);

    response(message);
});

const PORT = process.env.PORT || 1200;

server.listen(PORT, err => {
    if (err) {
        console.log("Error: ", err)
        throw err
    };
    console.clear();
    console.log(`Server @ http://localhost:${PORT}`);
});