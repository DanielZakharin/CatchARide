/**
 * Created by Daniel on 30/03/2017.
 */

/*EXPRESS*/
const express = require("express");
const app = express();
/*END EXPRESS*/

/*PASSPORT*/
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});
app.use(passport.initialize());
app.use(passport.session());
/*END PASSPORT*/

/*DOTENV*/
const dotenv = require('dotenv').config();
/*END DOTENV*/

/*MONGOOSE*/
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //ES6 Promise
const mongoUsr = process.env.DB_USERNAME;
const mongoPwd = process.env.DB_PASSWORD;
const mongoUrl = process.env.DB_URL;
const mongoPath = 'mongodb://' + mongoUsr + ':' + mongoPwd + '@' + mongoUrl;
//console.log('this is the mongopath ' + mongoPath);
const Schema = mongoose.Schema;
/*END MONGOOSE*/

/*BODY PARSER*/
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
/*END BODYPARSER*/

/*MOMENT*/
const moment = require('moment');
/*END MOMENT*/

/*NODE FETCH*/
const fetch = require('node-fetch');
/*END NODE FETCH*/

/* ASYNC */
const async = require("async");
/*END ASYNC*/

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
    'thumbnail': {type: String, default: "https://i.ytimg.com/vi/cNycdfFEgBc/maxresdefault.jpg"},
    'driverId': Schema.ObjectId,
    'passangersAccepted': [Schema.ObjectId],
    'passangersPending': [Schema.ObjectId]


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
    /*modelRides.remove(() => {
     console.log('removed db');
     });*/
}, err => {
    //console.log('Connection to db failed to : ' + mongoPath + err);
});
/*END MONGOOSE CONNECT*/

app.use(express.static("public"));


app.post("/newUser", (req, res) => {
    console.log(req.body);
    modelUsers.create(req.body);
    modelUsers.find({'email': new RegExp(req.params.email, 'i')}, (err, result) => {
        if (!err) {
            res.send(result);
        } else {

            res.send({"error": err});
        }
    });
});

app.post('/register', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    //var password2 = req.body.password2;

    // Validation
    /*req.checkBody('name', 'Name is required').notEmpty();
     req.checkBody('email', 'Email is required').notEmpty();
     req.checkBody('email', 'Email is not valid').isEmail();
     req.checkBody('username', 'Username is required').notEmpty();
     req.checkBody('password', 'Password is required').notEmpty();*/
    //req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    /*const errors = req.validationErrors();

     if(errors){
     /*res.render('register',{
     errors:errors
     });
     res.send("ERROR WITH CREATING USER " + errors);
     } else {*/
    const newUser = {
        "email": email,
        "userName": username,
        "password": password
    };

    modelUsers.create(newUser, (err, user) => {
        if (err) res.send(err);
        console.log(user);
    });

    //req.flash('success_msg', 'You are registered and can now login');

    res.redirect('/');

});

app.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login'}),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();

    //req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

app.post("/newRide", (req, res) => {
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
                    console.log("this is called");
                    callback();
                });
            }
        },
        (callback) => {
            console.log("NEW AND TASTY");
            console.log(newObj);
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
    modelRides.find({}, (err, ress) => {
        if (!err) {
            res.send(ress);
        } else {
            throw err;
        }
    });
});

app.get("/singleRide/:id", (req, res) => {
    console.log("singleride triggered " + req.params.id);
    modelRides.findById(req.params.id, (err, result) => {
        if (!err) {
            console.log("found ride with id" + result);
            res.send(result);
        } else {
            console.log("Error with search");
            res.send({"error": err});
        }
    });
});

app.post("/joinRide", (req, res) => {
    let join = res.body;
    modelRides.findById(join.rideId, (err, result) => {
        if (!err) {
            console.log("found ride with id" + result);
        } else {
            console.log("Error with search");
            res.send({"error": err});
        }
    });
});

app.get("/allUsers", (req, res) => {
    modelUsers.find({}, (err, result) => {
        if (!err) {
            res.send(result);
        } else {
            throw err;
        }
    })
})

app.get("/singleUser/:email", (req, res) => {
    modelUsers.find({'email': new RegExp(req.params.email, 'i')}, (err, result) => {
        if (!err) {
            res.send(result);
        } else {

            res.send({"error": err});
        }
    });
});

app.get("/googlePolyline", (req, res) => {
    //getGooglePolyline(req.body.start,req.body.end,(aaaa)=>{
    getGooglePolyline("Helsinki", "Turku", (aaaa) => {
        console.log("POLYLINE SENDING " + aaaa);
        res.send(JSON.stringify({"url": aaaa}));
    });
});

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

const makeNewUser = (uname, email) => {
    modelUsers.create({"username": uname, "email": email});
}

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

app.listen(3000);