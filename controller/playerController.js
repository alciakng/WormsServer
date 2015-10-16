



exports.positionSync = function(io,socket,data){
	console.log("포지션 싱크 요청");
	socket.emit('ack_player_position_sync',data);
}


exports.moveLeft = function(io,socket){
	  console.log("왼쪽 이동 요청");
	  console.log(playerList[socket.id]);
	  io.sockets.in(socket.room).emit("ack_move_left",{player:playerList[socket.id]});
}

exports.moveRight = function(io,socket){
	
	  console.log("오른쪽 이동 요청");
	  io.sockets.in(socket.room).emit("ack_move_right",{player:playerList[socket.id]});
}

exports.moveStop = function(io,socket,data){
	  console.log("정지 요청");
	  
	  var player = playerList[socket.id];
	  
	  player.moveDir = data.moveDir;
	  
	  player.playerPositionX = data.playerPositionX;
	  player.playerPositionY = data.playerPositionY;
	  
	  //player.syncTime = data.syncTime;
	  
	  io.sockets.in(socket.room).emit("ack_move_stop",{player:playerList[socket.id]});
}

exports.jump = function(io,socket){
      console.log("점프 요청");
	  io.sockets.in(socket.room).emit("ack_jump",{player:playerList[socket.id]});
}


exports.setTarget = function(io,socket){
	
      console.log('타겟팅 요청');
      io.sockets.in(socket.room).emit("ack_set_target",{player:playerList[socket.id]});
}

exports.unsetTarget = function(io,socket){
	
	  console.log('타겟팅 언셋 요청');
	  io.sockets.in(socket.room).emit("ack_unset_target",{player:playerList[socket.id]});
}

exports.updateTarget = function(io,socket,data){
	  
	//  console.log("타겟팅 갱신");
	  playerList[socket.id].shootVectorX = data.shootVectorX;
	  playerList[socket.id].shootVectorY = data.shootVectorY;
	  io.sockets.in(socket.room).emit("ack_update_target",{player:playerList[socket.id]});
}

exports.setMarker = function(io,socket){
	console.log("마커 셋");
	io.sockets.in(socket.room).emit("ack_set_marker",{id:playerList[socket.id].id});
}

exports.unsetMarker = function(io,socket){
	console.log("마커 셋");
	io.sockets.in(socket.room).emit("ack_unset_marker",{id:playerList[socket.id].id});
}

exports.updateMarker = function(io,socket,data){
	
	console.log("업데이트 마커");
	console.log("마커 x:" +data.markerPositionX);
	console.log("마커 y:" +data.markerPositionY);
	playerList[socket.id].markerPositionX = data.markerPositionX;
	playerList[socket.id].markerPositionY = data.markerPositionY;
	
	io.sockets.in(socket.room).emit("ack_update_marker",{id:playerList[socket.id].id,markerPositionX : data.markerPositionX,markerPositionY : data.markerPositionY});
}

exports.updateShootDetection = function(io,socket,data){
	  console.log("디텍션 갱신");
	  console.log(data);
	  io.sockets.in(socket.room).emit("ack_update_shoot_detection",{player:playerList[socket.id],isDetected:data.isDetected});
}


exports.shoot = function(io,socket,data){
	 console.log("발사");
	 playerList[socket.id].timeShooting = data.timeShooting;
	 playerList[socket.id].weapon = data.weapon;
	 io.sockets.in(socket.room).emit("ack_shoot",{player:playerList[socket.id]});
}

exports.setBazooka = function(io,socket){
	  console.log("바주카 셋");
	  io.sockets.in(socket.room).emit("ack_set_bazooka",{player:playerList[socket.id]});
}

exports.unsetBazooka = function(io,socket){
	  console.log("바주카 언셋");
	  io.sockets.in(socket.room).emit("ack_unset_bazooka",{player:playerList[socket.id]});
}

exports.setBomb = function(io,socket){
	 console.log("수류탄 셋");
	 io.sockets.in(socket.room).emit("ack_set_bomb",{player:playerList[socket.id]});
}

exports.unsetBomb = function(io,socket){
	
	
}

exports.setBat = function(io,socket){
	  console.log('야구배트 셋');
	  io.sockets.in(socket.room).emit("ack_set_bat",{player:playerList[socket.id]});
}

exports.unsetBat = function(io,socket){
	 console.log('야구배트 언셋');
	 io.sockets.in(socket.room).emit("ack_unset_bat",{player:playerList[socket.id]});
}

exports.batting =function(io,socket){
	 console.log("야구방항이 후리기");
	 io.sockets.in(socket.room).emit("ack_batting",{player:playerList[socket.id]});
}

exports.playerBatted = function(io,socket,data){
	 io.sockets.in(socket.room).emit("ack_player_batted",data);
}

exports.setJetpack = function(io,socket){
	 console.log("젯트팩 장착");
	 io.sockets.in(socket.room).emit("ack_set_jetpack",{player:playerList[socket.id]});
}

exports.unsetJetpack = function(io,socket){
	io.sockets.in(socket.room).emit("ack_unset_jetpack",{player:playerList[socket.id]});
};

exports.updateJetpack = function(io,socket){
	io.sockets.in(socket.room).emit("ack_update_jetpack",{player:playerList[socket.id]});
}

exports.setSheep = function(io,socket){
	console.log("양 장착");
	io.sockets.in(socket.room).emit("ack_set_sheep",{id:playerList[socket.id].id});
}

exports.unsetSheep = function(io,socket){
	console.log("양 해체");
	io.sockets.in(socket.room).emit("ack_unset_sheep",{id:playerList[socket.id].id});
}

