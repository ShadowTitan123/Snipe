const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000; // environment variable env 
const ejs = require('ejs');
const path = require('path'); // core module of node , so no need to install 
const http = require('http');
const socketio = require('socket.io');
const push = require('push.js');
const FormatMessage = require('./utils/messages.js')
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getCurrentUserByName } = require('./utils/users.js')

const server = http.createServer(app); // getting the server from express to make sockets work 
const io = socketio(server); // passing the express server to socketio
const BotName = 'SnipeBot'
const uuid = {v4: uuidV4} = require('uuid');
//Specify the app to use static files from public folder 
app.use(express.static(path.join(__dirname, 'public')));



//Listen for New Connection from Frontend

io.on('connection', (socket) => {  //io.on listens for events , this is connection event and returns currently connected socket 


  

    socket.on('joinRoom', (username, room) => {



        // console.log(username);
        // Send users and room info

        const user = userJoin(socket.id, username, room); // adds to array and returns back most recent added user 
        // console.log(user);


        socket.join(user.room) // join is provided by socket.io for joining a group or room 

        io.to(user.room).emit('roomUsers', {
            room: user.room, users: getRoomUsers(user.room)
        });




        socket.emit('message', FormatMessage(BotName, `Welcome To Snipe Chat, ${username}`)); // to the current user who is connected

        //Broadcast when a new user connects 
        socket.broadcast.to(user.room).emit('message', FormatMessage(BotName, `${user.username}  Has Joined The Chat, Say Hello !`)); // to all the users who are connected excluding the current one who connected




        socket.on('ChatMessage', (msg) => {
            // console.log(msg);
            io.to(user.room).emit('message', FormatMessage(`${user.username}`, msg)); // universal emit - to all users 


            //Notication 
            socket.broadcast.to(user.room).emit('Notification', FormatMessage(`${user.username}`, msg)); // to all the users who are connected excluding the current one who connected 
            //  console.log(user);
        });

        socket.on('gettyper', (username) => {
            const typer = getCurrentUserByName(username);
            //  io.to(user.room).emit('message',FormatMessage(`${user.username}`,msg)); // universal emit - to all users 
            io.to(user.room).emit('showTyper', typer.username)
        });


        socket.on('disconnect', () => {

            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit('message', FormatMessage(BotName, `${user.username} has left the chat`)); //Universal Emit 


                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room, users: getRoomUsers(user.room)
                });

            }



        });


     


    });


    socket.on('joinVideo',(user_id, room_id)=>{
        console.log('Video chat started -'+room_id);
            socket.join(room_id);

            socket.to(room_id).broadcast.emit('ConnectedUser',user_id);


    socket.on('disconnect',()=>{

        socket.to(room_id).broadcast.emit('user-disconnect',user_id);
    })

    });




    //receieving message from client side 

});

app.set('view engine','ejs');

app.get('/video',(req,res)=>{

    
    res.redirect(`/video/${uuidV4()}`);
    

});

app.get('/video/:room_id',(req,res)=>{

    res.render('video',{roomId : req.params.room_id }) // SEETING EJS variable HERE

});

server.listen(PORT, () => {
    console.log(`Snipe Server Started Running on Port ${PORT}`);
});