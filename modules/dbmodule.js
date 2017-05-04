/**
 * Created by Daniel on 04/05/2017.
 */

class DB {
    constructor(){
        this.mongoose = require("mongoose");
        this.mongoose.Promise = global.Promise; //ES6 Promise
        this.ObjectID = require('mongodb').ObjectID;
        this.mongoUsr = process.env.DB_USERNAME;
        this.mongoPwd = process.env.DB_PASSWORD;
        this.mongoUrl = process.env.DB_URL;
        this.mongoPath = 'mongodb://' + this.mongoUsr + ':' + this.mongoPwd + '@' + this.mongoUrl;
        this.Schema = this.mongoose.Schema;
        this.makeSchemas();
    }
    connect(){
        this.mongoose.connect(this.mongoPath).then(() => {
            //console.log('Connected successfully to: ' + mongoPath);
            //UNCOMMENT TO DELETE DB
            /*modelRides.remove(() => {
             console.log('removed db');
             });
             */
            /*
             modelUsers.remove(()=>{
             console.log("removed users");
             })*/
        }, err => {
            //console.log('Connection to db failed to : ' + mongoPath + err);
        });
    }

    makeSchemas(){
        this.rideSchema = new this.Schema({
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
            'driverId': {type: String, required: true},
            'passangersAccepted': {type: Array, default: []},
            'passangersPending': {type: Array, default: []},


        });
        this.userSchema = new this.Schema({
            'userName': {type: String, defualt: "Nönnönnöö"},
            'password': {type: String, required: true},
            'email': {type: String, default: "esim@posti.jou"}
        });

        this.modelRides = this.mongoose.model('rides', this.rideSchema);
        this.modelUsers = this.mongoose.model('users', this.userSchema);
    }
}

module.exports = new DB();