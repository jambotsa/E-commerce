var router = require('express').Router();
var User = require ('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');
var async = require('async');
var Cart = require('../models/cart');

router.get('/login', function(req,res){
	if (req.user) return res.redirect('/');
	res.render('accounts/login',{message:req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login',{
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash:true

}));


router.get('/profile',passportConf.isAuthenticated, function(req,res,next){ 
	 //added the passport middleware to validate the user 
	 //if user is authenticated then go ahead if not go to login page whc is explained in config --passport--line 54
	 // if user has logged in then we wanna get the user object by finding the request.user._id 
	 // n populte the history so that we can acces wat is there in the hisory 
	User
		.findOne({ _id: req.user._id})
		.populate('history.item')
		.exec(function(err,foundUser){
			// we wanna execute an anonymous function get the result whc is foundUser
			//and pass into profile page 

			if(err) return next(err);

			res.render('accounts/profile', {user:foundUser });
		});

});	


	//User.findOne({ _id: req.user._id}, function(err,user){
		//if(err) return next(err);
		//res.render('accounts/profile',{user:user});
//});


router.get('/signup',function(req,res,next){
	res.render('accounts/signup',{
		errors: req.flash('errors')

	});

});


router.post('/signup', function(req,res,next) {
	 
	async.waterfall([
		function(callback) { // create initial user when he sigh up then we save the user and call the second function

	 	var user = new User();

	 	user.profile.name = req.body.name;
	 	user.email = req.body.email;
	 	user.password = req.body.password;
	 	user.profile.picture = user.gravatar();
	 
	 	User.findOne({email: req.body.email}, function(err,existingUser){

	 		if (existingUser) {
	 		req.flash('errors','Accounts with that email adress already exists');
	 		
	 		return res.redirect('/signup');
	 		} else {
	 		  user.save(function(err,user){
			  if (err) return next (err);
			  callback(null,user); //call the second function by using callback and we pass in user object as a parameter so that the second function can use the object 


	 		  });
	 	    }
	    });


	},

		function(user) {
			var cart = new Cart();
			cart.owner= user._id; // we create new cart object and store the user id in the cart owner so that every cart will only belong to 1 user 
			cart.save(function(err) { // then we save the cart 
				if(err)return(err);
				 req.logIn(user,function(err){ // login the user so that he will have session with server n cookiee for browser
					if(err) return next(err);
			        res.redirect('/profile'); // we redirect the user to the profile page 
			     }); 

			    });
		}

		
	])

});



router.get('/logout',function(req,res,next){

	req.logout();
	res.redirect('/');
})


router.get('/edit-profile', function(req,res,next){

	res.render('accounts/edit-profile',{message: req.flash('success')});

})

router.post('/edit-profile', function(req,res,next) {
	User.findOne({_id: req.user._id}, function(err,user) {

		 	if (err) return next (err);

		 	if (req.body.name) user.profile.name = req.body.name;
		 	if(req.body.address) user.address = req.body.address;

		 	user.save(function(err){

		 		if (err) return next (err);
		 		req.flash('success','Successfully edited your profile');
		 		return res.redirect('/edit-profile');

		 	});
		});
	});

//this route is to send the user to facebook to do the authentication, once authenticated it will call the below route
//passport.authenticate is the middleware,there is no name given for middleware so default is facebook
//scope: by default facebook will provide with the info by email, we specify with scope
// if we want email from facebook we got to put scope
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

// this route is to handle the callback , once facebook has authenticated the user we want to redirect 
//the user to profile sor succes n login for failure 

router.get('/auth/facebook/callback', passport.authenticate('facebook', {

	successRedirect: '/profile',
	failureRedirect: '/login',

}));





module.exports = router;


	
 


