import express from 'express';
import request from 'request';

// Application servers 
const servers = ["http://localhost:5000", "http://localhost:5001"];

// Track the current application server to send request 
let current = 0;
// Receive new request and forward to application server 
const handler = (req, res) => {
// Select the current server to forward the request
    if(req.method == 'OPTIONS'){
        return
    }
    const server = servers[current];
    console.log(req.url);
    req.pipe(request({url: server+req.url})).pipe(res);
    console.log(`Request served by ${server}`);
    // Update the current server
    current = (current + 1) % servers.length;
}
const lbServer = express();
// pass the request to hander method 
lbServer.use((req, res)=>{handler(req, res)});

const PORT = process.env.PORT || 8080;

lbServer.listen(PORT, err =>{
    err? console.log(`Failed to listen on PORT ${PORT}`): console.log(`Server @ http://localhost:${PORT}`);
});