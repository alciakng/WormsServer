/**
 * 
 */
var roomConfig = config('room');


exports.createRoom = function(io,socket,data){
	
	var room = new roomConfig.room(data.roomname);
	room.players[socket.id]=playerList[socket.id];
	room.playerCount++;
	roomList[data.roomname]=room;
	
	console.log(roomList);
	console.log("[+] Room " + room.name + " created by " + playerList[socket.id]);
	

	socket.emit("ack_update_info",{playerList:playerList,roomList:roomList,room:roomList[data.roomname]});
    socket.broadcast.emit("ack_update_info",{playerList:playerList,roomList:roomList});
    
    socket.room= data.roomname;
    socket.join(data.roomname);
    
    socket.emit("ack_join_room");
	
	//player.leaveRoom();
	//player.joinRoom(room.name);
}


exports.joinRoom = function(io,socket,data){
	
	console.log(data.roomname+"방 입장 요청");
	
	roomList[data.roomname].players[socket.id]=playerList[socket.id];
	roomList[data.roomname].playerCount++;
	
	console.log(roomList[data.roomname]);
	
	socket.room = data.roomname;
	socket.join(data.roomname);
	
	socket.emit("ack_join_room");
	io.sockets.in(socket.room).emit('ack_update_info',{room:roomList[socket.room]});
}


exports.leaveRoom = function(io,socket){
	
	var room = roomList[socket.room];
	
	delete room.players[socket.id];
	room.playerCount--;
	
	console.log("1"+room);
	console.log(room);
	//플레이어가 모두 방을 빠져나간경우 방을 없앤다.
	if(room.playerCount==0){
		delete roomList[socket.room];
		//null이면 성공적으로 없어진 것.
		console.log("2"+roomList[socket.room]);
		socket.emit("ack_update_info",{roomList:roomList});
	}else{
	   //방에 있는 사람들의 룸 정보를 업데이트 해준다.
	   io.sockets.in(socket.room).emit("ack_update_info",{room:room});
	}
	
	//방을 나간다.
	socket.emit("ack_leave_room");
	socket.leave(socket.room);
	
	//로비에 있는 사람의 룸 리스트 정보를 업데이트한다.
	socket.broadcast.emit("ack_update_info",{roomList:roomList});
}


exports.chat = function(io,socket,data){
	io.sockets.in(socket.room).emit("ack_room_chat",{id:playerList[socket.id].id,input:data.input});
}

exports.start = function(io,socket,data){
	
	var room =roomList[socket.room];
	
	room.roomState="Playing";
	
	//임의 포지션 선정.
	for(var k in room.players){
		room.players[k].playerPositionX = 32 - (Math.random() *(2)).toFixed(3);
		room.players[k].playerPositionY = 52.5;
	}	
	
	io.sockets.in(socket.room).emit("ack_start",room.players);

	
	
	
	setTimeout(function() {
		var turn = room.getTurn();
		
		//바람세기 랜덤생성
		var wind = parseFloat((Math.random() *(7)).toFixed(3));
		console.log(wind);
		//다른 클라이언트들에게는 턴 중지.
		io.sockets.in(socket.room).emit("ack_turn_change",{state:false,wind : wind, turn:playerList[turn].id,players:room.players});
		//현재 턴인 클라이언트에게는 진행.
		io.to(turn).emit("ack_turn_change",{state:true, wind : wind, turn:playerList[turn].id,players:room.players});
		
	}, 1500);

}

exports.turnChange = function(io,socket){      
	
	var room = roomList[socket.room];
	var keysbyindex = Object.keys(room.players);
	
	console.log(room);
	console.log(room.players);
	
	//죽은 플레이어 처리.
	for(var i=0;i<room.playerCount;i++){
		var socketid = keysbyindex[i];
		console.log(socket.id);
		if(	room.players[socketid].hp<=0) {
			console.log(socket.id+"사망처리");
			room.killPlayer(socketid);
			//패배 처리
			io.sockets.in(socket.room).emit("ack_player_dead",{id:playerList[socketid].id});
		}
	}
	
	 //승리처리
	 if(room.playerCount==1) {
		 var lastPlayer = room.getLastPlayer();
		 io.sockets.in(socket.room).emit("ack_player_victory",{id:playerList[lastPlayer].id});
	 }
	 else if(room.playerCount==0){
		 console.log("비김");
	 }
	 else{
		 
		var turn = room.getTurn();
		console.log(playerList[turn].id+"플레이어의 턴입니다.");
		
		//바람세기 랜덤생성
		var wind = (Math.random() *(8)).toFixed(3)-7;
		console.log(wind);
		
		//다른 클라이언트들에게는 턴 중지.
		io.sockets.in(socket.room).emit("ack_turn_change",{state:false,wind : wind,turn:playerList[turn].id,players:room.players});
		//현재 턴인 클라이언트에게는 진행.
		io.to(turn).emit("ack_turn_change",{state:true,wind:wind,turn:playerList[turn].id,players:room.players});
	 }
	
}










