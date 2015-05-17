var Friends = function(social, user){
  if(!(this instanceof Friends)) return new Friends(social, user);

  this.social = social;
  this.user = user;



}

Friends.prototype = {
  social: null,
  user: null,

  //Load Client Events
  loadEvents: function(){

  }
}

module.exports = Friends;
