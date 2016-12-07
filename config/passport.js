var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy; // 
var secret = require('../config/secret') //so that we can use the info facebook provides for us 
var User = require('../models/user');

var async = require('async'); // added for lecture 70
var Cart = require('../models/cart'); // added for lecture 70



// serialize and deserialize
passport.serializeUser(function(user,done){

	done(null,user._id);
});

passport.deserializeUser (function(id,done){

	User.findById(id,function(err,user){
		done(err,user);

	});
});


//middleware

passport.use('local-login',new LocalStrategy({

	usernameField: 'email',
	passwordField:'password',
	passReqToCallback: true

}, function(req,email,password,done){

	User.findOne({email:email}, function(err,user){

		if (err) return done(err);

		console.log(user);
		if(!user) {
			return done(null,false, req.flash('loginMessage', 'No user has been found'));
		}

		if (!user.comparePassword(password)){
			return done(null,false,req.flash('loginMessage','Oops! Wrong Password pal'));
		}


		return done(null,user);
		
	});

}));


//adding new facebook middleware in lecture 67
// secret.facebook is from
passport.use(new FacebookStrategy(secret.facebook, function(token, refreshToken, profile, done) { 
// config--secret --facebook --getting the info and passing to new facebook strategy 
// first we are teaching passport new technique whc is to know how to authenticate with facebook
//that is why we are using passport.use then we add new strategy to passport that is facebook strategy 
//next is we need to pass in the facebook object that we declare back is secret.js file whc has all 
// the imp info like app ID n secret ID
//next we have an anonymous function with the parameter token, refreshToken, profile, (done is call back)
//token is just the token facebook will give to us once the info that we provided in the secret.js file 
//is correct it is like b4 we enter any border we need to provide the info to immigration officers 
// if success then we get visa or validation whc in our case is the token 
//refresh token -- this is when the token is changed or the signatureis changes , but we dont really use this 
// but it has to be here just in case 
//the data the facebook gives to us is the profile 
// done is the call back   
	User.findOne({ facebook: profile.id}, function(err,user) { 
// we are using mongoose operation to find specific user like if the user actually has the facebook 
// for eg facebook is the string type ,if the id does match the facebook data ..u want to return 
//function with err n return parameter ..user is the resolve  
		if(err) return done (err); // so if there is internal error return callback with an error

		if (user) {// if user is already logged in or exists in the database then simply return that user 
			return done(null,user); // with the callback this is the call back done(null,user)
		} else{ //if this is the first time for the user to login then 
			async.waterfall ([

				function(callback) { // in 1st function we create new user object 
					var newUser = new User(); //  simply create a new user object 
					newUser.email = profile._json.email;  // then store all the appropriate info whc profile contains 
					newUser.facebook = profile.id; //like email,gender name n so on, we set the id to the facebook
					// we declared adatatype that we delcared in models --user.js line 14 15 , this is whr we store the
					// profile.id where we actually validate the check wether the user does exists or not 
					newUser.tokens.push({kind:'facebook', token: token}); // we need to set the value of user object to profiles data
					// we want to push the token the facebok provides for us 

					newUser.profile.name = profile.displayName;
					// we want to set profile name to the display name whc we have set is secret.js line 12

					newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
					//we want to use a profile pic is to actually use the graph

					newUser.save(function(err){ // save the user to the database

					if(err) throw err; // if error return error 

					callback(err,newUser); // else callback newUser  object passe to next function 

			});

			},


			function(newUser) { // we want to create new cart object and set it to new USer._id
				var cart = new Cart();
				cart.owner = newUser._id;
				cart.save(function(err) {
					if(err) return done (err);
					return done(err,newUser); // we always need to callback this newUSer so that passort knows to authenticate n redirect the user to apprpriate route 

				});
			}


			])
		}


	});

// we are teaching passport a technique how to authenticate with facebook and the 
// using new facebook strategy , we need to passin facebook object that we declared in secert.js 
//	

}));	




//custom function to validate
exports.isAuthenticated = function(req,res,next){

	if(req.isAuthenticated()){
	 return next();
	}

	res.redirect('/login');


}



