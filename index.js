var express = require('express');
var bodyParser = require('body-parser');
var apps = express();
apps.use(bodyParser.json());
let ApiAiApp = require('actions-on-google').ApiAiAssistant;

apps.get("/", function (req, res) {
    res.send("Server is running");
});
function callApi(req, res) {
    console.log("this is response" + res);
    const app1 = new ApiAiApp({ request: req, response: res });

    var intent = app1.getIntent();
    console.log("This is intent name" + intent);
    switch (intent) {
        case 'WelcomeIntent':
            app1.ask("Hello ! test");
            break;
        //case 'FlightStatusByAirport':
        //    app1.ask("Sure ");
        //   break;
    }
}
apps.post("/", function (req, res) {
    callApi(req, res);

});
apps.listen(process.env.PORT || 3000, function () {
    console.log("testing");
});
