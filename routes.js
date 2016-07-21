module.exports = function(app, passport) {

var express = require('express');
var passport = require('passport');
var User = require("./models/user");

// ***Logic to ensure user is logged in***
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
    next();
}

// ***Gets Home Page***
    app.get('/', function(req, res) {
        console.log("we're home");
        res.sendFile( __dirname + '/views/index.html', { user: req.user });
    });

// ***Gets log in form***
    app.get('/login', function(req, res) {
        console.log("login page")
        res.sendFile( __dirname + '/views/login.html', { user: req.user })
    });

// ***Posts to login route (lets the user log in)***
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user) {
            if (err) { return next(err); }
            console.log("logging in")
            res.sendFile(__dirname + "/views/profile.html");
        })(req, res, next);
    });

    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect: '/profile',
    //     failureRedirect: '/login',
    //     failureFlash: false
    // }))

// ***Gets the sign up form***
    app.get('/signup', function(req, res) {
        res.sendFile( __dirname + '/views/signup.html', { message: req.flash('signupMessage') });
    });

// ***Posts to sign up route (lets the user sign up)***

app.post('/signup', function(req, res){
        console.log('response is: ', res);
        passport.authenticate('local-login', {
            successRedirect: '/login',
            failureRedirect: '/index',
            failureFlash: false
        }, function(err, user){
                if(err){
                   console.log('there was an error: ', err);
                } else if (user === false) {
                    console.log("User already exists. Please try another email");
                } else {
                     res.sendFile(__dirname + '/views/profile.html', { user: req.user });
                }
        })
    })


    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect : '/login', 
    //     failureRedirect : '/index',
    //     failureFlash : false 
    // }, function(err, user) {
    //     console.log(" err ", err, " user ", user);
    //     if(err){
    //         console.log('there was an error: ', err); // returns null
    //     } else if (user === false) {
    //         console.log("User already exists. Please try another email");
    //     } else {
    //         // console.log(req.user);
    //         res.sendFile(__dirname + '/views/profile.html', { user: req.user });
    //     }
    // }));

// ***Gets the profile page only if user is logged in***
    app.get('/profile', isLoggedIn, function(req, res) {
        console.log("at profile");
        // res.sendFile('profile.html', { root: __dirname + '/views'}, {
        //     user : req.user // get the user out of session and pass to template
        // });
        res.sendFile( __dirname + '/views/profile.html', { user : req.user });
    });

// *** Hits the logout route to redirect to home ***
    app.get('/logout', function(req, res) {
        req.logout();
        res.sendFile(__dirname + '/views/index.html');
    });
};
