var router = require('express').Router();
var async = require ('async');
var faker = require ('faker');
var Category = require('../models/category');
var Product = require('../models/product');



//creating search api
router.post('/search', function(req,res,next) {
	console.log(req.body.search_term);
	Product.search({  // product.search is a mongosastic feature to search for a product
		query_string: {query: req.body.search_term}//search function wud find based on the input text name that is search_term
	}, function(err,results) {
		if (err) return next (err);
		res.json(results);//we respond the data in json format so that later on we can feed in ajax call in custom.js

	});

});

//check if this works ie it searhes by going in postman ..post api/search x-www. search_term compuetr ..itworks it means our api is successful






router.get('/:name', function(req,res,next){

	async.waterfall([

		function(callback) {
			Category.findOne({name: req.params.name}, function(err,category){
				if (err) return next(err);
				callback(null, category);

			});
		},


		function(category, callback) {
			for( var i = 0; i < 30; i++) {

				var product = new Product();
				product.category =category._id;
				product.name = faker.commerce.productName();
				product.price = faker.commerce.price();
				product.image = faker.image.image();

				product.save();

			}
		}


    ]);
    res.json({ message: 'Success'});
    
});

module.exports =router;

