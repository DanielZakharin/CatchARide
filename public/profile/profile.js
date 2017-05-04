/**
 * Created by Daniel on 03/05/2017.
 */

"use strict";
let currentRide;
let pendingList;

const populateOwnRides = () => {
    config.getCurrentUser((data) => {
        if (data.status) {
            config.genericGetMethod("/userRides/" + data.user._id, function (res) {
                /*for (let obj of res){
                 console.log(obj.passangersPending);
                 //document.getElementById("profile-container").innerHTML += obj.passangersPending;
                 }*/
                console.log(res);
                document.getElementById("profile-container").innerHTML = "";
                for (let i = 0; i < res.length; i++) {
                    console.log("THIS IS DICKS");
                    document.getElementById("profile-container").innerHTML += makeRow(res[i]);
                }
            });
        }
    });
};

const makeRow = (obj) => {
    let row = `<div class="container-fluid trip-container" >
        <div class="row">
        <div class="col-md-3 col-sm-6 col-xs-12">
        <img class="thumbnail map-thumbnail" src="` + obj.thumbnail + `"/>
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
            <p class="col-md-10">Interested: ` + obj.passangersPending.length + `</p>
            <p class="col-md-10">Accepted: ` + obj.passangersAccepted.length + `</p>
        </div>
        </div>
        </div>
        <div class="row text-center" id="profile-button-footer">
`;
    if (obj.passangersPending.length > 0) {
        row +=
            `
        <button data-id="` + obj._id + `" class="btn profile-view-passengers">View Interested</button>
        `
    } else {
        row +=
            `
        <button data-id="` + obj._id + `" class="btn profile-view-passengers disabled" disabled>View Passengers</button>
        `
    }
    row += `
<button data-id="` + obj._id + `" class="btn profile-delete-ride btn-danger" href="#sure` +  obj._id +  `" data-toggle="collapse">DELET</button>
<div class="collapse" id="sure`  + obj._id + `">Are you sure?<br><button class="btn btn-success" data-toggle="collapse" href="#sure` +  obj._id +  `">NO</button><button data-id="` + obj._id + `" class="profile-delet btn btn-danger">YES</button></div>
</div>
        </div>`

    return row;
};

const makeRowPassenger = (obj) => {
    return `
    <tr class="profile-passenger-pending" >
    <th data-id="` + obj.userID + `">` + obj.address + `</th>
    <th data-id="` + obj.userID + `">` + obj.email + `</th>
    <th class="profile-selected-checkbox" data-id="` + obj.userID + `"><input type="checkbox" data-id="` + obj.userID + `"></th>
</tr>
    `
};

populateOwnRides();

const findInPendingForId = (id) => {
    for (const user of pendingList) {
        if (user.userID == id) {
            return user;
        }
    }
}
$("#profile-container").on("click", ".profile-view-passengers", (event) => {
    const id = $(event.target).attr("data-id");
    console.log(id);
    config.genericGetMethod("/singleRide/" + id, (res) => {
        console.log(res);
        currentRide = res;
        pendingList = res.passangersPending;
        document.getElementById("profile-modal-body").innerHTML = "";
        for (const obj of res.passangersPending) {
            console.log(obj);
            document.getElementById("profile-modal-body").innerHTML += makeRowPassenger(obj);
        }
        $('#profile-modal').modal('show');
    });
});

$("#profile-modal-body").on("click", ".profile-passenger-pending", (event) => {
    const id = $(event.target).attr("data-id");
});

$("#profile-modal-body").on("change", ".profile-selected-checkbox", (event) => {
    const id = $(event.target).attr("data-id");

    if ($(this).is(':checked')) {
        // Checkbox is checked.
        console.log("check me " + id);
    } else {
        // Checkbox is not checked.
        console.log("check me out" + id);
    }

});

$("#profile-accept").click((event) => {
    let tempArr = [];
    $(":checkbox").each(function (index, element) {
        let id = $(element).attr('data-id'); // grab value of original
        let ischecked = $(element).is(":checked"); //check if checked
        console.log(id + " " + ischecked);
        if (ischecked) {
            const tempUser = findInPendingForId(id);
            if (tempUser) {
                tempArr.push(tempUser);
            }
        }
    });
    currentRide.passangersAccepted = currentRide.passangersAccepted.concat(tempArr);
    currentRide.passangersPending = currentRide.passangersPending.filter(function (item) {
        return tempArr.indexOf(item) === -1;
    });
    config.genericPutMethod("/updateRide", currentRide, (res) => {
        console.log(res);
        if (res.status) {
            for(const user of tempArr){
                config.genericPostMethod("/sendMail",{
                    address: user.email,
                    title: "You have been accepted for a Ride™",
                    body: "You are eligible to join the Ride™ leaving " + currentRide.departureLocation
                    + " going to " + currentRide.arrivalLocation + " on " + currentRide.departureDate,
                },(res)=>{

                });
            }
            window.location.replace("/profile");
        }
    });
});

$("body").on("click",".profile-delet",(event)=>{
    const id = $(event.target).attr("data-id");
    console.log(id);
    config.genericDELETMethod("/deletRide",{id:id},(res)=>{
        if(res.status){
            console.log(res);
            window.location.replace("/profile");
        }else {
            console.log(res);
        }
    })
});






