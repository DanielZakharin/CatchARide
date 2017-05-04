/**
 * Created by Daniel on 04/05/2017.
 */
const express = require("express");
const app = express.Router();

const DB = require("./dbmodule.js");
const helper = require("./modulehelper.js")
const async = require("async");

app.route("/allRides").get((req, res) => {
    console.log("SESSIONS");
    console.log(req.isAuthenticated());
    console.log(req.session);
    console.log(req.user);
    DB.modelRides.find({}, (err, ress) => {
        if (!err) {
            console.log("THIS IS FROM ALLRIDES");
            console.log(req.user);
            return res.send(ress);
        } else {
            throw err;
        }
    });
});

app.route("/newRide").post((req, res) => {
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
                helper.getGooglePolyline(newObj.departureLocation, newObj.arrivalLocation, (res) => {
                    newObj.thumbnail = res;
                    callback();
                });
            }
        },
        (callback) => {
            DB.modelRides.create(newObj, (err, result) => {
                if (err) {
                    //console.log("succesfully created a thing");
                    res.send({status:false,error:err});
                } else {
                    //console.log("failed to create " + err);
                    res.send({status:true,new:result});
                }
            });

        }
    ]);
});


app.route("/singleRide/:id").get((req, res) => {
    console.log("singleride triggered " + req.params.id);
    DB.modelRides.findById(req.params.id, (err, result) => {
        if (!err) {
            console.log("found ride with id" + result);
            return res.send(result);
        } else {
            console.log("Error with search");
            return res.send({"error": err});
        }
    });
});

app.route("/joinRide").post((req, res, next) => {
    console.log("JOINRIDE 1");
    console.log(req.user);
    next();
});

app.route("/joinRide").post((req, res) => {
    console.log("JOINRIDE 2");
    let join = req.body;
    console.log(join);
    let user = JSON.parse(req.body.user);
    console.log("user in joinride");
    console.log(user);
    DB.modelRides.findById(join.rideId, (err, result) => {
        if (!err) {
            console.log("found ride with id" + join.rideId);
            if (!helper.checkArrayForUserId(result.passangersPending, user._id)) {
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

app.route("/updateRide").put((req, res) => {
    const newObj = req.body;
    console.log(newObj._id);
    DB.modelRides.findOneAndUpdate({_id: newObj._id}, newObj, {new: true}, (err, upd) => {
        if (!err) {
            console.log(upd);
            res.send({status: true, update: upd});
        } else {
            res.send({status: false, error: err});
        }
    });
});

app.route("/deletRide").delete((req, res) => {
    const id = req.body.id;
    console.log(id);
    DB.modelRides.findOneAndRemove({_id: id}, (err, upd) => {
        if (!err) {
            console.log(upd);
            res.send({status: true, update: upd});
        } else {
            res.send({status: false, error: err});
        }
    });
});

app.route("/userRides/:userId").get((req, res) => {
    console.log("userriders called");
    console.log(req.params.userId);
    DB.modelRides.find({driverId: req.params.userId}, (err, result) => {
        if (!err) {
            console.log("found");
            console.log(result);
            res.send(result);
        } else {
            console.log("err");
            console.log(err);
            res.send(err);
        }
    });
});

console.log("RIDES MODEUL LOADED");
module.exports = app;