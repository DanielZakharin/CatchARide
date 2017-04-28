/**
 * Created by Daniel on 30/03/2017.
 */
"use strict";
let currentRide;
let currentUser;
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

$("#modal-join").click((event)=>{
    checkUserExists();
    config.genericPostMethod("/joinRide",{
        "rideId": currentRide._id,
        "joinerId": currentUser._id
    },(res)=>{
        console.log("Rs from modal join");
        console.log(res);
    })
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

$('#myModal').modal({show: false})