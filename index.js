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
const async = require("async");
const cookieParser = require("cookie-parser");
const nodemailer = require('nodemailer');
/*END CONSTANTS*/

/*EXPRESS*/
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*CUSTOM MODULES*/
const DB = require("./modules/dbmodule.js");
DB.connect();
const ridesModule = require("./modules/ridesModules.js");
const usersModule = require("./modules/usersmodule.js");
const miscModule = require("./modules/miscmodule.js");

app.use(ridesModule);
app.use(usersModule);
app.use(miscModule);


app.use(express.static("public"));

app.listen(3000);