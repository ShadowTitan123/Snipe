const users = [];

function userJoin(id, username, room){

    const user = {id,username,room}; // getting all values from server 

    users.push(user); // array push 

    return user;  // returns a the user who just joined 
}


//Get Current User from

function getCurrentUser(id){

    return users.find(user => user.id === id);

}

//Get Current User from

function getCurrentUserByName(user_name){

  return users.find(user => user.username === user_name);

}


// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
  
  // Get room users
  function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }
  
  module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getCurrentUserByName
  };
  

