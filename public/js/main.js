
const chatMessage = document.getElementById('chat-form');
const chatBlock = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const typing = document.getElementById('typing');
const input_msg = document.getElementById('msg');



//destructuring varaible or combining  
const {username,room } =  Qs.parse(location.search,{
ignoreQueryPrefix : true   //  ignores all signs on url - & , = etc 
});

const socket = io(); // fires a new connection on every new tab 
//Join Room 
// console.log(username + room );

socket.emit('joinRoom',username,room); // emit user and room to server as a combined variable

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
   
    outputRoomName(room);
    outputUsers(users);
  });

socket.on('message',(message) =>{ // receives the message from the server and message is the parameter
    console.log(message);
    OutputMessage(message);


    //scroll down 

    chatBlock.scrollTop = chatBlock.scrollHeight;

    
});

input_msg.addEventListener("input", (e)=>{
  //console.log("Typing");
  socket.emit('gettyper',username);

  socket.on('showTyper', (user) => {
   
    outputTyper(user);
  });

  
});

chatMessage.addEventListener('submit',(e)=>{
e.preventDefault(); // since submit event submits data to file and page reloads / we are avoid that

const msg = e.target.elements.msg.value; // getting the value via event's target / msg is id here 
//console.log(msg);

//sending message to server
socket.emit('ChatMessage',msg);

//clear input after emit 

e.target.elements.msg.value = '';
e.target.elements.msg.focus(); 
typing.innerHTML = '';

});


function OutputMessage(Message){
    //Creating a div , add p in template string , then appending the child ( so that it comes after parent )
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `	<p class="meta" style="color:#9CC101";> ${Message.username} <span> ${Message.time} </span></p>  
    <p class="text">
        ${Message.message}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
    console.log(room);
  }

  // Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user=>{
      const li = document.createElement('li'); // creating li's according to available users in array 
      li.innerText = user.username;
      userList.appendChild(li);   // appending a new li for every user 
    });

   }
  

   // Typing
function outputTyper(user) {
  if(input_msg != ''){
    let type_msg = `${user} is Typing...`;
    typing.innerHTML = type_msg;
  }else{
 
    typing.innerHTML = '';
  }
  
}
