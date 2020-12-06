const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000; // environment variable env 

const path = require('path'); // core module of node , so no need to install 
const http = require('http');
const socketio = require('socket.io');
const FormatMessage = require('./utils/messages.js')
const {userJoin , getCurrentUser ,userLeave , getRoomUsers } = require('./utils/users.js')

const server = http.createServer(app); // getting the server from express to make sockets work 
const io = socketio(server);
const BotName = 'SnipeBot'
//Specify the app to use static files from public folder 
app.use(express.static(path.join(__dirname, 'public')));



//Listen for New Connection from Frontend

io.on('connection', (socket) =>{  //io.on listens for events , this is connection event and returns currently connected socket 

    socket.on('joinRoom',(username,room) =>{

        // console.log(username);
    // Send users and room info
  
        const user = userJoin(socket.id,username,room); // adds to array and returns back most recent added user 
       // console.log(user);

    
        socket.join(user.room) // join is provided by socket.io for joining a group or room 
        
        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)
        });


    socket.emit('message',FormatMessage(BotName,`Welcome To Snipe Chat, ${username}`)); // to the current user who is connected

    //Broadcast when a new user connects 
    socket.broadcast.to(user.room).emit('message',FormatMessage(BotName,`${user.username}  Has Joined The Chat, Say Hello !`)); // to all the users who are connected excluding the current one who connected 


    socket.on('ChatMessage',(msg)=>{
        // console.log(msg);
         io.to(user.room).emit('message',FormatMessage(`${user.username}`,msg)); // universal emit - to all users 
     });

     
    socket.on('disconnect', ()=>{

          const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message',FormatMessage(BotName, `${user.username} has left the chat`)); //Universal Emit 


       // Send users and room info
       io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)
      });

    }

    });


    });



//receieving message from client side 
   
});

server.listen(PORT, () => {
    console.log(`Snipe Server Started Running on Port ${PORT}`);
});