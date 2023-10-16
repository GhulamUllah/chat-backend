const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')



const app = express()
const users = [{}]


app.use(cors())

app.get('/', (req, res) => res.send("Welcome To Chatbot Backend"))


const port = process.env.PORT


const server = http.createServer(app)


const io = socketIO(server)

io.on('connection', (socket) => {
    console.log("connected")
    socket.on('joined', ({ user }) => {
        users[socket.id] = user
        socket.emit('welcome', { user: users[socket.id], message: "Welcome to Chatbot",id:socket.id })
        socket.broadcast.emit('userjoin', { user: 'Admin', message: users[socket.id] + " has joined" })
        socket.on('disconnect',()=>{
            socket.broadcast.emit('leave',{user:"Admin" ,message:users[socket.id]+ ' has left chat'})
        })
    })
    
    socket.on('sendmessage',({id,messagetosent})=>{
        io.emit('recieved',{user:users[id],message:messagetosent,id})
    })


})

server.listen(port, () => console.log(`App is running on http://localhost:${port}`))

