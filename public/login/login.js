/**
 * Created by Daniel on 28/04/2017.
 */
$("#login-register-submit").click((event) => {
    config.genericPostMethod("/register", {
        email: config.valueOfField("login-register-email"),
        username: config.valueOfField("login-regiser-username"),
        password: "123"
    }, (rs) => {
        console.log(rs);
    })
});

$("#login-submit").click((event) => {
    console.log("Clicked ligin ");
    config.genericPostMethod("/login", {username: config.valueOfField("login-username"), password: config.valueOfField("login-password")}, (res) => {
        console.log(res);
    });
});