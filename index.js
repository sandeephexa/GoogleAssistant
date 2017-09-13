var express = require('express');
var bodyParser = require('body-parser');
var apps = express();
apps.use(bodyParser.json());
let ApiAiApp = require('actions-on-google').ApiAiAssistant;
const appId = "6aac18a6";
const appKey ="40a7e359cb020a07ead5159c2d5d8162";
var url = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/MAA/dep/2017/09/15/15?appId&appKey&utc=false&numHours=1&maxFlights=5"

apps.get("/", function (req, res) {
    res.send("Server is running");
});
function callApi(req, res) {
    const app1 = new ApiAiApp({ request: req, response: res });
    
    var intent = app1.getIntent();
    
    let flightdate = app1.getArgument('date').split('-');
    let flightno = app1.getArgument('any');
    let carrier = app1.getArgument('flight_names');

   if(intent == "WelcomeIntent")
   {
       app1.ask("Hello ! What can i do for you ?");
   }
   else if(intent == " FlightStatusByAirport")
   {
        app1.ask("provide your airport name ");
        
   }
   else if(intent == " AirportNameIntent")
   {
       var airport = app1.getArgument(Airports);
        console.log(airport);
         app1.ask("tell me the Departure Date along with year. example: 10 september 2017 ");

   }
   else if(intent == " AirLineNameIntent")
   {
        var date = app1.getArgument(date);
        console.log(airport);
        app1.ask("specify the airline name ");
   }
   else if(intent == " FlightTimeIntent")
   {
        var airline = app1.getArgument(Airlines);
        console.log(airport);
        app1.ask("give the hour of departure from 0 to 23");
   }
   else if(intent == " FlightListIntent")
   {
        app1.ask("status ");
   }
   else if(intent == " ThankYouIntent")
   {
        app1.ask("Thank you ! Have a nice day.");
   }
}
apps.post("/", function (req, res) {
    callApi(req, res);

});
apps.listen(process.env.PORT || 3000, function () {

});
