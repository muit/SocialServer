
User = function(username, password){
  if(!this instanceof User) return new User(username, password);
  this.connected = true;
}

User.prototype = {
  connected: false,
  logout: function(){
    this.connected = false;
  }
}

//Static User
User.Registry = function(username, email, password, socket){
  var user = global.nohm.factory('User');

  user.p({
    name: username,
    email: email,
    password: password
  });

  user.save(function (err) {
    if (err === 'invalid') {
      socket.emit("registry", 'invalid properties');
    } else if (err) {
      console.log(err); // database or unknown error 
      socket.emit("registry", "Unknown error.");
    } else {
      socket.emit("registry", "correct");
      console.log('New user: '+username);
    }
  });
}

User.Login = function(username, password){
  return new User(username, password);
}

User.Remove = function(userModel){
  var name = userModel.p.name;
  userModel.remove(function (err) {
    if (err) {
      console.log(err); // database or unknown error 
    } else {
      console.log('Removed user '+name);
    }
  });
}

module.exports = User