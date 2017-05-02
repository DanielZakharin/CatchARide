/**
 * Created by Daniel on 28/04/2017.
 */
$("#login-register-submit").click((event) => {
    config.genericPostMethod("/register", {
        email: config.valueOfField("login-register-email"),
        username: config.valueOfField("login-register-username"),
        password: config.valueOfField("login-register-password")
    }, (res) => {
        console.log(res);
        if(res.status){
            window.location.replace("/");
        }else {
            window.alert(res.message);
        }
    })
});

$("#login-submit").click((event) => {
    config.genericPostMethod("/login", {username: config.valueOfField("login-username"), password: config.valueOfField("login-password")}, (res) => {
        console.log(res);
        if(!res.error){
            window.location.replace("/")
        }else {
            window.location.replace("/login")
        }
    });
});