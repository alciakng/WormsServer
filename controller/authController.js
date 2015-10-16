
//몽고db
var mongoose = require('mongoose'); 
//msg
var msg = config('msg');


var playerConfig = config('player');
var User = mongoose.model('User');

var roomController = controller('roomController');

//회원가입
exports.signUp = function(socket,data){
	console.log("회원가입 요청" + data.id);
	User.findOne({id:data.id},function(err,user){
		if(err){
			console.log(err);
			socket.emit("ack_signUp",new msg.msg("네트워크 에러!","fail"));
			return;
		}
		if(user){
			console.log("이미 존재하는 유저입니다.");
			socket.emit("ack_signUp",new msg.msg("이미 존재하는 유저입니다!","fail"));
			return;
		}
		else{
			var pushUser = new User(data);
			pushUser.save(function(err,user){
				if(err){
					socket.emit("ack_signUp",new msg.msg("네트워크 에러!","fail"));
				}
				socket.emit("ack_signUp",new msg.msg("회원가입 성공!","success"));
			})
		}
	})
};


//로그인
exports.login = function(socket,data){
	
	console.log("로그인 요청" + data.id);
	User.findOne({id:data.id},function(err,user){
		 if (err) {
			 console.log(err);
			 socket.emit("ack_login",new msg.msg("네트워크 에러!","fail"));
			 return;
		 }
	     if (!user) {
	        console.log("존재하지 않는 유저 입니다.");
	        socket.emit("ack_login",new msg.msg("존재하지 않는 유저 입니다!","fail"));
	        return;
	     }
	     if(!user.authenticate(data.password)){
	    	 console.log("비밀번호를 잘못 입력하였습니다.");
	    	 socket.emit("ack_login",new msg.msg("비밀번호를 잘못 입력하셨습니다!","fail"));
	    	 return;
	     }
	     console.log("로그인성공하였습니다.")
	     
	     //새로운 플레이어
	     var player = new playerConfig.player(data.id);
	     playerList[socket.id]=player;
	     console.log(playerList);
	     //todo : playerList 기반의 플레이어 추가
	     socket.emit("ack_login",new msg.msg(data.id,"success"));
	     
	     setTimeout(function() {
		     socket.emit("ack_update_info",{playerList:playerList,roomList:roomList});
		     socket.broadcast.emit("ack_update_info",{playerList:playerList,roomList:roomList});
	     },500);
	});
};


//로그아웃
exports.logout = function(socket){
	
	console.log("로그아웃");
	delete playerList[socket.id];	
	socket.leave(socket.room);
	
	socket.emit('ack_logout');
	
	socket.emit("ack_update_info",{playerList:playerList,roomList:roomList});
    socket.broadcast.emit("ack_update_info",{playerList:playerList,roomList:roomList});
}

exports.disconnect = function(io,socket){
	
	  console.log("연결끊김");
	  //플레이어 사망처리
	  io.sockets.in(socket.room).emit("ack_player_dead",{id:playerList[socket.id].id});
	  this.logout(socket);
	
	  if(socket.room!=undefined){
		  var currentTurn = roomList[socket.room].getCurrentTurn();
		  
		  roomController.leaveRoom(io,socket);
		  
		  if(currentTurn==socket.id){
			  roomController.turnChange(io,socket);
		  }
	  }
}