exports.shootSheep = function(io,socket,data){
	console.log("양 발사");
	io.sockets.in(socket.room).emit("ack_shoot_sheep",{id:playerList[socket.id].id,type:data.type});
}

exports.sheepDirRight = function(io,socket){
	console.log("양 오른쪽 이동");
	io.sockets.in(socket.room).emit("ack_sheep_dir_right",{id:playerList[socket.id].id,sheepDir:1});
}

exports.sheepDirLeft = function(io,socket){
	console.log("양 왼쪽 이동");
	io.sockets.in(socket.room).emit("ack_sheep_dir_left",{id:playerList[socket.id].id,sheepDir:-1});
}

exports.supersheepRotationRight = function(io,socket){
	console.log("수퍼양 오른쪽 회전");
	io.sockets.in(socket.room).emit("ack_supersheep_rotation_right",{id:playerList[socket.id].id});
}

exports.supersheepRotationLeft = function(io,socket){
	console.log("수퍼양 왼쪽 회전");
	io.sockets.in(socket.room).emit("ack_supersheep_rotation_left",{id:playerList[socket.id].id});
}

exports.sheepJump = function(io,socket){
	console.log("양 점프요청");
	io.sockets.in(socket.room).emit("ack_sheep_jump",{id:playerList[socket.id].id});
}

exports.explodeSheep = function(io,socket){
	console.log("양 폭파");
	io.sockets.in(socket.room).emit("ack_explode_sheep",{id:playerList[socket.id].id});
}

exports.explodeSuperSheep = function(io,socket){
	console.log("수퍼 양 폭파");
	io.sockets.in(socket.room).emit("ack_explode_supersheep",{id:playerList[socket.id].id})
};

exports.syncSheep = function(io,socket,data){
	console.log("양 동기화");
	io.sockets.in(socket.room).emit("ack_sync_sheep",data);
}


exports.setDonkey = function(io,socket){
	console.log("당나귀 셋");
	io.sockets.in(socket.room).emit("ack_set_donkey",{id:playerList[socket.id].id});
}

exports.unsetDonkey = function(io,socket){
	console.log("당나귀 언셋");
	io.sockets.in(socket.room).emit("ack_unset_donkey",{id:playerList[socket.id].id});
}

exports.shootDonkey = function(io,socket){
	console.log("당나귀 발사");
	io.sockets.in(socket.room).emit("ack_shoot_donkey",{id:playerList[socket.id].id,markerPositionX:playerList[socket.id].markerPositionX,markerPositionY:playerList[socket.id].markerPositionY});
}

exports.destroyDonkey = function(io,socket,data){
	console.log("당나귀 제거");
	io.sockets.in(socket.room).emit("ack_destroy_donkey",{name:data.name});
}

exports.setHbomb = function(io,socket){
	console.log("할렐루야 폭탄 셋");
	io.sockets.in(socket.room).emit("ack_set_hbomb",{id:playerList[socket.id].id});
}

exports.unsetHbomb = function(io,socket){
	console.log("할렐루야 폭탄 언셋");
	io.sockets.in(socket.room).emit("ack_unset_hbomb",{id:playerList[socket.id].id});
}

exports.setTeleport = function(io,socket){
	console.log("텔레포트 셋");
	io.sockets.in(socket.room).emit("ack_set_teleport",{id:playerList[socket.id].id});
}

exports.unsetTeleport = function(io,socket){
	console.log("텔레포트 언셋");
	io.sockets.in(socket.room).emit("ack_unset_teleport",{id:playerList[socket.id].id});
}

exports.teleporting = function(io,socket){
	console.log("텔레포팅");
	io.sockets.in(socket.room).emit("ack_teleporting",{id:playerList[socket.id].id,markerPositionX:playerList[socket.id].markerPositionX,markerPositionY:playerList[socket.id].markerPositionY});
}

exports.setRope = function(io,socket){
	console.log("로프장착");
	io.sockets.in(socket.room).emit("ack_set_rope",{id:playerList[socket.id].id});
}

exports.unsetRope = function(io,socket){
	console.log("로프 장착 해제");
	io.sockets.in(socket.room).emit("ack_unset_rope",{id:playerList[socket.id].id});
}

exports.shootRope = function(io,socket){
	console.log("슛 로프");
	io.sockets.in(socket.room).emit("ack_shoot_rope",{player:playerList[socket.id]});
};

exports.ropeJump = function(io,socket){
	console.log("로프 점프");
	io.sockets.in(socket.room).emit("ack_rope_jump",{id:playerList[socket.id].id});
};

exports.ropeDown = function(io,socket){
	console.log("로프 다운");
	io.sockets.in(socket.room).emit("ack_rope_down",{id:playerList[socket.id].id});
};

exports.ropeUp = function(io,socket){
	console.log("로프 업");
	io.sockets.in(socket.room).emit("ack_rope_up",{id:playerList[socket.id].id});
};

exports.destroyGround = function(io,socket,data){
	console.log("땅 파괴");
	io.sockets.in(socket.room).emit("ack_destroy_ground",data);
}

exports.takeDamage = function(io,socket,data){
	console.log("플레이어 데미지 입음");
	
	//데미지 가함.
	roomList[socket.room].players[data.socketid].takeDamage(data.damage);
}


exports.dead = function(io,socket){
	
	  console.log("플레이어 사망");
	  
	  delete roomList[socket.room].players[socket.id];
	  roomList[socket.room].playerCount--;
	  
	  console.log(roomList[socket.room].getLastPlayer());
	  console.log(playerList[socket.id].id);
	  //승리처리
	  if(roomList[socket.room].playerCount==1) io.to(roomList[socket.room].getLastPlayer()).emit("ack_player_victory");
	  //패배처리
	  socket.emit("ack_player_dead");
	  
}