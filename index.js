/**
 * Created by Daniel on 30/03/2017.
 */
const express = require("express");
const app = express();


app.use(express.static("public"));

app.get("/test", (req,res) => {
    res.send("help me oh god");
});


app.listen(3000);