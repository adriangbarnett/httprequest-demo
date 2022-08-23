/*

HTTP request with call back example.

    Simulate a running appliction that will send a http request to a database
    we then wait for the database to respond 

*/

const express = require("express");
app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const http = require("http");
const https = require("https");
const request = require("request");

// The router
app.get("/test", myController_get);
app.post("/test", myController_post);

// 404
app.get("*", (req, res) => {
    res.send("404");
})

app.listen(3001, function(req, res) { 
    console.log("APP Listening...");
});


// ----------------------------------------------
//  DEMO
// ----------------------------------------------
/*
    Demo POST controller
    Sent this REST request:

    POST http://localhost:3001/test
    Content-Type: application/json 

    {
        "url": "http://localhost:3002/",
        "method": "GET",
        "name": "bob",
        "email": "bob@mail.com"
    }


*/
async function myController_get(req, res) {

    try {

        const reqBody = req.body;

        // create the request body section
        const reqBodyJson = {
            name: reqBody.name,
            email: reqBody.email
        } 
        

        // convert the request body to json
        const reqBodyStr= JSON.stringify(reqBodyJson);
        
        // request options, append body to request
        const options = {
            url: reqBody.url,
            method: reqBody.method,
            headers: reqBody.headers,
            body: reqBodyStr
        }
        console.log({options: options});

        // send the HTTP requtest, wait for call back then display result
        doHttpRequest(options, function(myResponseCallback) { 
            return res.send({message: "repsone from http request", result: myResponseCallback});
        });

    } catch (e) {
        return res.send(e.stack)
    }

}

/*
    Demo POST controller
    Sent this REST request:

    POST http://localhost:3001/test
    Content-Type: application/json 

    {
        "url": "http://localhost:3002/",
        "method": "POST",
        "name": "bob",
        "email": "bob@mail.com"
    }


*/
async function myController_post(req, res) {

    try {

        const reqBody = req.body;

        // create the request body section
        const reqBodyJson = {
            name: reqBody.name,
            email: reqBody.email
        } 
      

        // convert the request body to json
        const reqBodyStr= JSON.stringify(reqBodyJson);
        
        

        // request options, append body to request
        const options = {
            url: reqBody.url,
            method: reqBody.method,
            headers: reqBody.headers,
            body: reqBodyStr,
          
        }
        console.log({options: options});

        // send the HTTP requtest, wait for call back then display result
        doHttpRequest(options, function(myResponseCallback) { 
            return res.send({message: "repsone from http request", result: myResponseCallback});
        });

    } catch (e) {
        return res.send(e.stack)
    }

}

// do a http request then respond to the callback
function doHttpRequest(options, myCallBack) {

   try {

    request.post(options).on('response', function(response) {
        
        var data = '';

        response.on("data", function (chunk) {
            data += chunk;
        });

        response.on('error', function(err) {
            return myCallBack(err);
        });

        response.on('end', function () {
            var resJson = JSON.parse(data);
            return myCallBack(resJson);
        });

    }) //.end(); // this seems to break the method

   } catch (e) {
        console.log({code: 500, message: "exception in http requesd", error: e.stack});
        return myCallBack({code: 500, message: "exception in http requesd", error: e.stack});
   }
}

