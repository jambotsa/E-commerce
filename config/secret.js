module.exports ={

	database: 'mongodb://superman:abc123@ds011903.mlab.com:11903/ecommerce',
	port: 3000,
	secretKey: "abcd",

	facebook: { // declare an object named facebook later on it will be used in the middleware 
		// specify client ID i.e app id n app secert from https://developers.facebook.com/apps/1810053095932661/settings/
		clientID: process.env.FACEBOOK_ID || '1810053095932661', // process.env it is a global object , so u can access it anywhr u want 
		// FACEBOOK_ID and FACEBOOK_SECRET is in upper case coz its constant and the value doesnt change 
		clientSecret: process.env.FACEBOOK_SECRET || 'acdd6c2575f58da294a4577241df2056',
		profileFields: ['emails', 'displayName'],
		callbackURL: 'http://localhost:3000/auth/facebook/callback'

	}



}


