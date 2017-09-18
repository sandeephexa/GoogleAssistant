var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('promise');
var reqnew = require('request');
var apps = express();
apps.use(bodyParser.json());

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
        console.log(`https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${airports}/dep/${year}/${month}/${day}/${hour}?appId=${apid}&appKey=${apkey}&utc=false&numHours=1&maxFlights=5`);
        options.url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${airports}/dep/${year}/${month}/${day}/${hour}?appId=${apid}&appKey=${apkey}&utc=false&numHours=1&maxFlights=5`;
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
    let hour = app1.getArgument('time');
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
                        // looping through 
                        var dictionary = fligarriv.flightStatuses;
                        var i = 0;
                       
                        console.log("Flight statuses only",dictionary);
                         console.log("i value increases by",i);
                        for(item in dictionary)
                        {
                            console.log("this is from dictionary",dictionary[item].departureAirportFsCode);
                        if (fligarriv.appendix.airlines[i].active) {

                            if (fligarriv.appendix.hasOwnProperty('airports')) {
  
                                var dep = dictionary[item].departureAirportFsCode;
                                var arr = dictionary[item].arrivalAirportFsCode;
                              
                                var flightstatuses = dictionary[item].status;
                                
                                var departure=dictionary[item].operationalTimes.publishedDeparture.dateLocal;
                                var arrival=dictionary[item].operationalTimes.publishedArrival.dateLocal;
                                var numOfFlights = fligarriv.flightStatuses.length;
                                //actual status
                                var statusCodes = {  
                                "A":"Active",
                                "C":"Cancelled",
                                "D":"Diverted",
                                "DN":"Data Source Need",
                                "L":"Landed",
                                "NO":"Not Operational",
                                "R":"Redirected",
                                "S":"Scheduled",
                                "U":"Unknown"
                                };
                                var result = "";
                                var actualStatus = getStatus(flightstatuses);


                                function getStatus(s)
                                {
                                var myStatus = s ;  // convert num to string
                                if(statusCodes[myStatus])
                                        return  statusCodes[myStatus];
                                
                                }
                                console.log('Flights ${numOfFlights}, flight Status is ${actualStatus}, \n departing  From ${dep}, \n To ${arr}, \n Departs at ${departure}, \n Arrives at ${arrival} .');
                                console.log("next flight ");
                                 
                                 // app1.ask(` Flights ${numOfFlights}, flight Status is ${actualStatus}, \n departing  From ${dep}, \n To ${arr}, \n Departs at ${departure}, \n Arrives at ${arrival} .`);
                                 // Basic card
//                               app1.ask(app1.buildRichResponse()
//     // Create a basic card and add it to the rich response

//     .addSimpleResponse('${dep} => ${arr} \n Departure: \n${departure}\n Arrival \n${arrival}')
//     .addBasicCard(app1.buildBasicCard(`${dep} => ${arr} \n Departure: \n${departure}\n Arrival \n${arrival}`)
//       .setTitle('Flight Status')
//       .setImage('https://lh3.googleusercontent.com/K7IBRJz-E1h4gR0wfpcCzwf1MVxV8LXHpqFfKctPdiC54e9GUNTqC_vi_Mhe4KWcB5XnT2ku=w50-h50-e365')
//     )
//   );
app1.askWithList(app1.buildRichResponse()
.addSimpleResponse('Flights')
.addSuggestions(
  ['Basic Card', 'List', 'Carousel', 'Suggestions']),
// Build a list
app1.buildList('Statuses')
// Add the first item to the list
.addItems(app1.buildOptionItem('flight 1',
  [' ', '  ', ' ', ''])
  .setTitle('flight 1')
  .setDescription(`${dep} => ${arr} \n Departure: \n${departure}\n Arrival \n${arrival}`)
  .setImage(''))
// Add the second item to the list
.addItems(app1.buildOptionItem('flight2',
  ['', '', ' '])
  .setTitle('flight 2')
  .setDescription(`${dep} => ${arr} \n Departure: \n${departure}\n Arrival \n${arrival}`)
  .setImage('http://example.com/egypt', 'Egypt')
)
// Add third item to the list
.addItems(app1.buildOptionItem('flight 3',
  ['', '', ''])
  .setTitle('flight 3')
  .setDescription(`${dep} => ${arr} \n Departure: \n${departure}\n Arrival \n${arrival}`)
  .setImage('http://example.com/recipe', 'Recipe')
)
);

                               
                  


                            }
                        }
                        i++;
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
