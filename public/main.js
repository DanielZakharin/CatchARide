/**
 * Created by Daniel on 30/03/2017.
 */
"use strict";
let currentRide;
let currentUser;
let geocoder;
let directionsService;
/*USEFULL METHODS*/

/*END USEFUL METHODS*/

/*POPULATING METHODS FOR FRONT PAGE*/
const getAllRides = () => {
    config.genericGetMethod("/allRides", (response) => {
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
        console.log("RETT" + rett);
        return rett;
    };
    config.genericGetMethod("/googlePolyline", (res) => {
        console.log(res.url);
        ret(res.url);
    });
};

const makeRow = (obj) => {
    return `<div class="container-fluid trip-container" >
        <div class="row">
        <div class="col-md-3 col-sm-6 col-xs-12">
        <img class="thumbnail map-thumbnail" src="` + /*getGooglePolyline(obj.departureLocation, obj.arrivalLocation)*/obj.thumbnail + `"/>
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
        <button data-id="` + obj._id + `" class="btn button-footer-button">Join</button>
        </div>
        </div>`
}
getAllRides();

/*END POPULATING METHODS*/


const setupModal = (obj) => {
    config.setvalueOfField("myModalLabel", obj.departureLocation + " - " + obj.arrivalLocation);
};

const checkUserExists = () => {
    const email = config.valueOfField("modal-email");
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
};

$("#ridesContainer").on("click", ".button-footer-button", (event) => {
    const id = $(event.target).attr("data-id");
    console.log("clicked on view btn" + id);
    config.genericGetMethod("/singleRide/" + id, (res) => {
        console.log("setting modal title to " + res.departureLocation);
        currentRide = res;
        setupModal(res);
        $('#myModal').modal('show');
    });
});

$("#modal-join").click((event) => {
    checkJoinFieldsValidity(() => {
        config.genericPostMethod("/joinRide", {
            "rideId": currentRide._id,
            username: config.valueOfField("join-username"),
            password: config.valueOfField("join-password")
        }, (res) => {
            if (res.error) {
                if (res.errorcode == 401) {
                    window.alert("Wrong username or password");
                }
            } else {
                console.log(res);
                if (res.status) {
                    $('#myModal').modal('hide');
                } else {
                    window.alert(res.message);
                }
            }
        });
    });

});


$("#join-address").on("blur", (event) => {
    console.log("BLURR" + event.target.id + config.valueOfField(event.target.id));
    if (config.valueOfField(event.target.id) != undefined && config.valueOfField(event.target.id) != "") {
        calcRoute(currentRide.departureLocation,currentRide.arrivalLocation,[config.valueOfField("join-address")],(dist) => {
            console.log(dist + " " + currentRide.maxDistance + " " + currentRide.totalDistance);
            const jee = (dist - currentRide.totalDistance)/2;
            console.log(jee);
        });
    }
});

$("#join-address").keyup(function (event) {
    console.log("keyup");
    if (event.keyCode == 13) {
        $("#"+event.target.id).blur();
    }
});

const checkMaxDistanceValidity = (start,end,waypoint, maxdistance) => {

};
/*EXPERIMENTAL*/
 const calcRoute = (start,end,waypts,callback) => {
     let wayArray = [];
     for (const pt of waypts){
         wayArray.push({
             location: pt,
             stopover: true
         });
     };

    var request = {
        origin: start,
        destination: end,
        waypoints: wayArray,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    console.log(request);
    directionsService.route(request, (response, status)=> {
        if (status == google.maps.DirectionsStatus.OK) {
            var route = response.routes[0];
            var summaryPanel = document.getElementById("directions_panel");
            // For each route, display summary information.
            computeTotalDistance(response,callback);
        } else {
            alert("directions response " + status);
        }
    });
}

function computeTotalDistance(result,callback) {
    var totalDist = 0;
    var totalTime = 0;
    var myroute = result.routes[0];
    for (let i = 0; i < myroute.legs.length; i++) {
        totalDist += myroute.legs[i].distance.value;
        totalTime += myroute.legs[i].duration.value;
    }
    callback(totalDist);
 }

/*END EXPERIMENTAL*/

const checkJoinFieldsValidity = (callback) => {
    if(config.valueOfField("join-address")) {
        geocoder.geocode({'address': config.valueOfField("join-address")}, function (results, status) {
            if (status == 'OK') {
                console.log("GOOGLE GEOCODE SUCCESFULL FOR ADDRESS");
                console.log(results);
                if(checkAddressLocationValidity(results)){
                    callback();
                }else{
                    window.alert("Not in finland");
                }
            } else {
                window.alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }else{
        window.alert("Please set an address");
    }
};

const checkAddressLocationValidity = (array) => {
    for(const obj of array) {
        for(const component of obj.address_components){
            if(component.short_name == "FI"){
                return true;
            }
        }
    }
    return false;
};

$('#myModal').modal({show: false});

function initMap(){
    console.log("google maps init ");
    geocoder = new google.maps.Geocoder;
    directionsService = new google.maps.DirectionsService;
};