/**
 * Created by Daniel on 28/04/2017.
 */
$("#login-register-submit").click((event)=>{
    config.genericPostMethod("/register",{email:"test@test.com",username: "teseter"+Date.now(),password:"test123"},(rs)=>{
        console.log(rs);
    })
});
/*
$("#login-submit").click((event)=>{
    console.log("Clicked ligin ");
    config.genericPostMethod("/login",{username: "teseter1493374047332",password:"test123"},(rs)=>{
        console.log(rs);
    })
});*/