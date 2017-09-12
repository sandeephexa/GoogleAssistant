var express = require("express");
const app = express();
var bodyParser = require("body-parser");
var ApiAiApp = require("actions-on-google").ApiAiApp;
// const apps = new ApiAiApp({request: request, response: response});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',function(req,res)
{
    res.send("getting");
});
function handleIntents(req,res)
{
    const apps = new ApiAiApp({ request: req, response: res });
    var intent = apps.getIntent();

    if(intent == "WelcomeIntent")
    {
        res.send("Hello ! what can i do for you? ");
    }
    else if(intent = "FlightStatusByAirport")
    {
        res.send("Sure ! provide your airport name");
    }
    else if(intent == "AirportNameIntent")
    {
        res.send("tell me the Departure Date along with year. ex: 10 september 2017");
    }
    else if(intent = "AirLineNameIntent")
    {
        res.send("specify the airline name");
    }
    
}
app.post('/',function(req,res)
{
    console.log("hello");
});
app.listen(process.env.PORT || 3008, function(message)
{
    console.log("listening on 3008");
});
