/**
 * Created by Daniel on 03/05/2017.
 */

const populateOwnRides = () => {
    config.getCurrentUser((data) => {
        if (data.status) {
            config.genericGetMethod("/userRides/" + data.user._id, function (res) {
                /*for (let obj of res){
                 console.log(obj.passangersPending);
                 //document.getElementById("profile-container").innerHTML += obj.passangersPending;
                 }*/
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    console.log("THIS IS DICKS");
                    document.getElementById("profile-container").innerHTML += makeRow(res[i]);
                }
            });
        }
    });
};

const makeRow = (obj) => {
    return `<div class="container-fluid trip-container" >
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
        <button data-id="` + obj._id + `" class="btn profile-view-passengers">View Passengers</button>
        </div>
        </div>`
};

const makeRowPassenger = (obj) => {
    return `
    <tr>
    <th>` + obj.address + `</th>
    <th>` + obj.email + `</th>
</tr>
    `
};

populateOwnRides();

$("#profile-container").on("click", ".profile-view-passengers", (event) => {
    const id = $(event.target).attr("data-id");
    console.log(id);
    config.genericGetMethod("/singleRide/" + id, (res) => {
        console.log(res);
        for (const obj of res.passangersPending) {
            document.getElementById("profile-modal-body").innerHTML += makeRowPassenger(obj);
        }
        $('#profile-modal').modal('show');
    });
});