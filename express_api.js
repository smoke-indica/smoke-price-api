var express = require("express");
var app = express();

var requestLib = require("request");

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

function request_smoke_price(market_pair) {
  var requestURL = `https://btsapi.grcnode.co.uk/market_ticker?market_pair=${market_pair}&api_key=123abc`;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    return request;
  }
}

function hug_request(target_url, target_function, qs_contents) {
  // Setting URL and headers for request

  var api_host = '';
  if (target_url === 'HUG') {
    // Change this to your own HUG REST API server (if you want)
    api_host = `https://btsapi.grcnode.co.uk`;
  } else {
    // Change for local dev hug rest api server
    api_host = `http://127.0.0.1:5000`;
  }

  var request_options = {
    url: `${api_host}/${target_function}`,
    method: 'GET', // GET request, not POST.
    json: true,
    headers: {
      'User-Agent': 'Smoke Indica',
      'Content-Type': 'application/json'
    },
    qs: qs_contents
  };

  // Return new promise
  return new Promise((resolve, reject) => {
    // Do async job
    requestLib(request_options, (err, resp, body) => {
        if (err) {
          // Returning an indication that the HUG REST query failed
          const error_message = err;
          console.log(`Error - we didn't get a proper response! URL: ${api_host}/${target_function}`);
          reject(error_message);
        } else {
          if (resp.statusCode === 200) {
            // Returning the body in a promise
            resolve(body);
          } else {
            // Don't want anything other than 200
            const error_message = resp;
            console.log("No error, but response != 200");
            reject(error_message);
          }
        }
    })
  });
}

app.get("/rudexsmokeprice", (req, res, next) => {
  const qs_input = {
    //  HUG REST GET request parameters
    market_pair: 'RUDEX.SMOKE:BTS', // input
    api_key: '123abc'
  };
  const market_body = hug_request('HUG', 'market_ticker', qs_input)
  .then(result => {
    console.log(result);
    res.json(result);
  })
});

app.get("/smokeprice", (req, res, next) => {
  const qs_input = {
    //  HUG REST GET request parameters
    market_pair: 'SMOKE:BTS', // input
    api_key: '123abc'
  };
  return hug_request('HUG', 'market_ticker', qs_input)
  .then(result => {
    console.log(result);
    res.json(result);
  })
});
