const path = require('path')
const http = require('http')
const express = require('express')
require('./db/mongoose')
const socketio = require('socket.io')
const Message = require('./models/message')

const{ addUsers, getUsers, getUserInGroup, removeUser} = require('./utils/users')
const{ generateMessage, generateLocation } = require('./utils/message')
const messageRouter = require('./routers/messages')
const usersRouter = require('./routers/users')
const group_messagesRouter = require('./routers/group_messages')


const app = express()
const Server = http.createServer(app)
const io = socketio(Server)

const PORT = process.env.PORT || 5000
const pathToStaticDirectory = path.join(__dirname, '../public')

app.use(express.static(pathToStaticDirectory))
app.use(express.json())
app.use(usersRouter)
app.use(messageRouter)
app.use(group_messagesRouter)
app.use((req, res, next) => {
    const error = new Error("not found")
    error.status = 404
    next(error)
})
app.use((error, req, res, next) =>{
    res.status(error.status || 500)
    res.send({
        error:{
            message: error.message
        }

    })
})
// app.get('/chatt.html', (req, res) => {
//     Message.find({}).then((result) => {
//         res.render('chat', {result})
//     }).catch((e) => {
//         console.error(e)
//     })
// })

io.on('connection', (socket) => {
    console.log('new websocket connection')
    
        socket.on('join', ({username}, callback) => {
         
        const {error, user} = addUsers({id: socket.id, username, groupName: 'Unique-Group'})
        if (error) {
            return callback(error)
        }

        const msgToStore = {
            username: user.username,
            groupName: user.groupName,
            text: 'welcome',
        }
        const msg = new Message(msgToStore)
        msg.save().then((result) => {
            socket.emit('message', result)     
        })
        const msgToStores = {
            username: user.username,
            groupName: user.groupName,
            text: `user has joined`,
        }
        const msgs = new Message(msgToStores)
        msgs.save().then((result) => {
            
            socket.broadcast.emit('message', result)
            Message.find().then(result => {
                io.emit('old message', result)
            })
            
            io.emit('group', {
                groupName: user.groupName,
                users: getUserInGroup(user.groupName),
              
            })
            callback()
            
        })
        // socket.emit('message', generateMessage('admin', 'welcome'))
        // socket.broadcast.to(user.groupName).emit('message', generateMessage('admin', `${user.username} has joined`))
        // io.to(user.groupName).emit('group', {
        //     groupName: user.groupName,
        //     users: getUserInGroup(user.groupName)
        // })


        // callback()
    })
    
    

    socket.on('sendMessage', (message, callback) => {
        const user = getUsers(socket.id)
        const messageToStore = {
            username: user.username,
            groupName: user.groupName,
            text: message
        }
        const msg = new Message(messageToStore)
        msg.save().then((result) => {
            io.emit('message', result) 
            
            callback()
        })
        // io.to(user.groupName).emit('message', generateMessage(user.username, message))

       

    })
    socket.on('sendLocation', (coords, callback) => {
        const user = getUsers(socket.id)
        const messageToStore = {
            username: user.username,
            groupName: user.groupName,
            text: `https://google.com/maps?q=${coords.latitude}, ${coords.longitude}`
        }
        const msg = new Message(messageToStore)
        msg.save().then((result) => {
            io.to(user.groupName).emit('locationMessage', result)
            console.log(done)
            callback()
        })
        // io.to(user.groupName).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${coords.latitude}, ${coords.longitude}`))

    })
    // socket.on( 'get-history-message', (groupName) => {
    //     const none = Message.find({groupName}).then((result) => {
    //        io.emit('group-message', result)
    //     })
    //     console.log(none)
    // })
    
    socket.on('disconnect', ()=> {
        const user = removeUser(socket.id)
        if (user) {
           
            io.to(user.groupName).emit('message', generateMessage('admin',`${user.username} has left`))
            io.to(user.groupName).emit('group', {
                groupName: user.groupName,
                users: getUserInGroup(user.groupName)
            })
        }
       
    })

})
Server.listen(PORT, () => {
    console.log(`listen on the port ${PORT}`)
})

    
    

