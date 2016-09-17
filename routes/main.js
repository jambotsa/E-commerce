var router = require('express').Router();
//var User= require('../models/user');
var Product = require('../models/product');


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
})






router.get('/', function (req,res){
	res.render('main/home');


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