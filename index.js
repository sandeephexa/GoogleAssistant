var express = require("express");
const app = express();
var bodyParser = require("body-parser");
var ApiAiApp = require("actions-on-google").ApiAiAssistant;
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

    switch (intent) {
        case 'WelcomeIntent':
            app1.ask("hello ! what can i do for you ? test");
            break;
        case 'FlightStatusByAirport':
            app1.ask("Sure ! give me your airport name. test");
            break;
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
