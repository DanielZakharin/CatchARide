/**
 * Created by Daniel on 30/03/2017.
 */
"use strict";
/*MAPS VARIABLES*/
let map;
let directionsService;
let directionsDisplay;

let geocoder;
let distanceMatrix;
/*END MAPS VARIABLES*/
const makeRidesList = () => {
    console.log("func called");
    /*for (const trip of dataArr) {
     console.log("looping");
     console.log(trip);
     document.getElementById("ridesContainer").innerHTML += makeRow(trip.startPoint, trip.destination, trip.carType, trip.carPassengers, trip.carBaggage);
     }*/
};

const makeRow = (start, end, cartype, carpass, carbag) => {
    return `<div class="container-fluid trip-container" >
        <div class="row">
        <div class="col-md-3 col-sm-6 col-xs-12">
        <img class="thumbnail map-thumbnail" src="https://www.google.com/maps/about/images/mymaps/mymaps-desktop-16x9.png"/>
        </div>
        <div class="col-md-5 col-sm-6 col-xs-12 container cat-information">
        <div class="row" style="margin-bottom:2em;">
        <h3 class="cat-title">` + start + ` - ` + end + `</h3>
        </div>
        <div class="row">
            <p class="col-md-10">Car: ` + cartype + `</p>
            <p class="col-md-10">Number of Passangers: ` + carpass + `</p>
            <p class="col-md-10">Number of luggage per passanger: ` + carbag + `</p>
        </div>
        </div>


        </div>
        <div class="row text-center" id="button-footer">
        <button class="btn button-footer-button" data-toggle="modal" data-target="#myModal">Join</button>
        </div>

        </div>`
};

makeRidesList();

/*GOOGLE MAPS*/
/**
 * Google maps callback function to initialize the map
 */
function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
        center: {lat: 60.1699, lng: 24.9384},
        zoom: 7
    });
    directionsDisplay.setMap(map);

    geocoder = new google.maps.Geocoder;

    distanceMatrix = new google.maps.DistanceMatrixService;
};

/**
 * Calculates route between two or more points and shows it on the map
 * @param directionsService
 * @param directionsDisplay
 */
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    let waypts = [];
    let wayptsGoogle = [];
    if (document.getElementById("waypoint1").value) {
        waypts.push(document.getElementById("waypoint1").value, document.getElementById("waypoint2").value);
        for (const pt of waypts) {
            wayptsGoogle.push(
                {
                    location: pt,
                    stopover: true
                });
        }
    };
    directionsService.route({
        origin: document.getElementById('start').value,
        waypoints: wayptsGoogle,
        destination: document.getElementById('end').value,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            calculateTotalDistance(document.getElementById('start').value, document.getElementById('end').value, waypts);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
/*EXAMPLE DIRECTION LISTENER FROM GOOGLE SITE
 function initMap() {
 var directionsService = new google.maps.DirectionsService;
 var directionsDisplay = new google.maps.DirectionsRenderer;
 var map = new google.maps.Map(document.getElementById('map'), {
 zoom: 7,
 center: {lat: 41.85, lng: -87.65}
 });
 directionsDisplay.setMap(map);

 var onChangeHandler = function() {
 calculateAndDisplayRoute(directionsService, directionsDisplay);
 };
 document.getElementById('start').addEventListener('change', onChangeHandler);
 document.getElementById('end').addEventListener('change', onChangeHandler);
 }

 WAYPOINTS

 var waypts = [];
 var checkboxArray = document.getElementById('waypoints');
 for (var i = 0; i < checkboxArray.length; i++) {
 if (checkboxArray.options[i].selected) {
 waypts.push({
 location: checkboxArray[i].value,
 stopover: true
 });
 }
 }
 */
/*EXAMPLE DISTANCE MATRIx FROM GOOGLE*/

const calculateTotalDistance = (origin, destination, waypts) => {
    console.log("calculate distance triggered");
    let totalTime = 0;
    let totalDist = 0;
    if (waypts) {
        calculateDistance(origin, waypts[0], (res,dist) => {
            totalTime += res;
            totalDist += dist;
            calculateDistance(waypts[waypts.length - 1], destination, (res,dist) => {
                totalTime += res;
                totalDist += dist;
                for (let i = 0; i < waypts.length - 1; i++) {
                    calculateDistance(waypts[i], waypts[i + 1], (res,dist) => {
                        totalDist += dist;
                        totalTime += res;
                        console.log(totalTime / 60 + "total time :D, totla dist " + totalDist/1000);
                    });
                }
            })
        });
    }

};

const calculateDistance = (origin, destination, callback) => {
    return distanceMatrix.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {
            const originList = response.originAddresses;
            const destinationList = response.destinationAddresses;
            const results = response.rows[0].elements;
            console.log(results[0].duration);
            callback(results[0].duration.value,results[0].distance.value);//[results[0].distance, results[0].duration]
        }
    });
}

/*END GOOGLE MAPS*/
$("#routeTestBtn").click(() => {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    //calculateTotalDistance("Helsinki","Turku",["Salo","Kaarina"]);
});

$("#plan-ride-tab").click(() => {
    console.log("tab presd");
    setTimeout(() => {
        google.maps.event.trigger(map, "resize");
    }, 1);
});

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