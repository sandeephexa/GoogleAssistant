var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('promise');
var reqnew = require('request');
var apps = express();
apps.use(bodyParser.json());
var flightstatus = { 'A': 'Active', 'C': 'Cancelled', 'D': 'Diverted', 'DN': 'Data Source Need', 'L': 'Landed', 'NO': 'Not Operational', 'R': 'Redirected', 'S': 'Scheduled', 'U': 'Unknown' };
let ApiAiApp = require('actions-on-google').ApiAiAssistant;
const apid = '6aac18a6';
const apkey = '40a7e359cb020a07ead5159c2d5d8162';
apps.get("/", function (req, res) {
    res.send("Server is running");
});
var callrestapi = function (apid, apkey,airports, year, month, day,hour) {
    return new Promise(function (resolve, reject) {
        var r;
        var options = {};
        // var url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${airport}/dep/${year}/${month}/${day}/${hour}?appId=${appid}&appKey=${appkey}&utc=false&numHours=1&maxFlights=5';
        options.url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${airports}/dep/${year}/${month}/${day}/${hour}?appId=${appid}&appKey=${appkey}&utc=false&numHours=1&maxFlights=5`;
        reqnew(options, (error, resps, body) => {
            try {
            console.log(body);
                if ((typeof body) == "string") {

                    var result = JSON.parse(body);
                    r = result;
                } else {

                    r = body;
                }
                // Call callback with no error, and result of request
                resolve(r);

            } catch (e) {
                // Call callback with error
                reject(e);
            }


        });
    });
}


function callApi(req, res) {
    const app1 = new ApiAiApp({ request: req, response: res });
    var intent = app1.getIntent();
    
    let airports = app1.getArgument('Airports');
    let hour = app1.getArgument('number');
    //let carrier = app1.getArgument('Airlines');
    let flightdate = app1.getArgument('date').split('-');
   console.log(app1.getArgument('date'));
    //let flightno = app1.getArgument('any');
    //let carrier = app1.getArgument('flight_names');
    //console.log(intent + "=>" + apid + "=>" + apkey + "=>" + carrier + "=>" + flightno + "=>" + flightdate[2] + "=>" + flightdate[1] + "=>" + flightdate[0]);
    if (intent == "FlightStatusByAirport") 
    {
        return callrestapi(apid, apkey,airports ,flightdate[0], flightdate[1], flightdate[2],hour).then(function (result1) 
        {
          
            var fligarriv = result1;
            if (fligarriv) {
                console.log(fligarriv.hasOwnProperty('error')+"srini231211987");
                console.log(JSON.stringify(fligarriv));
                if(fligarriv.hasOwnProperty('error'))
            {
                console.log("sromojk");    
                app1.ask(fligarriv.error.errorMessage);
            }
             else   if (fligarriv.hasOwnProperty('appendix')) {
                    if (fligarriv.appendix.hasOwnProperty('airlines')) {
                        if (fligarriv.appendix.airlines[0].active) {
                            console.log(fligarriv.appendix.airlines[0].active);
                            if (fligarriv.appendix.hasOwnProperty('airports')) {
                                let source = fligarriv.appendix.airports[0];
                                let destination = fligarriv.appendix.airports[1];
                                let airports = source.name;
                                let citys = source.city;
                                let countrys = source.countryName;
                                let airportd = destination.name;
                                let cityd = destination.city;
                                let countryd = destination.countryName;
                                let flightstatuses = fligarriv.flightStatuses[0].status;
                                let scheduledd=fligarriv.flightStatuses[0].operationalTimes.scheduledGateArrival.dateLocal.split('T')[1];
                                let scheduleda=fligarriv.flightStatuses[0].operationalTimes.scheduledGateDeparture.dateLocal.split('T')[1];
                                let estimatedd=fligarriv.flightStatuses[0].operationalTimes.estimatedGateDeparture.dateLocal.split('T')[1];
                                let estimateda=fligarriv.flightStatuses[0].operationalTimes.estimatedGateArrival.dateLocal.split('T')[1];
                                console.log(`Flight is ${flightstatuses} from ${airports}${countrys} to ${airportd}${countryd}. Estimated Departure ${estimatedd} , Arrival ${estimateda}. Schedule Departure ${scheduledd} , Arrival ${scheduleda}`);


                            }
                        }
                    }
                }
            
            }
           
         
        }).catch(function (errdata) {

        })
    }
}
apps.post("/", function (req, res) {
    callApi(req, res);
});
apps.listen(process.env.PORT || 3000, function () {

});
