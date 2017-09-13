var express = require('express');
var bodyParser = require('body-parser');
var apps = express();
apps.use(bodyParser.json());
let ApiAiApp = require('actions-on-google').ApiAiAssistant;

apps.get("/", function (req, res) {
    res.send("Server is running");
});
function callApi(req, res) {
    const app1 = new ApiAiApp({ request: req, response: res });
    let flightid = app1.getArgument('flightid');
    var intent = app1.getIntent();
    switch (intent) {
        case 'WelcomeIntent':
            app1.ask("Hello ! test");
            break;
        case 'FlightStatusByAirport':
            app1.ask("Sure ");
            break;
    }
}
apps.post("/", function (req, res) {
    callApi(req, res);

});
apps.listen(process.env.PORT || 3000, function () {

});
