const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const port = process.env.PORT || 3001;

var click_urls_array = [];

function uuid(){
  var uuid = Math.random().toString(16).substr(2, 32);

  // Convert the random number to a UUID format.
  uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = uuid.substr(Math.floor(Math.random() * 16), 1);
    return r;
  });

  return uuid;
}

// Middleware to parse JSON in the request body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with your allowed origin(s)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get("/receive", (req, res) => {
  var click_url = req.query.clkurl;
  if(click_url != undefined){
    click_urls_array.push(click_url);
  }
  res.type("application/json").send(JSON.stringify({"message" : "Received", "url" : `${click_url}`}));
})

app.get("/request", (req,res) => {
  if(click_urls_array.length > 0){
    var click_url = click_urls_array.shift();
    res.type("application/json").send(JSON.stringify({"message" : "available", "url" : `${click_url}`}));
  }else{  
    res.type("application/json").send(JSON.stringify({"message" : "not_available"}));
  }
})

app.get("/getall", (req,res) => {
  res.type("application/json").send(JSON.stringify({"urls_array" : `${JSON.stringify(click_urls_array)}`}));
})

app.get("/pinging", (req,res) => {
  res.type("application/json").send(JSON.stringify({"message" : "Hello World"}));
})

var server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

var interval_var = setInterval(() => {
  https.get("https://expressrandom.onrender.com/pinging");
}, 10000)
