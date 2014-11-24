var fs = require('fs');
var request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //ignore ssl cert issues
var config = JSON.parse(fs.readFileSync('./config.json', {encoding:'utf8'}));
var log = [];

var makeRequest = function(i){
  var requestUrl = config.urls[i];
  var logItem = {};
  logItem.url = requestUrl;
  log[i] = logItem;
  var begin = new Date();

  request
  .get({
      url:requestUrl
      ,headers: config.headers
  })
  .on('error', function(err) {
    console.log(err);
  })
  .on('response', function(response) {
    //console.log(response.statusCode);
    response.on('data', function (chunk) {
      var end = new Date();
      logItem.duration = end-begin;
      //console.log('BODY: ' + chunk);
      i+=1;
      if(config.urls.length > i){
        process.nextTick(function(){makeRequest(i)});
      } else
      {
        console.log(log);
      }
    });
    // response.on('close', function (e){
    //   console.log('response ended');
    // });
  });
}

makeRequest(0);