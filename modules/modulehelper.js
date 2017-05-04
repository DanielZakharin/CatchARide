/**
 * Created by Daniel on 04/05/2017.
 */

class helper {
    constructor() {

    }

    getGooglePolyline(start, end, callback, locArr) {
        console.log("PERSELINE");
        console.log(start + end);
        start = encodeURI(start);
        end = encodeURI(end);
        let polylineUrl = "https://maps.googleapis.com/maps/api/directions/json?origin=";
        polylineUrl += start;
        polylineUrl = polylineUrl + "&destination=" + end;
        if (locArr && locArr.length > 0) {
            polylineUrl += "&waypoints=";
            for (let wp of locArr) {
                wp = encodeURI(wp);
                polylineUrl += wp + "|"
            }
        }
        polylineUrl += "&mode=driving&key=" + process.env.apiKey;
        console.log("accessing polylineUrl " + polylineUrl);
        genericGetMethod(polylineUrl, (response) => {
            callback("https://maps.googleapis.com/maps/api/staticmap?&size=600x400&path=enc:" + response.routes[0].overview_polyline.points + "&key=" + process.env.apiKey);//.overview_polyline.points);
        });
        //https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc
        //return polylineUrl;
    }

    genericGetMethod(url, callbackMethod) {
        fetch(url).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            } else {
                console.log("response is not ok");
                console.log(response);
                throw new Error('Network response was not ok.');
            }
        }).then((response) => {
            callbackMethod(response);
        }).catch(function (error) {
            console.log('Problem :( ' + error.message);
        });
    }

    checkArrayForUserId(array, id) {
        for (const elem of array) {
            console.log("comaparing " + elem.userID + "  " + id);
            if (elem.userID == id) {
                console.log("returning true");
                return true;
            }
        }
        console.log("returning false");
        return false;
    }

    checkUser(req, res, next) {
        console.log("HELPPERONIES");
        if (req.user) {
            console.log(req.user);
            next();
        } else {
            res.redirect("/");
        }
    }

    sendMail(address, title, body, callback) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'catcharidemailer@gmail.com',
                pass: 'scooterman'
            }
        });

// setup email data with unicode symbols
        let mailOptions = {
            from: '"🚗Catch A Ride🚗" <catcharidemailer@gmail.com>', // sender address
            to: address, // list of receivers
            subject: title, // Subject line
            text: body, // plain text body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    };
}

module.exports = new helper();