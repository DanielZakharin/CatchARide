/**
 * Created by Daniel on 30/03/2017.
 */
"use strict";

/*USEFULL METHODS*/
//URL https://maps.googleapis.com/maps/api/directions/json?origin=Boston,MA&destination=Concord,MA&waypoints=Charlestown,MA|Lexington,MA&key=YOUR_API_KEY
/*const getGooglePolyline = (start,end,locArr) => {
 let polylineUrl = "https://maps.googleapis.com/maps/api/directions/json?origin=";
 polylineUrl += start;
 polylineUrl = polylineUrl +"&destination="+end;
 if(locArr && locArr.length>0) {
 polylineUrl += "&waypoints=";
 for (const wp of locArr) {
 polylineUrl+=wp+"|"
 }
 }
 polylineUrl += "&mode=driving&key=" + config.apiKey;
 console.log("accessing polylineUrl " + polylineUrl);
 genericGetMethod(polylineUrl,(response)=>{
 console.log(response.overwiev_polyline.points)
 });
 //https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc
 return polylineUrl;
 };*/

const genericGetMethod = (url, callbackMethod) => {
    const myRequest = new Request(url, {
        method: "GET",
        headers: {
            /*'Access-Control-Allow-Origin': '*',
             'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
             'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',*/
            'Content-Type': 'text/json'
        }
    });
    fetch(myRequest).then((response) => {
        if (response.ok) {
            console.log("")
            console.log(response);
            return response.json();
        } else {
            console.log("response is not ok");
            throw new Error('Network response was not ok.');
        }
    }).then((response) => {
        callbackMethod(response);
    }).catch(function (error) {
        console.log('Problem in generic :( ' + error.message);
    });
};
/*END USEFUL METHODS*/

/*POPULATING METHODS FOR FRONT PAGE*/
const getAllRides = () => {
    genericGetMethod("/allRides", (response) => {
        console.log("getallRides");
        makeRidesList(response);
    });
};

const makeRidesList = (array) => {
    console.log("func called");
    for (const ride of array) {
        document.getElementById("ridesContainer").innerHTML += makeRow(ride);
    }
};

const getGooglePolyline = (start, end) => {
    const ret = (rett) => {
        return  rett;
    };
    genericGetMethod("/googlePolyline", (res) => {
        console.log(res.url);
        ret(res.url);
    })
};

const makeRow = (obj) => {
    const ret = (rett) => {
        return `<div class="container-fluid trip-container" >
        <div class="row">
        <div class="col-md-3 col-sm-6 col-xs-12">
        <img class="thumbnail map-thumbnail" src="` + /*getGooglePolyline(obj.departureLocation, obj.arrivalLocation)*/ rett + `"/>
        </div>
        <div class="col-md-5 col-sm-6 col-xs-12 container cat-information">
        <div class="row" style="margin-bottom:2em;">
        <h3 class="ride-title">` + obj.departureLocation + ` - ` + obj.arrivalLocation + `</h3>
        <h3 class="ride-title">` + obj.departureDate + ` , ` + obj.departureTime + `</h3>
        </div>
        <div class="row">
            <p class="col-md-10">Car: ` + obj.cartype + `</p>
            <p class="col-md-10">Number of Passangers: ` + obj.passengerNumber + `</p>
            <p class="col-md-10">Luggage Allowed: ` + obj.luggageAllowed + `</p>
            <p class="col-md-10">Payment: ` + obj.payment + `</p>
            
        </div>
        </div>


        </div>
        <div class="row text-center" id="button-footer">
        <button class="btn button-footer-button" data-toggle="modal" data-target="#myModal">Join</button>
        </div>

        </div>`
    };
    genericGetMethod("/googlePolyline", (res) => {
        console.log(res.url);
        ret(res.url);
    })
};
console.log("THIS IS CONFIG " + config.apiKey);
getAllRides();

/*END POPULATING METHODS*/


$("#login-submit").click((event) => {
    console.log("login clicked");
    /*const formData = new FormData();
     formData.append("test","test");*/
    const test = {"test": "test"};
    const url = "http://localhost:3000";
    const myRequest = new Request(url + "/newUser", {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json"
        }),
        body: test

    });
    //console.log(formData);
    fetch(myRequest).then(function (response) {
        console.log(response);
    });

});