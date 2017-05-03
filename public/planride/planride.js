/**
 * Created by Daniel on 21/04/2017.
 */
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
let flipFlop = true;
let totalDistance = 0;

/*GOOGLE MAPS*/
/**
 * Google maps callback function to initialize the map
 */
function initMap() {
    console.log("initmap called");
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
        center: {lat: 60.1699, lng: 24.9384},
        zoom: 7
    });
    directionsDisplay.setMap(map);

    geocoder = new google.maps.Geocoder;

    distanceMatrix = new google.maps.DistanceMatrixService;

    google.maps.event.addListener(map, 'click', (event) => {
        geocoder.geocode({
            'latLng': event.latLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    setDepArr(results[0].formatted_address);
                }
            }
        });
    });

    setTimeout(() => {
        google.maps.event.trigger(map, "resize");
    }, 1);
};

/**
 * Calculates route between two or more points and shows it on the map
 * @param directionsService
 * @param directionsDisplay
 */
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    let waypts = [];
    let wayptsGoogle = [];
    if (document.getElementById("waypoint1")) {
        if (document.getElementById("waypoint1").value) {
            waypts.push(document.getElementById("waypoint1").value, document.getElementById("waypoint2").value);
            for (const pt of waypts) {
                wayptsGoogle.push(
                    {
                        location: pt,
                        stopover: true
                    });
            }
        }
    }
    ;
    directionsService.route({
        origin: document.getElementById('planride-start').value,
        waypoints: wayptsGoogle,
        destination: document.getElementById('planride-end').value,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            //calculateTotalDistance(document.getElementById('start').value, document.getElementById('end').value, waypts);
        } else {
            window.alert("Address not found");
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
/**
 * Calculates total distance
 */
/*const calculateTotalDistance = (origin, destination, waypts) => {
 console.log("calculate distance triggered");
 let totalTime = 0;
 let totalDist = 0;
 if (waypts) {
 calculateDistance(origin, waypts[0], (res, dist) => {
 totalTime += res;
 totalDist += dist;
 calculateDistance(waypts[waypts.length - 1], destination, (res, dist) => {
 totalTime += res;
 totalDist += dist;
 for (let i = 0; i < waypts.length - 1; i++) {
 calculateDistance(waypts[i], waypts[i + 1], (res, dist) => {
 totalDist += dist;
 totalTime += res;
 console.log(totalTime / 60 + "total time :D, totla dist " + totalDist / 1000);
 });
 }
 })
 });
 }

 };*/

/**
 * calculates  distance and time between two points
 * @param origin
 * @param destination
 * @param callback
 * @returns {*}
 */
const calculateDistance = (origin, destination, callback) => {
    console.log(typeof origin);
    console.log(typeof destination);
    return distanceMatrix.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
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
            if (callback) {
                callback(results[0].duration.value, results[0].distance.value);//[results[0].distance, results[0].duration]
            }
        }
    });
};

/*END GOOGLE MAPS*/

/**
 * sets departure and arrival locations alternatively
 * @param address
 */
const setDepArr = (address) => {
    if (flipFlop) {
        document.getElementById("planride-start").value = address;
        flipFlop = !flipFlop;
    } else {
        document.getElementById("planride-end").value = address;
        flipFlop = !flipFlop;
    }
    calculateAndDisplayRoute(directionsService, directionsDisplay);
};

/**
 * constructs an object from all fields
 * @returns {{}}
 */
const constructObjectFromFields = (callback) => {
    config.getCurrentUser((data)=>{
        const newRide = {};
        newRide.departureDate = config.valueOfField("planride-departureDate");
        newRide.departureTime = config.valueOfField("planride-departureTime");
        newRide.arrivalTime = config.valueOfField("planride-arrivalTime");
        newRide.departureLocation = config.valueOfField("planride-start");
        newRide.arrivalLocation = config.valueOfField("planride-end");
        newRide.passengerNumber = config.valueOfField("planride-passengers");
        newRide.luggageAllowed = config.valueOfField("planride-luggage");
        newRide.cartype = config.valueOfField("planride-cartype");
        newRide.payment = config.valueOfField("planride-payment");
        newRide.username = config.valueOfField("planride-username");
        newRide.password = config.valueOfField("planride-password");
        newRide.maximumDistance = config.valueOfField("planride-maxdistance");
        newRide.totalDistance = totalDistance;
        newRide.driverId = data.user._id;
        callback(newRide);
    })
};
/*
 const checkUserExists = () => {
 const email = config.valueOfField("planride-email");
 config.genericGetMethod("/singleUser/:" + email, (res) => {
 if (!res.hasOwnProperty("error")) {
 console.log("found single user ");
 console.log(res);
 if (res.length > 0) {
 return true;
 } else {
 config.genericPostMethod("/newUser", {"userName": "guest" + Date.now(), "email": email}, (res) => {
 console.log(res);
 });
 window.alert("A new usera was created for email " + email);
 return true;
 }
 } else {
 window.alert("ERROR WITH USER FETCH");
 return false;
 }
 })
 };*/


const updateDistance = () => {
    const i = config.valueOfField("planride-start");
    const j = config.valueOfField("planride-end");
    if(i != undefined && i != "" && j != undefined && j != ""){
        console.log(i + "  " + j);
        calculateDistance(i.toString(),j.toString(),(time,distnace)=>{
            totalDistance = distnace;
            console.log("distance now at" + totalDistance);
        })
    }
}
/*EVENT LISTENERS*/
$("#plan-ride-tab").click(() => {
    console.log("tab presd");
    setTimeout(() => {
        google.maps.event.trigger(map, "resize");
    }, 1);
});

$("#planride-submit").click((event) => {
    //check email, create new user if needed
    //checkUserExists();
    constructObjectFromFields((obj)=>{
        config.genericPostMethod("/newRide", obj, (res) => {
            console.log(res);
            if (res.error) {
                if (res.errorcode == 401) {
                    window.alert("Wrong username or password");
                }
            } else {
                console.log("All okay");
            }
        });
    });
});

$(".deparr").on("blur", (event) => {
    console.log("BLURR" + event.target.id + config.valueOfField(event.target.id));
    if (config.valueOfField(event.target.id) != undefined && config.valueOfField(event.target.id) != "") {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
        if ((config.valueOfField(event.target.id) != undefined && config.valueOfField(event.target.id) != "")) {
            calculateDistance();
            updateDistance();
        }
    }
});

$(".deparr").keyup(function (event) {
    console.log("keyup");
    if (event.keyCode == 13) {
        $("#"+event.target.id).blur();
    }
});
/*END EVENT LISTENERS*/