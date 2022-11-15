const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const adminNameSpace = io.of('/admin')

adminNameSpace.on('connect', (socket) => {
    // console.log('a user connected');

    socket.on('join', (data) =>
    {
        socket.join(data.room)
        adminNameSpace.in(data.room).emit('chat message', `New Person joined the ${data.room} room`)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (data) => {
        adminNameSpace.in(data.room).emit('chat message', data.msg);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
