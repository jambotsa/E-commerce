var router = require('express').Router();
var User= require('../models/user');
var Product = require('../models/product');
var Cart= require('../models/cart');


function paginate(req,res,next) {

	var perPage =9;
		var page = req.params.page;
		

		//multilpe mongoose methods 
		Product
			.find()
			.skip( perPage * page) // skip will skip to page no u click (9*2) it will skip 18 docs n go to page 3
			.limit(perPage) // skip and limit these 2 will paginate all our products, limit will limit pages per query in our case it limits to 9 docs
			.populate('category')   //, we are adding pagination to our route so later on we dont need to render all the data at once , imagine we have 5 million docs we do dont want to show all at once it will cause problem for our mongo db database 
			.exec(function(err,products) { // executive these function on this methods and use mongoose method .count to count the docs in product database so that we divide total docs in no of pages 

				if(err)return next (err);
				Product.count().exec(function(err,count){
					if(err)return next (err);
					res.render('main/product-main',{
						products:products,
						pages: count/perPage
					});
				});
			});



}


//this code is to map between the product database ans elastic search so that it creats a connection like a brodge
Product.createMapping(function(err,mapping){
	if (err) {
		console.log("error creating mapping");
		console.log(err);
	} else {
		console.log("Mapping created");
		console.log(mapping);

	}

});


var stream = Product.synchronize(); //sycronize  whole product in the elastic search replica set
var count =0;


//
stream.on('data',function(){

	count++;
});

//
stream.on('close', function(){
	console.log("Indexed" + count + "documents");

});

//
stream.on('error', function(err){

	console.log(err);
});

// lecture 54 creating cart route
router.get('/cart', function(req,res,next){
	Cart
		.findOne({ owner:req.user._id}) // first it searches in the cart database for requset.user.id does exists or not
		.populate('items.item') // then we want to poplate the items.item coz we want to get info like image name original product  n so we added product_id to the post route// coz in cart.js there is an item in the  objectid type
		.exec(function(err,fountCart) { /// execute annonomus funtion on this method if cart is found then render the page n supply the page witht the data that could be used that is foundcart
			if(err) return next(err);
			res.render('main/cart',{
				foundCart:foundCart
			});
		});


});

//Lecture 51 to add Post route so that we can add products to our cart
router.post('/product/:product_id', function(req,res,next){ // whenever we are gonna buy product we are using this url
	Cart.findOne({ owner:req.user._id}, function(err,cart){ // find the owner of the cart ,if found 
		cart.items.push({ // push all the items based on request.values to the array of items in cart 
			item: req.body.product_id, // specifications of the items 
			price: parseFloat(req.body.priceValue),
			quantity: parseInt(req.body.quantity)
		});

		cart.total = ( cart.total + parseFloat(req.body.priceValue)).toFixed(2); // to 2 decimal points 

		cart.save(function(err) {
			if(err) return next(err);
			return res.redirect('/cart'); // redirect to cart page

		});
	});
});

//go to search route n pass this message of req.body.q
router.post('/search', function(req,res,next) { 

	res.redirect('/search?q='+  req.body.q);
});


// the only way to retrieve the data from post is use the request.query.q n it only works on url that has eg like this
// /search?q= name(request.query.name)(?q= name of the query)
router.get('/search', function(req,res,next) {
	if(req.query.q){
		Product.search({ //it will search the value whc is request.query.q from post n search in elastic search replica
			query_string:{query: req.query.q} 
		}, function(err, results) {
			results:   //results = hits hits n value we want 
			if (err) return next(err);
			var data = results.hits.hits.map(function(hit){ //.map is a js builtin function to store the value we want to find in a new area 
				return hit;	 
			});

				res.render('main/search-result',{ //if successful render the data on  the search-result page
					 query: req.query.q,	
					 data:data
				});	
		});

	}

});

//calling the paginate function in this route
router.get('/', function (req,res,next){  //adding the validation if user has logged in then render different page or else not render home page
	
	if(req.user) {  // we wanna limit 9 products per page, 
		paginate(req,res,next);
	} else {
	res.render('main/home');
	}
});

//route to get page 
router.get('/page/:page', function(req,res,next){
	paginate(req,res,next);

});




router.get('/about', function (req,res){
	res.render('main/about');


});

// this route will render each of the category page//

router.get('/products/:id', function(req,res,next){ // : is added instead of creating 8 different routes for the categories : parameter helps when u want to go to a specific url//
	Product
		.find({ category: req.params.id}) //req.params is used so that it could be accessed depends on id of category//we are quering the obect id based on the pararmetervalue 
		.populate('category') // we can use ppulate only if the data type has object id whc we have // to get all the data inside the category
		.exec(function (err, products){ // executing a function on all the above methods
			if (err) return next(err);
			res.render('main/category',{
				products: products

			});

		});


});

// this router is to get single product open 	
router.get('/product/:id', function(req,res,next){
	Product.findById({_id: req.params.id}, function(err,product){
		if (err) return next (err);
		res.render('main/product',{
			product:product
		});


	});

});

//router.get('/users',function(req,res){
//	User.find({}, function(err,users){
//		res.json(users);
//	})

//})


module.exports = router;