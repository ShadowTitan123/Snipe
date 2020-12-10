
var peer = new Peer(undefined,{
    secure: true, 
    host: 'https://snipe-chat.herokuapp.com/',
    port: 443,
});

// connecting to peer server running on port 3001 and specifing when to run and generate client id - /video



const socket = io(); // fires a new connection on every new tab 

const videoGrid = document.getElementById('video-grid');
const MyVideo = document.createElement('video');
const peers = {}  //empty object
MyVideo.muted = true;  // own microphone muted for us 

navigator.mediaDevices.getUserMedia({  // getting the browser info abt video and audio , once user accepts both 
video : true,
audio : true
}).then(stream =>{  //since its a promise we receive a stream on success
    AddVideoStream(MyVideo, stream); 
//receive calls
    peer.on('call',call =>{   // recieving a call and sending our stream to them 
        call.answer(stream);

        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
            AddVideoStream(video, userVideoStream);
        });
    })

    socket.on('ConnectedUser',user_id =>{
        // user is joining
        setTimeout(() => {
          // user joined
        ConnectToNewUser(user_id,stream); // when a new user joins , we pass his id and pass our video stream
        },3000)
    });

},err =>{
    console.log(err);
});




peer.on('open', (id) =>{
   
  //  alert(room_id);
        socket.emit('joinVideo',id,room_id); // emit user and room to server 



}); // once we get the client id , we are joining the room 


 socket.on('user-disconnect',user_id=>{

    if(peers[user_id]){
        peers[user_id].close();
    }

 })

//make call when new user connects
function ConnectToNewUser(user_id,stream){
    const call = peer.call(user_id,stream);  // we are making a call from our peer obj by passing the other user id(peer_id) and our stream, userid here is like the other user's phone number
    const video = document.createElement('video');

    call.on('stream',(userVideoStream) =>{ // when we make call , we send our stream , when they make call , we receive their stream (userVideoStream)
        AddVideoStream(video,userVideoStream);
    });
    call.on('close',()=>{
        video.remove();  // removing the video whose call got disconnected
    })
    
    peers[user_id] = call;
}

function AddVideoStream(video,stream){
    video.srcObject = stream;  // appending the currrent stream receieved via navigator obj to our src in video tag
    video.addEventListener('loadedmetadata',()=>{   // once video loads into our video tag , we play the video 
        video.play();
    })
    videoGrid.append(video); // appending the new video to the existing grid
  //  console.log(video);
}
