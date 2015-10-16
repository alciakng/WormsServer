

//몽고db
var mongoose = require('mongoose');
//암호화 모듈
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;


var UserSchema = new Schema({
	  id: { type: String},
	  hashed_password: { type: String}
});


//UserSchema virtual
UserSchema
.virtual('password')
.set(function(password) {
  this._password = password;
  this.hashed_password = bcrypt.hashSync(password);
})
.get(function() { return this._password });


//UserShema methods
UserSchema.methods = {
	      //사용자 인증
		  authenticate:function (password) {
		    return bcrypt.compareSync(password,this.hashed_password);
		  }
}

//UserChema static methods
UserSchema.statics = {
		  load: function (criteria, cb) {
		    this.findOne(criteria)
		      .exec(cb);
		  }
}

mongoose.model('User', UserSchema);