var db       = require('../models');

var express  = require("express");

var passport = require('passport');

var router   = express.Router();

var Sequelize = require('sequelize');
var Op = Sequelize.Op;


	
	/*------------HTML ROUTES --------------*/

	// landing page where a user is prompted to login or create an account
	// if a user is logged already redirect user to their dashboard
	router.get("/", function(req, res){
		// is user logged in
		// when a user goes to the site "/"
		// if user is not authenicated render login page / create account page
		// if user is authenticated redirected to dashboard
		console.log("#####",req.isAuthenticated())
		console.log("hellooooo");
		res.render("index")
	})

	// display user dashboard with all existing categories
	router.get("/dashboard", function(req, res){
		if(req.isAuthenticated()){
			res.render("dashboard");
		}else{
			res.redirect("/");
		}
		
		// is user logged in
		// get all categories
		// send array of categories to handlebars front end
		// and get logged in users saves
		// db.Category.findAll()
		// .then(function(cats){
		// 	var hndlBrsObj = {
		// 		categories: cats
		// 	}
		// 	res.render("index", hndlBrsObj)
		// });	
	})



	/*---------------API Routes ----------------------*/

	// within the dashboard a user can click to view all of their saved items
	router.get("/api/saves", function(){
		// is user logged in
		db.Save.findAll()
		.then(function(saves){
			var hndlBrsObj = {
				saves: saves
			}
			res.render("index", hndlBrsObj)
		});
	})

	// create a new save item for user
	router.post("/api/saves", function(req, res){
		// is user logged in
		// save search to saves add user foreign key
	})




	// ====================== API Routes ========================= // 

	// process the signup form ==============================================
	//=======================================================================

	router.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) {
      //console.log("passport err", err)
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }
    
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************

    req.login(user, loginErr => {
      if (loginErr) {
        //console.log("loginerr", loginerr)
        return next(loginErr);
      }

      //console.log('redirecting....');
      var status ={
        code: 200,
        isLoggedIn: true,
        userId: user.dataValues.id,
        username: user.dataValues.name
      }
      res.cookie('user_name', user.name );
      res.json(status);

      //return res.redirect(req.headers.referer);
      //res.redirect("/account");
      
    });      
  })(req, res, next);
});

	router.post('/login', function(req, res, next) {
	 
	  passport.authenticate('local-login', function(err, user, info) {
	    if (err) {
	      //console.log("passport err", err)
	      return next(err); // will generate a 500 error
	    }
	    // Generate a JSON response reflecting authentication status
	    if (! user) {
	      return res.send({ success : false, message : 'authentication failed' });
	    }
	    
	    // ***********************************************************************
	    // "Note that when using a custom callback, it becomes the application's
	    // responsibility to establish a session (by calling req.login()) and send
	    // a response."
	    // Source: http://passportjs.org/docs
	    // ***********************************************************************

	    req.login(user, loginErr => {
	      if (loginErr) {
	        //console.log("loginerr", loginErr)
	        return next(loginErr);
	      }
	      //var userId = user.dataValues.id;
	      //console.log('redirecting....')
	      var userName = user.dataValues.name;
	      var status ={
	      	code: 200,
	      	isLoggedIn: true,
	      	userId: user.dataValues.id,
	      	username: user.dataValues.name,
	      	
	      }
	      res.cookie('user_name', user.name );
	      res.json(status);

	 
	      //res.redirect("/account");
	      
	    });      
	  })(req, res, next);
	});

	// logout of user account
	router.get('/logout', function(req, res) {
	    req.logout();
	    res.redirect('/');
	});



	function getCurrentuserId(req){
	  var userId;
	    if(req.isAuthenticated()){
	      userId = req.session.passport.user;
	    } else {
	      userId = false
	    }
	    return userId
	}


	//edge casing for wild card
	router.get("*", function(req, res, next) {
	  if(req.url.indexOf('/api') == 0) return next();
	  if(req.url.indexOf('/assets') == 0) return next();
	  if(req.url.indexOf('/css') == 0) return next();
	  res.render("index");
	})

	module.exports = router;
