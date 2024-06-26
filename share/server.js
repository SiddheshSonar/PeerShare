var os = require('os');
var express = require('express');
var app = express();
var http = require('http');
var cors = require('cors');
var socketIO = require('socket.io');

const PROTO_PATH = __dirname + '/protos/users.proto';
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const { login, logout } = require('./main-ms/main');


const packageDefinition = protoLoader.loadSync(
	PROTO_PATH,
	{
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	}
)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

const authService = protoDescriptor.authService

function getGrpcServer() {
	const grpcServer = new grpc.Server()
	grpcServer.addService(authService.AuthServiceRoutes.service, {
		login: login,
		logout: logout
	})
	return grpcServer
}
const grpcServer = getGrpcServer()
console.clear();
console.log('Starting gRPC server on port 0.0.0.0:50051...')
grpcServer.bindAsync(
	'0.0.0.0:50051',
	grpc.ServerCredentials.createInsecure(), () => {}
)

app.use(cors());

app.use(express.static('public'))

app.get("/", function (req, res) {
	res.render("index.ejs");
});

var server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
	console.log("Server is running on port 3000");
});

var io = socketIO(server, {
		cors: {
			origin: "http://localhost:5173",
			methods: ["GET", "POST"]
		}
	});

io.sockets.on('connection', function (socket) {

	function log() {
		var array = ['Message from server:'];
		array.push.apply(array, arguments);
		socket.emit('log', array);
	}

	socket.on('message', function (message, room) {
		// log('Client said: ', message);
		console.log('Client said: ', message);
		socket.in(room).emit('message', message, room);
	});

	socket.on('create or join', function (room) {
		log('Received request to create or join room ' + room);

		var clientsInRoom = io.sockets.adapter.rooms.get(room);

		var numClients = clientsInRoom ? clientsInRoom.size : 0;
		log("Room " + room + " now has " + numClients + " client(s)")

		if (numClients === 0) {
			socket.join(room);
			log('Client ID ' + socket.id + ' created room ' + room);
			socket.emit('created', room, socket.id);

		} else if (numClients === 1) {
			log('Client ID ' + socket.id + ' joined room ' + room);
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room, socket.id);
			io.sockets.in(room).emit('ready');
		} else { // max two clients
			socket.emit('full', room);
		}
	});

	socket.on('ipaddr', function () {
		var ifaces = os.networkInterfaces();
		for (var dev in ifaces) {
			ifaces[dev].forEach(function (details) {
				if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
					socket.emit('ipaddr', details.address);
				}
			});
		}
	});

	socket.on('bye', function () {
		console.log('received bye');
	});

});