//msg
var msg = config('msg');


var roomController = controller('roomController');

//회원가입
exports.chat = function(socket,data){
	console.log("글로벌 채팅 요청 ");
	
	socket.emit('ack_global_chat',{id:playerList[socket.id].id,input:data.input});
	socket.broadcast.emit('ack_global_chat',{id:playerList[socket.id].id,input:data.input});
};

//toLobby
exports.toLobby = function(io,socket,data){
	socket.emit("ack_to_lobby");
	
	setTimeout(function() {
		//방 퇴장.
		roomController.leaveRoom(io,socket);
		
		socket.emit("ack_update_info",{playerList:playerList,roomList:roomList});
	    socket.broadcast.emit("ack_update_info",{playerList:playerList});
	}, 500);

}	


