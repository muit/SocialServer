
var User = function(social, socket, username, password){
  if(!this instanceof User) return new User(social, socket, username, password);
  var self = this;
  self.social = social;

  if(User.loggedNames[username] != null){
    socket.emit("login", {error: "true", message: "Somebody else is connected at the same time."});
    return;
  }

  //Autentification here
  Models.User.findAndLoad({
    name: username,
    password: password
  }, function (err, users) {
    if(err && err != "not found"){
      console.log(err);
      socket.emit("login", {error: "true", message: "There was an error"});
    }
    else if(users.length <= 0)
    {
      socket.emit("login", {error: "true", message: "Incorrect Credentials"});
    }
    else if(users[0] != null)
    {
      //User Logged In

      console.log("  '"+username+"' logged in.");
      socket.emit("login", {error: "false", message: "Logged in"});
      self.connected = true;
      self.name = username;
      User.loggedNames[username] = true;

      //Load Modules
      self.modules = {};
      for(var index in Modules) {
        self.modules[index] = new Modules[index](social, self);
        self.modules[index].loadEvents();
      }
    }
  });

  this.socket = socket;
}

User.prototype = {
  socket: null,
  modules: {},

  connected: false,
  name: "",
  userModel: null,

  logout: function(){
    this.connected = false;
    User.loggedNames[this.name] = null;
  }
}

//Static User
User.Register = function(name, email, password, socket){
  var user = nohm.factory('User');

  user.p({
    name: name,
    email: email,
    password: password
  });


  user.save(function (err) {
    if (err === 'invalid') {
      socket.emit("register", {error: "true", message: "Incorrect Values"});
    } else if (err) {
      // database or unknown error 
      console.log('Error: '+err);
      socket.emit("register", {error: "true", message: "There was an error"});
    } else {
    console.log("Registry for "+name);
      socket.emit("register", {error: "false", message: "Registered"});
      console.log('New user: '+name);
    }
  });
}

User.Login = function(social, socket, name, password){
  return new User(social, socket, name, password);
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

//Cache Sessions
User.loggedNames = {};

module.exports = User;
