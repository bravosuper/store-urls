const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const port = process.env.PORT || 3001;

var click_urls_array = [];

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with your allowed origin(s)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get("/record", (req,res) => {
  var ip = req.query.ip;
  var click_url = req.query.clkurl;

  var obj = {ip, click_url};

  click_urls_array.push(obj);

  res.type("application/json").send(JSON.stringify(obj));
})

app.get("/getall", (req,res) => {
  res.type("application/json").send(JSON.stringify(click_urls_array));
})

app.get("/delete", (req,res) => {
  click_urls_array = [];
  res.type("application/json").send(JSON.stringify(click_urls_array));
})

var server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

var interval_var = setInterval(() => {
  https.get("https://expressrandom.onrender.com/pinging");
}, 10000)
