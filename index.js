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
  
                                var dep = fligarriv.flightStatuses[0].departureAirportFsCode;
                                var arr = fligarriv.flightStatuses[0].arrivalAirportFsCode;
                                var source = fligarriv.appendix.airports[0];
                                var destination = fligarriv.appendix.airports[1];
                                var airports = source.name;
                                var airports = fligarriv.appendix.airports[1].name;
                               
                                var flightstatuses = fligarriv.flightStatuses[0].status;
                                var departure=fligarriv.flightStatuses[0].operationalTimes.publishedDeparture.dateLocal;
                                var arrival=fligarriv.flightStatuses[0].operationalTimes.publishedArrival.dateLocal;
                                var actualFlightStatus =checkStatus(flightstatuses);
                                function checkStatus(flightStatuses)
                                {

                                    var result2 = filghtStatuses;
                                    var result = '';
                                    switch (result2) {
                                    case 'A':
                                             result = "Active";
                                             break;
                                             
                                    case 'C':
                                             result = "Cancelled";
                                            break;
                                     case 'D':
                                             result = "Diverted";
                                            break;
                                    case 'DN':
                                         result = "Data Source need";
                                        break;
                                    case 'L':
                                         result = "Landed";
                                        break;
                                    case 'NO':
                                        result = "Not Operational";
                                        break;
                                    case 'R':
                                         result = "Redeirected";
                                         break;
                                     case 'S':
                                         result = "Scheduled";
                                         break;
                                    case 'U':
                                         result = "Unknown";
                                         break;

                                }
                                return result;
                                }
                                    console.log(actualFlightStatus);
                               // app1.ask(`Flight is ${flightstatuses} from ${airports}${countrys} to ${airportd}${countryd}.`);
                                 app1.ask(` flight Status is ${actualFlightStatus} departing  from ${dep} to ${arr} departs at ${departure} and arrives at ${arrival} .`);
                               
                  


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
