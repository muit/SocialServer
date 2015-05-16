
User = function(socket, username, password){
  if(!this instanceof User) return new User(socket, username, password);
  var self = this;

  //Check empty strings
  if(username == "" || password == ""){
    socket.emit("login", {error: "true", message: "Empty Credentials"});
    return;
  }

  //Autentification here
  Models.User.find({
    name: username,
    password: password
  }, function (err, ids) {
    if(err){
      console.log(err);
      socket.emit("login", {error: "true", message: "There was an error"});
    }
    else if(ids.length <= 0)
    {
      socket.emit("login", {error: "true", message: "Incorrect Credentials"});
    }
    else
    {
      self.userModel = nohm.factory('User', ids[0], function (err) {
        if (err === 'not found') {
          console.log('No user with id '+ids[0]+' found :-(');
          socket.emit("login", {error: "true", message: "Incorrect Credentials"});
        } else if (err) {
          console.log(err); // database or unknown error
          socket.emit("login", {error: "true", message: "There was an error"});
        } else {
          console.log("  '"+name+"' logged in.");
          socket.emit("login", {error: "false", message: "Logged in"});
          self.connected = true;
          self.name = username;
        }
      });
    }
  });
}

User.prototype = {
  connected: false,
  name: "",
  userModel: null,
  logout: function(){
    this.connected = false;
  }
}

//Static User
User.Registry = function(name, email, password, socket){
  var user = nohm.factory('User');

  user.p({
    name: name,
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
      console.log('New user: '+name);
    }
  });
}

User.Login = function(socket, name, password){
  return new User(socket, name, password);
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