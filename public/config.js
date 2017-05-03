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
        }
    }).then((response) => {
        callbackMethod(response);
    }).catch(function (error) {
        console.log('Problem in generic :( ' + error.message);
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
        console.log('Problem in generic :( ' + error.message);
    });
};

config.setvalueOfField = (id, val) => {
    document.getElementById(id).innerHTML = val;
};

config.valueOfField = (id) => {
    return document.getElementById(id).value;
};

$("#navbar-login").click((event) => {

});

$("#navbar-login-container").on("click","#navbar-login",(event)=>{
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
        } else {
            document.getElementById("navbar-login-container").innerHTML = `<button class="btn btn-primary" id="navbar-login">Log In</button>
            `;
        }
    })
};

setupNavBar();