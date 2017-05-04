/**
 * Created by Daniel on 24/04/2017.
 */
const config = {};

config.apiKey = "AIzaSyASkaNSW9yX8HELM3sFITjPTGf914iFSro";
config.genericGetMethod = (url, callbackMethod) => {
    const myRequest = new Request(url, {
        method: "GET",
        headers: {
            'Content-Type': 'text/json'
        }
    });
    fetch(myRequest).then((response) => {
        if (response.ok) {
            console.log(response);
            return response.json();
        } else {
            console.log("response is not ok");
            throw new Error('Network response was not ok.');
            throw new Error(response);
        }
    }).then((response) => {
        console.log(callbackMethod);
        callbackMethod(response);
    }).catch(function (error) {
        console.log('Problem in generic GET :( ' + error + " @ " + url);
        console.log(error);
    });
};

config.genericPostMethod = (url, reqBody, callbackMethod) => {
    const myRequest = new Request(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reqBody)

    });
    fetch(myRequest).then((response) => {
        if (response.ok) {
            console.log(response);
            return response.json();
        } else {
            console.log("response is not ok, sending ");
            console.log(response);
            return ({error: true, errorcode: response.status});
        }
    }).then((response) => {
        callbackMethod(response);
    }).catch(function (error) {
        console.log('Problem in generic POST :( ' + error.message + " @ " + url);
    });
};

config.genericPutMethod = (url, reqBody, callbackMethod) => {
    const myRequest = new Request(url, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reqBody)

    });
    fetch(myRequest).then((response) => {
        if (response.ok) {
            console.log(response);
            return response.json();
        } else {
            console.log("response is not ok, sending ");
            console.log(response);
            return ({error: true, errorcode: response.status});
        }
    }).then((response) => {
        callbackMethod(response);
    }).catch(function (error) {
        console.log('Problem in generic PUT :( ' + error.message + " @ " + url);
    });
};

config.setvalueOfField = (id, val) => {
    document.getElementById(id).innerHTML = val;
};

config.valueOfField = (id) => {
    return document.getElementById(id).value;
};

config.checkUserLogged = (callback) => {
    $.getJSON("/user_data", (data) => {
        console.log("DATA");
        console.log(data);
        if (data.status) {
            callback(true);
        } else {
            callback(false);
        }
    })
};

config.getCurrentUser = (callback) => {
    $.getJSON("/user_data", (data) => {
        console.log("DATA");
        console.log(data);
        callback(data);
    })
};

$("#navbar-login").click((event) => {

});

$("#navbar-login-container").on("click", "#navbar-login", (event) => {
    console.log("FROM CONFIG");
    $('#login-modal').modal('show');
    $.getJSON("/user_data", (data) => {
        if (data.status) {
            document.getElementById("login-modal-body").innerHTML = `
            <a id="login-modal-logout" href="/logout" class="btn btn-default">Log Out</a>
            `;
        } else {
            document.getElementById("login-modal-body").innerHTML = `<form action="/login" method="post">
                <input name="username" id="login-username" type="text" placeholder="Username">
                <input name="password" id="login-password" type="password" placeholder="Password">
                <button type="submit" id="login-submit" class="btn ">Log In</button>
            </form>
            `;
        }
    })
});

const setupNavBar = () => {
    console.log("Setting up navbar");
    $.getJSON("/user_data", (data) => {
        if (data.status) {
            document.getElementById("navbar-login-container").innerHTML = `
            <a id="login-modal-logout" href="/logout" class="btn btn-default">Log Out</a>
            `;
            document.getElementById("navbar-links").innerHTML += `
            <li id="navbar-profile"><a href="/profile">Profile</a></li>
            <li id="navbar-planride"><a href="/planride">Plan a new Ride</a></li>
`
            console.log(window.location.pathname);
            if(window.location.pathname == "/planride/"){
                $("#navbar-planride").addClass("active");
            }else if(window.location.pathname == "/profile/"){
                $("#navbar-profile").addClass("active");
            }
        } else {
            document.getElementById("navbar-login-container").innerHTML = `<button class="btn btn-primary" id="navbar-login">Log In</button>
            `;
        }
    });
};

setupNavBar();