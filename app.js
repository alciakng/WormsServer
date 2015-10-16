
/**
 * Module dependencies.
 */

global.controller = function(name) { 
    return require(__dirname + '/controller/' + name); 
} 

global.config = function(name){
	return require(__dirname + '/config/'+name);
}

global.model = function(name){
	return require(__dirname + '/model/'+name);
}

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , mongoose =require('mongoose')
  , path = require('path')
  , uriUtil =require('mongodb-uri')
  , user = model('user.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//db 연결
//todo : mongodb-uri를 이용한 uriUtil과 options값의 socketOptions가 무엇인지?
var connect = function () {
	 // var uristring = process.env.MONGOLAB_URI||process.env.MONGOHQ_URI||"mongodb://localhost:27017/NetmarbleProject";
	 // var mongooseUri = uriUtil.formatMongoose(uristring);
	  var options = { server: { socketOptions: { keepAlive: 1 } }};

	  mongoose.connect("mongodb://kjhweb:kosaf46231@ds041150.mongolab.com:41150/heroku_f7pw190c", options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);


var httpserver =http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(httpserver);


global.roomList = {};
global.playerList = {};


var authController = controller('authController');
var lobbyController = controller('lobbyController');
var roomController = controller('roomController');
var playerController = controller('playerController');

	
io.sockets.on('connection',function(socket){
	   console.log("연결됨"); 
	  
	  //authController router
		  //회원가입.
		  socket.on('req_signUp',function(data){
			  authController.signUp(socket,data);
		  });
		  //로그인.
		  socket.on('req_login',function(data){
			  authController.login(socket,data);
		  });
		  
		  //로그아웃.
		  socket.on('req_logout',function(){
			  authController.logout(socket); 
		  });
		  
		  //연결이 끊어진 경우.
		  socket.on('disconnect', function(){
			  //접속끊김.
			  authController.disconnect(io,socket);
		  });
		  
	  
		  
		 
	  //lobbyController router
		  //글로벌 채팅
		  socket.on('req_global_chat',function(data){
			  lobbyController.chat(socket,data);
		  })
		  
		  socket.on("req_to_lobby",function(data){
			  console.log("로비로 요청");
			  console.log(roomList[socket.room].playerCount);
			  
			  lobbyController.toLobby(io,socket,data);
			 /* 
			  setTimeout(function() {
				  if(data.isVictory) roomController.leaveRoom(io,socket);
				  else socket.emit("ack_leave_room");
			  }, 500);
			  */
		  });
		  

	  //roomController router 	  
		  //방 생성
		  socket.on("req_create_room",function(data){
			  roomController.createRoom(io,socket,data);
		  });
		  
		  //방정보 업데이트
		  socket.on("req_update_room_info",function(data){
			  roomController.updateRoomInfo(io,socket,data);
		  });
		  
		  //방 입장
		  socket.on("req_join_room",function(data){
			  roomController.joinRoom(io,socket,data);
		  });
		  
		  //방 나가기
		  socket.on("req_leave_room",function(data){
			 roomController.leaveRoom(io,socket,data);
		  });
		  
		  //방 채팅
		  socket.on("req_room_chat",function(data){
			  roomController.chat(io,socket,data);
		  });
		  
		  //게임 스타트
		  socket.on("req_start",function(data){
			 roomController.start(io,socket,data); 
		  });
		  
		  
		  socket.on("req_turn_change",function(){
			  console.log("턴체인지 요청");
			  roomController.turnChange(io,socket);
		  });
		  
		  
		  

	 //playerController router
		  
		  socket.on('req_move_gravity',function(data){
			  console.log("중력 이동 요청");
			  io.sockets.in(socket.room).emit("ack_move_gravity",{player:playerList[socket.id]});
		  })
		  
		  socket.on('req_player_position_sync',function(data){
			  playerController.positionSync(io,socket,data); 
		  });
		  
		  
		  socket.on('req_move_left',function(){
			  playerController.moveLeft(io,socket);
		  });
		  
		  socket.on('req_move_right',function(){
			  playerController.moveRight(io,socket);
		  });
		  
		  socket.on('req_move_stop',function(data){
			  playerController.moveStop(io,socket,data);
		  });
		  
		  socket.on('req_jump',function(){
			  playerController.jump(io,socket);
		  });
		  
		  /*
		  socket.on('req_jump_stop',function(){ 
			 // console.log("점프 중지 요청");
			  
			  io.sockets.in(socket.room).emit("ack_jump_stop",{player:playerList[socket.id]});
		  });
		  */
		  	  
		  socket.on('req_set_target',function(){
			  playerController.setTarget(io,socket);
		  });
		  
		  
		  
		  socket.on('req_unset_target',function(){
			  playerController.unsetTarget(io,socket);
		  })
		  
		  
		  socket.on('req_update_target',function(data){
			 playerController.updateTarget(io,socket,data);
		  });
		  
		  
		  socket.on("req_set_marker",function(){

			  playerController.setMarker(io,socket);
		  });
		  
		  socket.on("req_unset_marker",function(){
	
			  playerController.unsetMarker(io,socket);
		  });
		  
		  socket.on("req_update_marker",function(data){

			  playerController.updateMarker(io,socket,data);
		  });
		 
		  socket.on('req_update_shoot_detection',function(data){
			 playerController.updateShootDetection(io,socket,data);
		  });
		  /*
		  socket.on('req_update_shooting',function(data){
			  console.log("발사 업데이트");
			  io.sockets.in(socket.room).emit("ack_update_shooting",{player:playerList[socket.id],isShoot:data.isShoot});
		  });
		  */
		  
		  
		  socket.on("req_shoot",function(data){
			  playerController.shoot(io,socket,data);
		  });
		  
		  
		  socket.on('req_set_bazooka',function(){
			  playerController.setBazooka(io,socket);
		  })
		  
		  socket.on('req_unset_bazooka',function(){
			  playerController.unsetBazooka(io,socket);
		  });
		  
		  socket.on('req_set_bomb',function(){
			  playerController.setBomb(io,socket);
		  });
		  
		  socket.on('req_unset_bomb',function(){
			  console.log("수류탄 언셋");
			  io.sockets.in(socket.room).emit("ack_unset_bomb",{player:playerList[socket.id]});
		  });
		  
		  socket.on('req_set_bat',function(){
			  playerController.setBat(io,socket);
		  });
		  
		  socket.on('req_unset_bat',function(){
			 playerController.unsetBat(io,socket);
		  });
		  
		  socket.on('req_batting',function(){
			  playerController.batting(io,socket);
		  });
		  
		  socket.on('req_player_batted',function(data){
			  playerController.playerBatted(io,socket,data);  
		  })
		  
		  socket.on('req_set_jetpack',function(){
			  playerController.setJetpack(io,socket);
		  });
		  
		  socket.on('req_unset_jetpack',function(){
			  playerController.unsetJetpack(io,socket);
		  });
		  
		  socket.on('req_update_jetpack',function(){
			  playerController.updateJetpack(io,socket);
		  });
		  
		  socket.on("req_set_sheep",function(){
			  playerController.setSheep(io,socket);
		  });
		  socket.on("req_unset_sheep",function(){
			  playerController.unsetSheep(io,socket);
		  });
	  
		  socket.on("req_shoot_sheep",function(data){
			  playerController.shootSheep(io,socket,data);
		  });
		  
		  socket.on("req_sheep_dir_right",function(){
			  playerController.sheepDirRight(io,socket);
		  })
		  
		  socket.on("req_sheep_dir_left",function(){
			  playerController.sheepDirLeft(io,socket);
		  })
		  
		  socket.on("req_supersheep_rotation_right",function(){
			  playerController.supersheepRotationRight(io,socket);  
		  })
		  
		  socket.on("req_supersheep_rotation_left",function(){
			  playerController.supersheepRotationLeft(io,socket);
		  })
		  
		  socket.on("req_sheep_jump",function(){
			  playerController.sheepJump(io,socket);
		  })
		  
		  socket.on("req_sync_sheep",function(data){
			  playerController.syncSheep(io,socket,data);
		  })
		  
		  socket.on("req_explode_sheep",function(){
			  playerController.explodeSheep(io,socket);
		  });
		  
		  socket.on("req_explode_supersheep",function(){
			  playerController.explodeSuperSheep(io,socket);
		  });
		  
		  socket.on("req_set_donkey",function(){
			  playerController.setDonkey(io,socket);
		  });
		  
	
		  socket.on("req_unset_donkey",function(){
			  playerController.unsetDonkey(io,socket);
		  });
		  
		  socket.on("req_shoot_donkey",function(){
			  playerController.shootDonkey(io,socket);
		  });
		  
		  socket.on("req_destroy_donkey",function(data){
			  playerController.destroyDonkey(io,socket,data);
		  });
		  
		  socket.on("req_set_hbomb",function(){
			  playerController.setHbomb(io,socket);
		  });
		  
		  socket.on("req_unset_hbomb",function(){
			  playerController.unsetHbomb(io,socket);
		  });
		  
		  socket.on("req_set_teleport",function(){
			  playerController.setTeleport(io,socket);
		  });
		  
		  socket.on("req_unset_teleport",function(){
			  playerController.unsetTeleport(io,socket);
		  });
		  
		  socket.on("req_teleporting",function(){
			  playerController.teleporting(io,socket);
		  });
		  
		  socket.on("req_set_rope",function(){
			  playerController.setRope(io,socket);
		  });
		  
		  socket.on("req_unset_rope",function(){
			  playerController.unsetRope(io,socket);
		  });
		  
		  socket.on("req_shoot_rope",function(){
			  playerController.shootRope(io,socket); 
		  });
		  
		  socket.on("req_rope_jump",function(){
			  playerController.ropeJump(io,socket);
		  });
		  
		  socket.on("req_rope_down",function(){
			  playerController.ropeDown(io,socket);
		  });
		  
		  socket.on("req_rope_up",function(){
			  playerController.ropeUp(io,socket);
		  });
		  
		  
		  
		  
		/*
		  socket.on('req_fire',function(data){
			  console.log(data.id+"플레이어 총알발사!");
			  io.sockets.in(socket.room).emit("ack_fire",{player:playerList[socket.id]});
		  });
		*/
		  
		  socket.on("req_destroy_ground",function(data){
			  playerController.destroyGround(io,socket,data);
		  })
		  
		  socket.on("req_take_damage",function(data){
			  console.log(playerList[socket.id].id);
			  console.log(data);
			  
			  playerController.takeDamage(io,socket,data);
		  })
		  
		  socket.on("req_player_dead",function(){
			  playerController.dead(io,socket);
		  });
});






