var global.nohm = nohm = require('nohm').Nohm;
var Redis = require('redis');
var SocketIO = require('socket.io');

var SocialServer = function(args){
	if(!this instanceof SocialServer) return new SocialServer(args);

	this.envelopment = args.env || "development";
	args.port = args.port || 14494;
	args.redis = args.redis || {};
	args.redis.url = args.redis.url || "127.0.0.1";
	args.redis.port = args.redis.port || 6379;


	/********
	 * Load *
	*********/
	redis = Redis.createClient(args.redis.port, args.redis.url);
	nohm.setClient(redis);
	console.log("\n## Redis connected at "+ args.redis.url + ":" + args.redis.port);

	//Load Schema
	require("../config/schema.js")(nohm);


	/*************
	 * Socket IO *
	**************/
	var io = SocketIO(args.port);

	io.on('connection', function (socket) {
		var user;

    socket.on('registry', function(name, email, password){
      User.Registry(name, email, password, socket);
    });

    socket.on('login', function(name, password){
      if(user && user.connected){//Check if is already loged in.
        socket.emit("login", "Already logged in");
        return;
      }

      user = User.Login(name, password);

      if(user && user.connected){
        socket.emit("login", "Logged in");
        console.log("  "+name+" logged in.");
      }
    });

    socket.on('logout', function(name, email, password){
      if(user && user.connected)
        user.logout();
    });

	  socket.on('disconnect', function () {
	    if(user && user.connected)
        user.logout();
	  });
	});
}

SocialServer.prototype = {

}

module.exports = SocialServer;