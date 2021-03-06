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

$("#ridesContainer").on("click", ".button-footer-button", (event) => {
    config.checkUserLogged((val) => {
        if (val) {
            const id = $(event.target).attr("data-id");
            console.log("clicked on view btn" + id);
            config.genericGetMethod("/singleRide/" + id, (res) => {
                console.log("setting modal title to " + res.departureLocation);
                currentRide = res;
                setupModal(res);
                $('#myModal').modal('show');
            });
        }
        else {
            config.showAlertWithMessage("You need to log in first");
        }
    });
});

$("#modal-join").click((event) => {
    $.getJSON("/user_data", (data) => {
        console.log("DATA");
        console.log(data);
        if (data.status) {
            checkJoinFieldsValidity(() => {
                config.genericPostMethod("/joinRide", {
                    rideId: currentRide._id,
                    address: config.valueOfField("join-address"),
                    user: JSON.stringify(data.user)
                }, (res) => {
                    if (res.error) {
                    } else {
                        console.log(res);
                        if (res.status) {
                            $('#myModal').modal('hide');
                        } else {
                            config.showModalAlertWithMessage(res.message);
                        }
                    }
                });
            });
        } else {
            config.showModalAlertWithMessage("Please log in");
        }
    });
});


$("#join-address").on("blur", (event) => {
    console.log("BLURR");
    console.log(currentRide);
});

$("#join-address").keyup(function (event) {
    console.log("keyup");
    if (event.keyCode == 13) {
        $("#" + event.target.id).blur();
    }
});

const checkMaxDistanceValidity = (start, end, waypoint, maxdistance) => {

};
/*EXPERIMENTAL*/
const calcRoute = (start, end, waypts, callback) => {
    let wayArray = [];
    for (const pt of waypts) {
        wayArray.push({
            location: pt,
            stopover: true
        });
    }
    ;

    var request = {
        origin: start,
        destination: end,
        waypoints: wayArray,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
            var route = response.routes[0];
            var summaryPanel = document.getElementById("directions_panel");
            // For each route, display summary information.
            computeTotalDistance(response, callback);
        } else {
            alert("directions response " + status);
        }
    });
}

function computeTotalDistance(result, callback) {
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
    if (config.valueOfField("join-address")) {
        geocoder.geocode({'address': config.valueOfField("join-address")}, function (results, status) {
            if (status == 'OK') {
                console.log("GOOGLE GEOCODE SUCCESFULL FOR ADDRESS");
                console.log(results);
                if (checkAddressLocationValidity(results)) {
                    calcRoute(currentRide.departureLocation, currentRide.arrivalLocation, [config.valueOfField("join-address")], (dist) => {
                        console.log(dist + " " + currentRide.maximumDistance + " " + currentRide.totalDistance);
                        const jee = (dist - currentRide.totalDistance) / 2;
                        console.log(jee + "EXTRA DISRTANCE" + currentRide.maximumDistance);
                        if (currentRide.maximumDistance > jee) {
                            console.log("Not too far");
                            console.log(currentRide.passengerNumber - currentRide.passangersAccepted.length - config.valueOfField("join-passengers"));
                            if (currentRide.passengerNumber - currentRide.passangersAccepted.length - config.valueOfField("join-passengers")>= 0) {
                                callback();
                            }else {
                                config.showModalAlertWithMessage("Too many passengers");
                            }
                        } else {
                            console.log("TOO FAR MAN TOO FAR");
                            //document.getElementById("modal-join").disabled = true;
                            config.showModalAlertWithMessage("The address you have given is too far from the route");
                            //$("#modal-join").addClass("disabled");
                        }
                    });

                } else {
                    config.showModalAlertWithMessage("Not in finland");
                }
            } else {
                config.showModalAlertWithMessage('Geocode was not successful for the following reason: ' + status);
            }
        });
    } else {
        config.showModalAlertWithMessage("Please set an address");
    }

}


const checkAddressLocationValidity = (array) => {
    for (const obj of array) {
        for (const component of obj.address_components) {
            if (component.short_name == "FI") {
                return true;
            }
        }
    }
    return false;
};



$('#myModal').modal({show: false});

function initMap() {
    console.log("google maps init ");
    geocoder = new google.maps.Geocoder;
    directionsService = new google.maps.DirectionsService;
};
