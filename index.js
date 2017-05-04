/**
 * Created by Daniel on 30/03/2017.
 */
"use strict";

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
const nodemailer = require('nodemailer');
/*END CONSTANTS*/

/*EXPRESS*/
const app = express();

/*END EXPRESS*/

/*PASSPORT*/


/*END PASSPORT*/

/*CONNECT_FLASH*/
const flash = require("connect-flash");
app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*CUSTOM MODULES*/
const DB = require("./modules/dbmodule.js");
const ridesModule = require("./modules/ridesModules.js");
const usersModule = require("./modules/usersmodule.js");
const helper = require("./modules/modulehelper.js");
DB.connect();

app.use(ridesModule);
app.use(usersModule);


app.use(express.static("public"));

app.post("/sendMail",(req,res)=>{
    const mail = req.body;
    if(mail){
        helper.sendMail(mail.address,mail.title,mail.body)
    }
    res.end();
});
app.get('/test', (req, res) => {
    if (req.user !== undefined)
        return res.send(`User is: ${req.user.userName}!`);
    res.send('No user logged in!');
});

app.get("/profile", helper.checkUser, (req, res) => {
    res.sendFile("profile/profile.html", {root: "public"});
});

app.get("/planride", helper.checkUser, (req, res) => {
    res.sendFile("planride/planride.html", {root: "public"});
});

app.get("/googlePolyline", (req, res) => {
    //getGooglePolyline(req.body.start,req.body.end,(aaaa)=>{
    helper.getGooglePolyline("Helsinki", "Turku", (aaaa) => {
        console.log("POLYLINE SENDING " + aaaa);
        return res.send(JSON.stringify({"url": aaaa}));
    });
});







app.listen(3000);