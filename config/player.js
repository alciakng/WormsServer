/**
 * 
 */

exports.player = function(_id){
	//id
	this.id = _id;
	//룸 정보
	this.room;
	//체력
	this.hp=100;
	//플레이어 이동방향
	this.moveDir;
	//플레이어 포지션
	this.playerPositionX;
	this.playerPositionY;
	//syncTime
	this.syncTime;
	//야구배트 각
	this.batAngleX;
	this.batAngleY;
	//슛팅 각
	this.shootAngle;
	this.shootVectorX;
	this.shootVectorY;
	//슛팅 파워
	this.timeShooting;
	//shoot weapon
	this.weapon;
	//마커 포지션
	this.markerPositionX;
	this.markerPositionY;
	
	
	this.takeDamage=function(damage){
		this.hp-=damage;
	}
	
	this.setHp = function(_hp)
	{
		this.hp = _hp;
	}
	
	
	
}