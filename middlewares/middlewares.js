var Cart = require('../models/cart');


module.exports = function(req,res,next) {

	if(req.user) { // first if it is a login user then create new var to store total of the product and then we user mongoose function to 
		// to search for owner who has same id as cart ,then if the cart exists loop cart item .length n then increment the total by the quantity of the products
		// then set it to a local var named cart then we cand use local var in the futre else if it 0 cart is not fond simply callback so that we can proceed to do the next action
		 var total = 0;
		 Cart.findOne({ owner: req.user._id}, function(err, cart ){
		 	if(cart) {
		 		for(var i=0; i<cart.items.length; i++) { 
		 			total+= cart.items[i].quantity;

		 		}
		 		res.locals.cart= total; //local var named cart // coz image we bot same items 3 times n there is no way for us to validate it that we just bot the same item for 3 times 
		 		//  in order to validate thtat, we have to loop the lenthg of the cart n then simply take the quantity vaule n put it in total var

		 	}else {
		 		res.locals.cart= 0;

		 	}
		 	 	next();
		 })
	} else {
		next();
	}
}