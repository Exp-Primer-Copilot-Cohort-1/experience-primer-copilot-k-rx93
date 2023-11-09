// Create web server

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app); // Create server
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname)); // static file
app.use(bodyParser.json()); // parse json
app.use(bodyParser.urlencoded({extended: false})); // parse url encoded

var dbUrl = 'mongodb://localhost:27017/comments';

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// var messages = [
//     {name: 'Tim', message: 'Hi'},
//     {name: 'Jane', message: 'Hello'}
// ];

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err) {
            sendStatus(500);
        }
        // messages.push(req.body);
        io.emit('message', req.body);
        res.sendStatus(200);
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log('mongodb connected', err);
});

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port);
});