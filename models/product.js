var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var ProductSchema= new Schema({
	category: {type:Schema.Types.ObjectId, ref:'Category'},
	name: String,
	price: Number,
	image: String

})


//feature of mongosastic whc says that elastic search is running on 9200 port
ProductSchema.plugin(mongoosastic, {
	hosts:[
		'localhost:9200'

	]
});


module.exports = mongoose.model('Product',ProductSchema);