var Chat = function(social, user){
  if(!(this instanceof Chat)) return new Chat(social, user);
  
  this.social = social;
  this.user = user;



}

Chat.prototype = {
  social: null,
  user: null,

  //Load Client Events
  loadEvents: function(){
    var self = this;

    this.user.socket.on("chat.globalMessage", function(message){
      social.io.emit("chat.globalMessage", {"username": self.user.name, "message": message});
    });
  }
}

module.exports = Chat;
