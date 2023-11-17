const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const Rabbit = require('./rabbit.class')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.post('/emit-message', (req, res) => {
    console.log(req.body.message)
    return res.json({ success: true, message: 'Emitted Successfully' })
})

const server = http.createServer(app)

let io = new Server(server, { cors: { origin: '*' } })
io.on('connection', (socket) => {
    socket.emit('message','Connected To Server 7000 - Rabbit MQ Consumer')
})

const rabque = new Rabbit('test_queue')

rabque.initializeQueue().then(() => {
    rabque.retriveMessage(async (message) => {
        io.emit('message',message.content.toString())
        console.log(message.content.toString())
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return true
    })
})



server.listen(7000, () => {
    console.log('Server runs on port 7000...')
})