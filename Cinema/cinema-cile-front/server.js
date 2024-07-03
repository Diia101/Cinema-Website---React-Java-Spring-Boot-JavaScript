const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

let onlineUsers = 0;

io.on('connection' , (socket) => {
    console.log('New user connected', socket.id);

    socket.broadcast.emit('user_notification', "A new user has connected to the app");

    socket.on('userLogin', (username) => {
        onlineUsers++;
        socket.broadcast.emit('userHasLoggedIn', username);
        socket.broadcast.emit('loggedUsers', onlineUsers);
        console.log('username has logged in', onlineUsers)
    })
    socket.on('userLogout', () => {
        onlineUsers = Math.max(0, onlineUsers -1);
        socket.broadcast.emit('userHasLoggedOut');
        socket.broadcast.emit('loggedUsers', onlineUsers);
        console.log('username has logged in')
    })

    socket.on('global_notification', (message) => {
        io.emit('movie_notification', message);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})

const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
})