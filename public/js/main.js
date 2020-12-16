
const chatMessage = document.getElementById('chat-form');
const chatBlock = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const typing = document.getElementById('typing');
const input_msg = document.getElementById('msg');
const chat_content = document.getElementById('chat-content');





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
 
  //  console.log(message);
    OutputMessage(message);

    chatBlock.scrollTop = chatBlock.scrollHeight;


    
});

socket.on('Notification',(user) =>{ // receives the message from the server and message is the parameter
 

  OutputNotification(user);

  
});

input_msg.addEventListener("input", (e)=>{
  //console.log("Typing");
  socket.emit('gettyper',username);

  socket.on('showTyper', (user) => {
   
    outputTyper(user);
  });

  
});

input_msg.addEventListener("keyup", (event)=>{
 
  var key = event.keyCode || event.charCode;

  if( key == 8 || key == 46 ){
    // console.log("kk");
    if(input_msg.value === ''){
   // console.log("is empty");
    typing.innerHTML = '';
  }
}
 

  
});


// input_msg.addEventListener("keyup", (e)=>{
//   console.log("Not Typing");
//   typing.innerHTML = '';
  
// });

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
    div.innerHTML = ` <p class="meta d-flex"> ${escapeHtml(Message.username)} <span class="ml-auto meta-time">  ${Message.time} </span></p>
    <p class="text">  ${escapeHtml(Message.message)}
       
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
    console.log(room);
  }

  // Add users to DOM
function outputUsers(users) {

  
    userList.innerHTML = '';
    var onlineUsers = '';

    users.forEach((user,index)=>{

      onlineUsers += ` <li class="nav-item">
      <a class="nav-link user-display" href="#"> ${user.username} </a>
    </li>

`; 
     
     
    });

    userList.innerHTML = onlineUsers;   // appending a new li for every user 

   }
  

   // Typing
function outputTyper(user) {
  if(input_msg != ''){
    let type_msg = `${escapeHtml(user)} is Typing...`;
    typing.innerHTML = type_msg;
  }else{
    typing.innerHTML = '';
  }
  
}




function OutputNotification(user){

console.log("notification");
  var notification = user.message;
  Push.create(`${escapeHtml(user.username)}`, {
    body: `${escapeHtml(user.message)}`,
    icon: './Snipelogo.png',
    timeout: 3000,
    onClick: function () {
        window.focus();
        this.close();
    }
});
 
}
