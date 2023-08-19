const express = require('express')

const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')

    let displayName;

    // Handle user join
    socket.on('join', (name) => {
        displayName = name;
        socket.broadcast.emit('system', `${name} joined the chat`);
    });

    // Handle user messages
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        if(displayName){
            socket.broadcast.emit('system', `${displayName} left the chat`);
        }
       
    });

})