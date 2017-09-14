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
        console.log(`https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${airports}/dep/${year}/${month}/${day}/${hour}?appId=${apid}&appKey=${apkey}&utc=false&numHours=1&maxFlights=1`);
        options.url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${airports}/dep/${year}/${month}/${day}/${hour}?appId=${apid}&appKey=${apkey}&utc=false&numHours=1&maxFlights=1`;
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
    console.log("Intent Nasme"+intent);
    //let flightno = app1.getArgument('any');
    //let carrier = app1.getArgument('flight_names');
    //console.log(intent + "=>" + apid + "=>" + apkey + "=>" + carrier + "=>" + flightno + "=>" + flightdate[2] + "=>" + flightdate[1] + "=>" + flightdate[0]);
    if (intent == "FlightStatusByAirport") 
    {
            let airports = app1.getArgument('Airports');
    let hour = app1.getArgument('number');
    //let carrier = app1.getArgument('Airlines');
    var flightdate = app1.getArgument('date');
    console.log(flightdate.toString().split('-'));
   var flightdate1 = flightdate.split('-');
    console.log(flightdate1);
        return callrestapi(apid, apkey,airports ,flightdate1[0], flightdate1[1], flightdate1[2],hour).then(function (result1) 
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

                            if (fligarriv.appendix.hasOwnProperty('airports')) {
  
                                var source = fligarriv.appendix.airports[0];
                                var destination = fligarriv.appendix.airports[1];
                                var airports = source.name;
                                var citys = source.city;
                                var countrys = source.countryName;
                                var airportd = destination.name;
                                var cityd = destination.city;
                                var countryd = destination.countryName;
                                var flightstatuses = fligarriv.flightStatuses[0].status;
                           
                                let scheduledd=fligarriv.flightStatuses[0].operationalTimes.scheduledGateArrival.dateLocal.split('T')[1];
                                let scheduleda=fligarriv.flightStatuses[0].operationalTimes.scheduledGateDeparture.dateLocal.split('T')[1];
                                let estimatedd=fligarriv.flightStatuses[0].operationalTimes.estimatedGateDeparture.dateLocal.split('T')[1];
                                let estimateda=fligarriv.flightStatuses[0].operationalTimes.estimatedGateArrival.dateLocal.split('T')[1];
                                 console.log(flightstatuses+"=>"+countryd);
                                app1.ask(`Flight is ${flightstatuses} from ${airports}${countrys} to ${airportd}${countryd}. Estimated Departure ${estimatedd} , Arrival ${estimateda}. Schedule Departure ${scheduledd} , Arrival ${scheduleda}`);


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
