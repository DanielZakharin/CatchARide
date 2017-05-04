/**
 * Created by Daniel on 04/05/2017.
 */
const express = require("express");
const app = express.Router();

const DB = require("./dbmodule.js");
const helper = require("./modulehelper.js")
const async = require("async");

app.route("/sendMail").post((req,res)=>{
    const mail = req.body;
    if(mail){
        helper.sendMail(mail.address,mail.title,mail.body)
    }
    res.end();
});
app.route('/test').get((req, res) => {
    if (req.user !== undefined)
        return res.send(`User is: ${req.user.userName}!`);
    res.send('No user logged in!');
});

app.route("/profile").get(helper.checkUser, (req, res) => {
    res.sendFile("profile/profile.html", {root: "public"});
});

app.route("/planride").get(helper.checkUser, (req, res) => {
    res.sendFile("planride/planride.html", {root: "public"});
});

app.route("/googlePolyline").get((req, res) => {
    //getGooglePolyline(req.body.start,req.body.end,(aaaa)=>{
    helper.getGooglePolyline("Helsinki", "Turku", (aaaa) => {
        console.log("POLYLINE SENDING " + aaaa);
        return res.send(JSON.stringify({"url": aaaa}));
    });
});

console.log("MISC MODULE LOADED");
module.exports = app;