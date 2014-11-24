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
      url:requestUrl//'https://localhost/MySolarCity/api/ambassador/account/summary?publicContactGuid=4b41c9e0-93af-4a19-a9df-0b45937ddd9c'
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

// request
//   .get(
//   {
//       // url:config.urls[i]//'https://localhost/MySolarCity/api/ambassador/account/summary?publicContactGuid=4b41c9e0-93af-4a19-a9df-0b45937ddd9c'
//       // ,headers: config.headers
//       url:'https://localhost/MySolarCity/api/ambassador/account/summary?publicContactGuid=4b41c9e0-93af-4a19-a9df-0b45937ddd9c'
//       ,headers: {
//         'Cookie': 'ASP.NET_SessionId=crh5lfovvnvs3kto0qx0esb1; FedAuth=77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U2VjdXJpdHlDb250ZXh0VG9rZW4gcDE6SWQ9Il9lODQ4ZGJjNy1lMzRjLTRhNTQtYWU1MC0xZmVhN2NmNDcxNzAtNjYwMDE5MUJBM0I1M0UyMkQ0QkQ5MDNDQzEzMkY2NjMiIHhtbG5zOnAxPSJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXdzc2VjdXJpdHktdXRpbGl0eS0xLjAueHNkIiB4bWxucz0iaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3Mtc3gvd3Mtc2VjdXJlY29udmVyc2F0aW9uLzIwMDUxMiI+PElkZW50aWZpZXI+dXJuOnV1aWQ6NjRmNGNlNGUtYmVjYy00YzRjLTk1NTUtZmQ5NjhmYzgzYmRhPC9JZGVudGlmaWVyPjxDb29raWUgeG1sbnM9Imh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwNi8wNS9zZWN1cml0eSI+RTR6VHY2bW13d0FyVTRiNHJySXBVUlAvUXRxLzh0Wks3Z1hKOWR1MFNGMzJocXNtTDJyQmg3MC9yRkhIdThWMngzVzJGU2ZUVUVZVU5UMGpxN0hGYnczdE5Hd1EzNGtTYTdIT1BWSlVPYm5JREVpeUNLeitIVXRZYjFuRVlIeHlWcHE5czdEeDZvRGxQekVYVTJ0YlAzSk16K3dMYXBkUWJVT21oTFJyL0MxRWw1OGp4SFM4d3RkSnM2aWpZT3NzTnI4Q0JwUGxEajczVllqZlVyTXhGMlNKMHMwODNodVUybG9mS3lmam9BUktGckZCUnFnU0Q3VXpGQUNjbnQrM05RVnU3eGJ0SExsM2g2N0ZLOVJUN3JLdGtKclpvWE9yZ29FWVNSSHBSMDJFRDRFajU5QzJKSHphWHZtV1N4OGdBbWRza2ViUFNVNzY1ZFFMVkdaR2UvS1RONTdJVStxNE9yU1FIOU44KzRUeE9WS2tpNmVTVGFoVFlTdnZQRUhjd2V6L0RTYm1KbE5uT0lBOEZidlRhakJzajhSVHdEZ2VHbmo4ck5XYlZEdDZoZnVPVkl6T1Q1a205K08yT0NYNGcwMElQenRXSndDZ1VBMWtLK0VrZThOZXpqSmh2cDNzdDZRRUM1SkJQNEF4NVJlbXROcWgyVnRTWlo1OEI2U0p4UHJtQmNnWWNKQTU0R2tERFJaZzlQS3JkMCtUdmFxY0RyTFJ0RGw4RENtTzJBTUFOS240RVREZXlZbFpsbmdVTnU2MUFMQTE0dTcrWDVqVnM3b3VibWE3bDFoRTZ2bmhZS3Fyc3k3a3hXQXd2cnBvWWI1cTk2SWpXUjFJWVBobTRDUnRSUDY3Wk50U254ZnlIQkMxNTV5U0xhNG0yVXJSMlpLSFBLM01OME92U0cwNFk1RlJwNExQcnZhWmtZUy9yTnhENGlTajFGNTFQc0RZaDlqaisxdytLekl1dWlaZEg5YlJuMExkdlRYMlM3d3dzTUVHR0tNMXl3WVBJNFdhOUlibFc5ckpQeHlsZWJwMWw2MVA0djQ0UkhvWGRSd2xSaW91NDF3aVRBd04zOTdoWnZWdWIzbFF4OVZTM1YwRHQyM3laeHY5SmkzZnFWQzI4NEZFZVRZSm9qenBGVC94dzBtMUJEdlc2OGgrTkFMODZ1UzJIZXVIekdIUGRqU0dQR1FBQlM0WWFwd0xLY0tNRXRNTnBSYTFxdExNUUNmM1orMWYwQzUrbktoK3dDTmlGMWNndGM2elJSRkNsYWd2UVo2eGxSQlRLZmgvMXJzb3BSTnBrN2c0d1lMbTc5MG1DZytENXg5ZzdsUDJFa2diSVYzYVFUT0puQi9OV0MydGh0eWk5dms5RVEvS0wxMHQ0dENLeHg4YjRXVjR6Q1cwVGYr; FedAuth1=UUQ0ZzNHdUpoOEgzQ2VCbUhpVlNrRXBDZC92dmQ2ZjhlK0hRdXc5NDRhZUFDN2JRaUcvZFFwdk5yc2FnM2NITnp5SjdLd2U0PTwvQ29va2llPjwvU2VjdXJpdHlDb250ZXh0VG9rZW4+; _ga=GA1.1.237409346.1416252506'
//       }
//  //     ,rejectUnauthorized: false
//   })
//   .on('error', function(err) {
//     console.log(err)
//   })
//   .on('response', function(response) {
//     console.log(response.statusCode);
//     response.on('data', function (chunk) {
//       console.log('BODY: ' + chunk);
//     });
//   });