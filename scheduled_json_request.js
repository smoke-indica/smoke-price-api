var requestLib = require("request");
var fs = require("fs");

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
    // HUG REST API server link
    api_host = `https://btsapi.grcnode.co.uk`;
  } else {
    // dev server
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

function return_query (target_market, filename) {
  const qs_input = {
    //  HUG REST GET request parameters
    market_pair: target_market, // input
    api_key: '123abc'
  };
  return hug_request('HUG', 'market_ticker', qs_input)
  .then(result => {
    result['timestamp'] = new Date();
    fs.writeFileSync(`/root/blog/indica/themes/landscape/source/json/${filename}`, JSON.stringify(result));
    console.log(`${target_market} ${result}`);
  })
  .catch(err => {
    console.log(new Error(err));
    console.warn(`Failed to updatade ${filename}`);
  })
}

setInterval(() => {
  console.log("running!")
  return_query('RUDEX.SMOKE:BTS', 'rudexsmoke_bts.json')
  return_query('SMOKE:BTS', 'smoke_bts.json')
  return_query('BTS:USD', 'bts_usd.json')
}, 30000);
