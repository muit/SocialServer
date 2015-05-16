nohm = require('nohm').Nohm;
var Redis = require('redis');
var SocketIO = require('socket.io');
var readline = require('readline');

//SocialServer modules
var User = require("./user");

var SocialServer = function(args){
	if(!(this instanceof SocialServer))
    return new SocialServer(args);
  console.log(this instanceof SocialServer);

  args = args || {};
	this.envelopment = args.env || "development";
	args.port = args.port || 4567;
  args.console = args.console || true;

	args.redis = args.redis || {};
	args.redis.url = args.redis.url || "127.0.0.1";
	args.redis.port = args.redis.port || 6379;

  this.config = args;

	/********
	 * Load *
	*********/
	redis = Redis.createClient(args.redis.port, args.redis.url);
	nohm.setClient(redis);
	console.log("[SocialServer] Redis connected at "+ args.redis.url + ":" + args.redis.port);

	//Load Schema
	require("../config/schema")();

  this.loadSocketIO();
  if(args.console == true)
    this.loadConsole();
}

SocialServer.prototype = {
  /*******************
   * Console Control *
   *******************/
  loadConsole: function(){
    var rl = readline.createInterface(process.stdin, process.stdout);

    rl.setPrompt('SocialServer-v'+SocialServer.version+'> ');

    rl.on('line', function(line) {
      if(line.length <= 0){
        rl.prompt();
        return;
      }

      var words = line.split(" ");
      switch(words[0]) {
        case "registry":
          User.Registry(words[1], words[2], words[3]);
          break;
        case "exit":
          process.exit(0);
          break;
        case "status":
          if(words[1] == "redis")
            console.log(redis);
          break;
        default:
          console.log('Say what? I might have heard `' + line.trim() + '`');
          break;
      }
      rl.prompt();
    }).on('close', function() {
      console.log("");
      process.exit(0);
    });
  },

  /*************
   * Socket IO *
  **************/
  io: null,
  loadSocketIO: function(){
    io = SocketIO({
      transports: ['websocket']
    });

    io.attach(this.config.port);

    console.log("[SocialServer] Listening on port "+this.config.port);

    io.on('connection', function (socket) {
      var user;

      console.log("Socket Connected.");

      socket.on('registry', function(name, email, password){
        User.Registry(name, email, password, socket);
      });

      socket.on('login', function(data){

        if(user && user.connected){//Check if is already loged in.
          socket.emit("login", {error: "true", message: "Already logged in"});
          return;
        }

        user = User.Login(socket, data.username, data.password);
      });

      socket.on('logout', function(name, email, password){
        if(user && user.connected)
          user.logout(); 
      }); 
 
      socket.on('disconnect', function () {
        console.log('Socket Disconnected.');
        if(user && user.connected)
          user.logout();
      });
    });
  }
}

SocialServer.version = "0.0.2";
module.exports = SocialServer;

