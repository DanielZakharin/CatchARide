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

config.setvalueOfField = (id, val) => {
    document.getElementById(id).innerHTML = val;
};

config.valueOfField = (id) => {
    return document.getElementById(id).value;
};