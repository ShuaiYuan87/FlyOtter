
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

var owner_map = {};

function sendMessage(message, room, owner_only, init) {

    var msg_id = Math.floor(Math.random() * 10000);
    message.msgID = msg_id;

    var msg_str = JSON.stringify(message);

    if (message.playerAction == action.SEEK) {
        console.error("=====================");
    }
    console.error('sending message ' + msg_str + 'to ' + room);
    owner_only = typeof owner_only !== 'undefined' ? owner_only : false;
    if (owner_only) {
        owner_map[room].emit('check_state', {'message': msg_str});
        console.error('owner_only');
    }
    else {
        init = typeof init !== 'undefined' ? init : false;
        if (!init) {
            io.sockets.in(room).emit('notification', {'message': msg_str});
        }
        else {
            io.sockets.in(room).emit('init', {'message': msg_str});
        }
    }
}
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('create', function (room) {
        if (!(room in owner_map)) {
            owner_map[room] = socket;
        }
        else {
            
        }
        socket.join(room);
        socket.room = room;
        console.log('socket joining ' + room);
    });
    socket.on('check_state', function (room) {
        var message = {
                //reply_socket: socket,
        };
        sendMessage(message, room, true);
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
    socket.on('init', function (data) {
        
        console.error('received message ' + data);
        var data = JSON.parse(data);
        // Too much POST data, kill the connection!
        if (data.length > 1e6)
            request.connection.destroy();
        //sleepFor(35000);
        sendMessage(data, socket.room, false, true);
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

