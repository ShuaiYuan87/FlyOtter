
var app = require('http').createServer()
, io = require('socket.io').listen(app)
, url = require('url')

var msg = require('./node_modules/lib/msg.js');
var state = require('./node_modules/lib/player_state.js');
var action = require('./node_modules/lib/player_action.js');

var last_player_time; //in seconds
var last_server_time;
var latency = {};
var current_state = state.PAUSED;
var SEEK_THRESHOLD = 1;

app.listen(8989);

console.error('Start listening');

last_player_time = 0;

last_server_time = Date.now();

function sendMessage(message, room) {

    var msg_id = Math.floor(Math.random() * 10000);
    message.msgID = msg_id;

    var msg_str = JSON.stringify(message);

    if (message.playerAction == action.SEEK) {
        console.error("=====================");
    }
    console.error('sending message ' + msg_str + 'to ' + room);

    io.sockets.in(room).emit('notification', {'message': msg_str});
}

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('create', function (room) {
        socket.join(room);
        socket.room = room;
        console.log('socket joining ' + room);
    });
    socket.on('postData', function (data) {
        console.error('received message ' + data);
        var data = JSON.parse(data);
        // Too much POST data, kill the connection!
        if (data.length > 1e6)
            request.connection.destroy();
        var msgType = data.msgType;
        // if the message is to request
        if (msgType == msg.MsgType.REQUEST) {
            data.msgType = msg.MsgType.ACTION;
            sendMessage(data, socket.room);
        }
        // ack latency check
        else if (msgType == msg.MsgType.ACK) {
            latency[data.clientId] = (Date.now()-data.timestamp)/2;
        }        
    });
    socket.on('disconnect', function(){
        console.log('socket leaving ' + socket.room);
        socket.leave(socket.room);
    });
});

setInterval(function checkLatency() {
    var message = {
        msgType: msg.MsgType.CHECK_LATENCY,
        timestamp: Date.now()
    };
 //   sendMessage(message);
}, 300000);

