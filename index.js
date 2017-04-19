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
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
/*END BODYPARSER*/

/*MOMENT*/
const moment = require('moment');
/*END MOMENT*/

/*SCHEMAS*/
const rideSchema = new Schema({
    'departureDate': {type: Date, default: moment(Date.now()).format("dd.mm.yyyy")},
    'departureTime': {type: Date, default: moment(Date.now()).format("hh:mm:ss")},
    'departureLocation': {type: String, default: "Not set"},
    'departureCoordinates': {
        type: [Number,Number],
        default: [1, 1]
    },
    'departureTitle': {type: String, default: "No StartPoint Set"},
    'arrivalDate': {type: Date, default: moment(Date.now()).format("dd.mm.yyyy")},
    'arrivalTime': {type: Date, default: moment(Date.now()).format("hh:mm:ss")},
    'arrivalLocation': {type: String, default: "Not set"},
    'arrivalCoordinates': {
        type: [Number,Number],
        default: [0, 0]
    },
    'arrivalTitle': {type: String, default: "No EndPoint Set"},
    'cartype': {
        type: String,
        enum: ['Sedan', 'Estate', 'Family Car', 'Compact', 'Van'],
        default: 'Not Specified'
    },
    'passangerNumber': {
        type: Number,
        min: 0,
        max: 8,
        default: 0
    },
    'luggageAllowed': {
        type: Boolean, default: false
    },
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

app.post("/newUser",(req,res) => {
    console.log("newUser triggered");
    console.log(req.body);
    res.send("Response :^)");
});


app.listen(3000);