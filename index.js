/**
 * Created by Daniel on 30/03/2017.
 */

/*EXPRESS*/
const express = require("express");
const app = express();
/*END EXPRESS*/

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
console.log('this is the mongopath ' + mongoPath);
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
    'driverId': Schema.ObjectId,
    'passangers': [Schema.ObjectId]

});
const userSchema = new Schema({
    'userName': {type: String, defualt: "Nönnönnöö"},
    'email': {type: String, default: "esim@posti.jou"}
});

const modelRides = mongoose.model('rides', rideSchema);
const modelUsers = mongoose.model('users', userSchema);
/*END SCHEMAS*/

/*MOGNOOSE CONNECT*/
mongoose.connect(mongoPath).then(() => {
    console.log('Connected successfully to: ' + mongoPath);
    //UNCOMMENT TO DELETE DB
    /*model.remove(() => {
     console.log('removed db');
     });*/
}, err => {
    console.log('Connection to db failed to : ' + mongoPath + err);
});
/*END MONGOOSE CONNECT*/

app.use(express.static("public"));

app.get("/test", (req, res) => {
    res.send("help me oh god");
});

app.post("/newUser", (req, res) => {
    console.log("newUser triggered");
    console.log(req.body.loginName);
    modelUsers.create(req.body);
    let allusers = [];
    modelUsers.find({}, function (err, docs) {
        if (!err) {
            console.log("found:");
            console.log(docs);
            allusers = docs;
        } else {
            throw err;
        }
    });
    res.send("Response :^) " + JSON.stringify(req.body) + allusers.toJSON);
});

app.post("/newRide", (req, res) => {
    console.log("new ride being made");
    let newObj = req.body;
    console.log(req.body);
    newObj.departureTime = new Date(newObj.departureDate +", " + newObj.departureTime);
    newObj.arrivalTime = new Date(newObj.departureDate +", " + newObj.arrivalTime);
    newObj.departureDate = new Date(newObj.departureDate).millisecond;
    if(newObj.luggageAllowed == "on"){
        newObj.luggageAllowed = true;
    }else {
        newObj.luggageAllowed = false;
    }

    console.log(newObj);
    modelRides.create(newObj, (err, res) => {
        if (!err) {
            console.log("succesfully created a thing");
        } else {
            console.log("failed to create " + err);
        }
    });
    /*let allRides = [];
    modelRides.find({}, (err, res) => {
        if (!err) {
            console.log("found rides:");
            console.log(res);
            allRides = res;
        } else {
            throw err;
        }
    });*/
    res.send("Response :^) " + JSON.stringify(req.body));
});

app.get("/allRides",(req,res)=>{
    let allRides = [];
    const callback = (string) => {
        res.send(string);
    }
    modelRides.find({}, (err, res) => {
        if (!err) {
            callback(res);
        } else {
            throw err;
        }
    });
});

app.get("/googlePolyline", (req,res)=>{
    console.log("GooglePolyline Called");
    //getGooglePolyline(req.body.start,req.body.end,(aaaa)=>{
    getGooglePolyline("Helsinki","Turku",(aaaa)=>{
        res.send(aaaa);
    });
});

const getGooglePolyline = (start,end,callback,locArr) => {
    let polylineUrl = "https://maps.googleapis.com/maps/api/directions/json?origin=";
    polylineUrl += start;
    polylineUrl = polylineUrl +"&destination="+end;
    if(locArr && locArr.length>0) {
        polylineUrl += "&waypoints=";
        for (const wp of locArr) {
            polylineUrl+=wp+"|"
        }
    }
    polylineUrl += "&mode=driving&key=" + process.env.apiKey;
    console.log("accessing polylineUrl " + polylineUrl);
    genericGetMethod(polylineUrl,(response)=>{
        callback("https://maps.googleapis.com/maps/api/staticmap?center=Helsinki&zoom=13&size=600x400&path=enc:" + response.routes[0].overview_polyline.points + "&key=" + process.env.apiKey);//.overview_polyline.points);
    });
    //https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc
    //return polylineUrl;
};

const genericGetMethod = (url,callbackMethod) => {
    fetch(url).then((response) => {
        if (response.ok) {
            console.log(response);
            return response.json();
        } else {
            console.log("response is not ok");
            throw new Error('Network response was not ok.');
        }
    }).then((response) => {
        callbackMethod(response);
    }).catch(function (error) {
        console.log('Problem :( ' + error.message);
    });
};

app.listen(3000);

//console.log("GOOGLE IS A DICK!" + getGooglePolyline("turku","helsinki"));