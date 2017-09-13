var express = require('express');
var bodyParser = require('body-parser');
var apps = express();
apps.use(bodyParser.json());
let ApiAiApp = require('actions-on-google').ApiAiAssistant;
var appId = "6aac18a6";
var appKey ="40a7e359cb020a07ead5159c2d5d8162";
var url = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/MAA/dep/2017/09/15/15?appId&appKey&utc=false&numHours=1&maxFlights=5"

apps.get("/", function (req, res) {
    res.send("Server is running");
});
function callApi(req, res) {
    const app1 = new ApiAiApp({ request: req, response: res });
    
    var intent = app1.getIntent();
   if(intent == "WelcomeIntent")
   {
       app1.ask("Hello ! What can i do for you test?");
   }
}
apps.post("/", function (req, res) {
    callApi(req, res);

});
apps.listen(process.env.PORT || 3000, function () {

});
