/**
 * Created by Daniel on 30/03/2017.
 */
"use strict";
let map;
const dataArr = [
    {
        "startPoint": "Helsinki",
        "destination": "Turku",
        "carType": "Sedan",
        "carPassengers": 3,
        "carBaggage": 1,
    }, {
        "startPoint": "Turku",
        "destination": "Tampere",
        "carType": "Farmari",
        "carPassengers": 4,
        "carBaggage": 0,
    }, {
        "startPoint": "Joensuu",
        "destination": "Oulu",
        "carType": "Compact",
        "carPassengers": 1,
        "carBaggage": 0,
    }
];

const makeRidesList = () => {
    console.log("func called");
    for (const trip of dataArr) {
        console.log("looping");
        console.log(trip);
        document.getElementById("ridesContainer").innerHTML += makeRow(trip.startPoint, trip.destination, trip.carType, trip.carPassengers, trip.carBaggage);
    }
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

function initMap() {
    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 12
    });
};

$("#plan-ride-tab").click(()=>{
    console.log("tab presd");
    setTimeout(()=>{
        google.maps.event.trigger(map, "resize");
    },1);
});