/**
 * Created by Daniel on 04/05/2017.
 */
const express = require("express");
const session = require("express-session");
const app = express.Router();


const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const DB = require("./dbmodule.js");

passport.use(new LocalStrategy(
    (username, password, done) => {
        DB.modelUsers.findOne({"userName": username}, (err, user) => {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }
            /*TODO: IMPLEMENT BCRYPT*/
            /*User.comparePassword(password, user.password, function(err, isMatch){
             if(err) throw err;
             if(isMatch){
             return done(null, user);
             } else {
             return done(null, false, {message: 'Invalid password'});
             }
             });*/
            console.log("comparing " + user.password + " " + password);
            if (user.password == password) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    }));

//add the user in session
passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

app.use(session({
    secret: "Secret1",
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.route('/register').post((req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    DB.modelUsers.findOne({"userName": username}, (err, user) => {
        if (!err) {
            console.log(user + "user");
            if (user) {
                return res.send(JSON.stringify({status: false, message: "A user with that name already exists."}));
            } else {
                const newUser = {
                    "email": email,
                    "userName": username,
                    "password": password
                };

                DB.modelUsers.create(newUser, (err, user) => {
                    if (err) {
                        console.log("ERROR WITH CREATING USER" + err);
                        return res.send(JSON.stringify({error: err}));
                    }
                    console.log(user);
                    res.redirect("/");
                    /*
                     return res.send(JSON.stringify({
                     status: true,
                     user: newUser
                     }))*/
                });
            }
        }
    });
});
app.route('/login').post(
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/test'})
);

app.route('/logout').get((req, res) => {
    console.log("Loggin out");
    console.log(req.session);
    //req.logout();
    /*req.session.destroy((err) => {
     if (err) {
     console.log("error with destroy " + err)
     }
     console.log("Logged out");
     res.redirect('/');
     });
     req.session.destroy(function (err) {
     console.log("DESTOYRMENT");
     res.redirect('/');
     });*/
    req.logout();
    res.redirect("/");
});

app.route('/user_data').get((req, res) => {
    if (req.user === undefined) {
        // The user is not logged in
        res.send({status: false});
    } else {
        res.json({
            status: true,
            user: req.user
        });
    }
});

app.route("/allUsers").get((req, res) => {
    DB.modelUsers.find({}, (err, result) => {
        if (!err) {
            return res.send(result);
        } else {
            throw err;
        }
    })
});

console.log("USEERS MODEUL LOADED");
module.exports = app;