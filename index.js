/**
 * Created by Daniel on 30/03/2017.
 */

/*CONSTANT IMPORTS*/
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const moment = require('moment');
const fetch = require('node-fetch');
const async = require("async");
const cookieParser = require("cookie-parser");
/*END CONSTANTS*/

/*EXPRESS*/
const app = express();

/*END EXPRESS*/

/*COOKIE PARSER*/
app.use(cookieParser("Cookie1"));
/*END COOKIEPARSER*/

/*PASSPORT*/
//put your username and password in .env
/*passport.use(new LocalStrategy(
 (username, password, done) => {
 modelUsers.findOne({userName:username},(res,err)=>{
 if(!err){
 if (password != res.password) {
 done(null, false, {message: 'Incorrect credentials.'});
 return;
 }return done(null, res);
 }
 })


 }
 ));*/

passport.use(new LocalStrategy(
    (username, password, done) => {
        modelUsers.findOne({"userName": username}, (err, user) => {
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
/*END PASSPORT*/

/*CONNECT_FLASH*/
const flash = require("connect-flash");
app.use(flash());
/*END FLASH*/

/*DOTENV*/
/*END DOTENV*/

/*MONGOOSE*/
mongoose.Promise = global.Promise; //ES6 Promise
const ObjectID = require('mongodb').ObjectID;
const mongoUsr = process.env.DB_USERNAME;
const mongoPwd = process.env.DB_PASSWORD;
const mongoUrl = process.env.DB_URL;
const mongoPath = 'mongodb://' + mongoUsr + ':' + mongoPwd + '@' + mongoUrl;
//console.log('this is the mongopath ' + mongoPath);
const Schema = mongoose.Schema;
/*END MONGOOSE*/

/*BODY PARSER*/
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
/*END BODYPARSER*/

/*SCHEMAS*/
const rideSchema = new Schema({
    'departureDate': {type: Date, default: Date.now()},
    'departureTime': {type: Date, default: Date.now()},
    'departureLocation': {type: String, default: "Not set"},
    'departureCoordinates': {
        type: [Number, Number],
        default: [1, 1]
    },
    'departureTitle': {type: String, default: "No StartPoint Set"},
    'arrivalTime': {type: Date},
    'arrivalLocation': {type: String, default: "Not set"},
    'arrivalCoordinates': {
        type: [Number, Number],
        default: [0, 0]
    },
    'arrivalTitle': {type: String, default: "No EndPoint Set"},
    'cartype': {
        type: String,
        enum: ['Sedan', 'Estate', 'Family Car', 'Compact', 'Van'],
        default: 'Not Specified'
    },
    'passengerNumber': {
        type: Number,
        min: 0,
        max: 8,
        default: 0
    },
    'luggageAllowed': {
        type: Boolean, default: false
    },
    'payment': {type: Number, default: 0},
    'maximumDistance': {type: Number, default: 0},
    'totalDistance': {type: Number, default: 0},
    'thumbnail': {type: String, default: "https://i.ytimg.com/vi/cNycdfFEgBc/maxresdefault.jpg"},
    'driverId': {type: String,required: true},
    'passangersAccepted': {type: Array, default: []},
    'passangersPending': {type: Array, default: []},


});
const userSchema = new Schema({
    'userName': {type: String, defualt: "Nönnönnöö"},
    'password': {type: String, required: true},
    'email': {type: String, default: "esim@posti.jou"}
});

const modelRides = mongoose.model('rides', rideSchema);
const modelUsers = mongoose.model('users', userSchema);
/*END SCHEMAS*/

/*MOGNOOSE CONNECT*/
mongoose.connect(mongoPath).then(() => {
    //console.log('Connected successfully to: ' + mongoPath);
    //UNCOMMENT TO DELETE DB
    /*odelRides.remove(() => {
     console.log('removed db');
     });
    *//*
     modelUsers.remove(()=>{
     console.log("removed users");
     })*/
}, err => {
    //console.log('Connection to db failed to : ' + mongoPath + err);
});
/*END MONGOOSE CONNECT*/

app.use(express.static("public"));

app.post('/register', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    modelUsers.findOne({"userName": username}, (err, user) => {
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

                modelUsers.create(newUser, (err, user) => {
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
app.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/test'})
);

app.get("/", (req, res) => {
    console.log("/////////");
    console.log(req.user);
});

app.get('/test', (req, res) => {
    if (req.user !== undefined)
        return res.send(`User is: ${req.user.userName}!`);
    res.send('No user logged in!');
});

app.get('/logout', (req, res) => {
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

app.post("/newRide", (req, res) => {
    console.log("this is second");
    let newObj = req.body;
    console.log(req.body);
    newObj.departureTime = new Date(newObj.departureDate + ", " + newObj.departureTime);
    newObj.arrivalTime = new Date(newObj.departureDate + ", " + newObj.arrivalTime);
    newObj.departureDate = new Date(newObj.departureDate).millisecond;
    if (newObj.luggageAllowed == "on") {
        newObj.luggageAllowed = true;
    } else {
        newObj.luggageAllowed = false;
    }
    async.series([
        (callback) => {
            if (!newObj.thumbnail) {
                getGooglePolyline(newObj.departureLocation, newObj.arrivalLocation, (res) => {
                    newObj.thumbnail = res;
                    callback();
                });
            }
        },
        (callback) => {
            modelRides.create(newObj, (err, res) => {
                if (!err) {
                    //console.log("succesfully created a thing");
                } else {
                    //console.log("failed to create " + err);
                }
            });
            res.send("Response :^) " + JSON.stringify(req.body));
        }
    ]);
});

app.get("/allRides", (req, res) => {
    console.log("SESSIONS");
    console.log(req.isAuthenticated());
    console.log(req.session);
    console.log(req.user);
    modelRides.find({}, (err, ress) => {
        if (!err) {
            console.log("THIS IS FROM ALLRIDES");
            console.log(req.user);
            return res.send(ress);
        } else {
            throw err;
        }
    });
});

app.get('/user_data', (req, res) => {
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

app.get("/singleRide/:id", (req, res) => {
    console.log("singleride triggered " + req.params.id);
    modelRides.findById(req.params.id, (err, result) => {
        if (!err) {
            console.log("found ride with id" + result);
            return res.send(result);
        } else {
            console.log("Error with search");
            return res.send({"error": err});
        }
    });
});

app.post("/joinRide", (req, res, next) => {
    console.log("JOINRIDE 1");
    console.log(req.user);
    next();
});

app.post("/joinRide", (req, res) => {
    console.log("JOINRIDE 2");
    let join = req.body;
    console.log(join);
    let user = JSON.parse(req.body.user);
    console.log("user in joinride");
    console.log(user);
    modelRides.findById(join.rideId, (err, result) => {
        if (!err) {
            console.log("found ride with id" + join.rideId);
            if (!checkArrayForUserId(result.passangersPending, user._id)) {
                result.passangersPending.push({
                    userID: user._id,
                    address: req.body.address,
                    email: user.email
                });
                console.log(result.passangersPending);
                result.save((err) => {
                    if (!err) {
                        res.send({status: true});
                    } else {
                        res.send({status: false, error: err});
                    }
                });
            } else {
                console.log("User already on the list");
                res.send({status: false, message: "You have already signed up for this ride"})
            }
        } else {
            console.log("Error with search");
            res.send({status: false, "error": err});
        }
    });
});

app.put("/updateRide",(req,res)=>{
    const newObj = req.body;
    console.log(newObj._id);
    modelRides.findOneAndUpdate({_id:newObj._id},newObj,{new:true},(err,upd)=>{
        if(!err){
            console.log(upd);
            res.send({status:true,update:upd});
        }else {
            res.send({status:false,error:err});
        }
    });
});

app.delete("/deletRide",(req,res)=>{
    const id = req.body.id;
    console.log(id);
    modelRides.findOneAndRemove({_id:id},(err,upd)=>{
        if(!err){
            console.log(upd);
            res.send({status:true,update:upd});
        }else {
            res.send({status:false,error:err});
        }
    });
});

function checkUser(req, res, next) {
    console.log("HELPPERONIES");
    if (req.user) {
        console.log(req.user);
        next();
    } else {
        res.redirect("/");
    }
};

app.get("/profile", checkUser, (req, res) => {
    res.sendFile("profile/profile.html", {root: "public"});
});

app.get("/planride", checkUser, (req, res) => {
    res.sendFile("planride/planride.html", {root: "public"});
});


app.get("/allUsers", (req, res) => {
    modelUsers.find({}, (err, result) => {
        if (!err) {
            return res.send(result);
        } else {
            throw err;
        }
    })
})

app.get("/googlePolyline", (req, res) => {
    //getGooglePolyline(req.body.start,req.body.end,(aaaa)=>{
    getGooglePolyline("Helsinki", "Turku", (aaaa) => {
        console.log("POLYLINE SENDING " + aaaa);
        return res.send(JSON.stringify({"url": aaaa}));
    });
});

app.get("/userRides/:userId", (req, res) => {
    console.log("userriders called");
    console.log(req.params.userId);
    modelRides.find({driverId: req.params.userId}, (err, result) => {
        if (!err) {
            console.log("found");
            console.log(result);
            res.send(result);
        }else {
            console.log("err");
            console.log(err);
            res.send(err);
        }
    });
})
;

const getGooglePolyline = (start, end, callback, locArr) => {
    let polylineUrl = "https://maps.googleapis.com/maps/api/directions/json?origin=";
    polylineUrl += start;
    polylineUrl = polylineUrl + "&destination=" + end;
    if (locArr && locArr.length > 0) {
        polylineUrl += "&waypoints=";
        for (const wp of locArr) {
            polylineUrl += wp + "|"
        }
    }
    polylineUrl += "&mode=driving&key=" + process.env.apiKey;
    //console.log("accessing polylineUrl " + polylineUrl);
    genericGetMethod(polylineUrl, (response) => {
        callback("https://maps.googleapis.com/maps/api/staticmap?&size=600x400&path=enc:" + response.routes[0].overview_polyline.points + "&key=" + process.env.apiKey);//.overview_polyline.points);
    });
    //https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc
    //return polylineUrl;
};

const genericGetMethod = (url, callbackMethod) => {
    fetch(url).then((response) => {
        if (response.ok) {
            //console.log(response);
            return response.json();
        } else {
            //console.log("response is not ok");
            throw new Error('Network response was not ok.');
        }
    }).then((response) => {
        callbackMethod(response);
    }).catch(function (error) {
        //console.log('Problem :( ' + error.message);
    });
};

const checkArrayForUserId = (array, id) => {
    for (const elem of array) {
        console.log("comaparing " + elem.userID + "  " + id);
        if (elem.userID == id) {
            console.log("returning true");
            return true;
        }
    }
    console.log("returning false");
    return false;
};

app.listen(3000);