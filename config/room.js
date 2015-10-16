exports.room = function(_name){
	
	this.name=_name;
	this.playerCount =0;
	this.players = {};
	this.roomState = "WAITING";
	this.turnCount=-1;
	
	
	this.getCurrentTurn = function()
	{
		var keysbyindex = Object.keys(this.players);
		
		return keysbyindex[this.turnCount];
	}
	
	this.getTurn = function()
	{
		var keysbyindex = Object.keys(this.players);
		
		this.turnCount = ((this.turnCount+1)%this.playerCount);
		
		return keysbyindex[this.turnCount];
	}
	
	this.getLastPlayer = function()
	{
		var keysbyindex = Object.keys(this.players);
		return keysbyindex[0];
	}
	
	this.killPlayer = function(socketid){
		 delete this.players[socketid];
		 this.playerCount--;
	}
	
}
