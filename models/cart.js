var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
	owner: { type: Schema.Types.ObjectId, ref:'User'}, //we added  2 obectid datatypes one is to refeer user anoter product
	//whenever user signup he will have cart of his own  
	total: {type: Number, default: 0}, // tottal price for cart 
	// array of items , we need to store all these items in array of obect so that it is easier to loop in the cart itself
	items:[{
		item:{type: Schema.Types.ObjectId, ref:'Product'},
		quantity: { type: Number, default: 1},
		price: { type: Number, default: 0},


	}]

});

module.exports= mongoose.model('Cart', CartSchema);

// to check wether the cart belongs to the same user check the id of cart n the user if its same its sucessful"57f594a31bf9dedc3011c1d9"
 //"57f594a31bf9dedc3011c1d8"
 	