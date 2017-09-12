var express = require('express');
var bodyParser = require('body-parser');
var apps = express();
apps.use(bodyParser.json());
let ApiAiApp = require('actions-on-google').FlightStats;

apps.get("/", function (req, res) {
    res.send("Server is running");
});
function callApi(req, res) {
    const app1 = new ApiAiApp({ request: req, response: res });

    var intent = app1.getIntent();
  
    switch (intent) {
        case 'WelcomeIntent':
            app1.ask("hello ! what can i do for you ? test");
            break;
        case 'FlightStatusByAirport':
            app1.ask("Sure ! give me your airport name. test");
            break;
    }
}
apps.post("/", function (req, res) {
    callApi(req, res);

});
apps.listen(process.env.PORT || 3008, function () {

});
