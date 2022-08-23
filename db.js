/*
    Simulate a running database

        nodemon db.js

*/


const express = require("express");
app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// simulate database respond to get request
app.get("/dbget", (req, res) => {
    console.log("dbget");
    console.log({body: req.body});
    return res.status(200).json({code: 200, message: "This is the database talking from GET request: dbget", dbBodyReponse: req.body});
});

// simulate database respond to post request
app.post("/dbpost", (req, res) => {
    console.log("dbpost");
    console.log({body: req.body});
    return res.status(200).json({code: 200, message: "This is the database talking from POST request dbpost", dbBodyReponse: req.body});
});

// 404
app.get("*", (req, res) => {
    res.send("404");
})

app.listen(3002, function(req, res) { 
    console.log("DB Listening...");
});