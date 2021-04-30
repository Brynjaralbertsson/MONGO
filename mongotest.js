const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const router = require('./routes/test.js')


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var ActiveUsers = [];
// þurfum body parser fyrir meðhöndlun POST beiðna
app.use(bodyParser.urlencoded({extended:false}));
// rúturnar
app.use('/', router);

var count = 0;
io.on('connection', (socket) => {
	console.log('a user connected');
	io.emit('a user connected');
	GetChat();
	
	
	count++;
	//io.sockets.emit('counter', { count:count });
	
	// socket.userName = "Sveinn";
	
	
	socket.on('join', (name) => {
		// dulnefni fyrir þá sem vilja vera nafnlausir, meir til skemmtunar frekar en nokkurs annars :)
		// hér mætti svo bæta við virkni sem kæmi í veg fyrir að 2 notendur hefðu sama dulnefnið
		dulnefni = ['anonymous mountain goat', 'anonymous mongoose', 'anonymous hyena', 'anonymous rattlesnake', 'anonymous bear'];
		if (!name) {
			socket.userName = dulnefni[Math.floor(Math.random()*5)];
		} else {
			socket.userName = name;
		}		

		io.emit('chat message', socket.userName + " connected");
		io.emit('active users', " users active " + count);
		io.emit('NoMessage', "");
		io.emit('newMessage', "");
	});
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
		console.log(socket.userName, "disconnected");

		count--;
		io.emit('active users', " users active " + count);
		io.emit('chat message', socket.userName + " disconnected ");
		io.emit('NoMessage', "");
		io.emit('newMessage', "");
		
		
	});
	
	socket.on('chat message', (msg) => {
		io.emit('chat message', socket.userName+" wrote: "+msg);
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("ChatServer");
		  var Messages = { user: socket.userName, message: msg};
		  dbo.collection("Messages").insertOne(Messages, function(err, res)
		  {
		  	if (err) throw err;
		  })
		  db.close();
		});


	});
	socket.on('newMessage', (msg) => {
		io.emit('newMessage', socket.userName+" er að skrifa skilaboð");
		
	});

	socket.on('NoMessage', () => {
		io.emit('newMessage', " ");
		
	});


	

	socket.on('active users', () => {
		io.emit('active users', count );
	
		console.log( count, "active");
		
	});
function GetChat(){
		  MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("ChatServer");
		  dbo.collection("Messages").find({}).toArray((err, result) =>{
		  	if (err) throw err;
		    socket.emit('chat_init', result);
		   });
	

});

 }

  });

http.listen(3000, () => {
	console.log('listening on *:3000');
});