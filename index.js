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
                       
                        var dictionary = fligarriv.flightStatuses;
                        var i = 0;
                        var dep1,arr1,flightstatuses1,departure1,arrival1,numOfFlights1,dep2,arr2,flightstatuses2,departure2,arrival2,dep3,arr3,flightstatuses3,departure3,arrival3,actualStatus1,actualStatus2,actualStatus3;
                            if (fligarriv.appendix.hasOwnProperty('airports')) 
                            {
                                
            
                                dep1 = dictionary[0].departureAirportFsCode;
                                arr1 = dictionary[0].arrivalAirportFsCode;
                                flightstatuses1 = dictionary[0].status;
                                departure1=dictionary[0].operationalTimes.publishedDeparture.dateLocal;
                                arrival1=dictionary[0].operationalTimes.publishedArrival.dateLocal;
                                numOfFlights1 = fligarriv.flightStatuses.length;
                               
                                dep2 = dictionary[1].departureAirportFsCode;
                                arr2 = dictionary[1].arrivalAirportFsCode;
                                flightstatuses2 = dictionary[1].status;
                                departure2=dictionary[1].operationalTimes.publishedDeparture.dateLocal;
                                arrival2=dictionary[1].operationalTimes.publishedArrival.dateLocal;
                                
                                
                                dep3 = dictionary[2].departureAirportFsCode;
                                arr3 = dictionary[2].arrivalAirportFsCode;
                                flightstatuses3 = dictionary[2].status;
                                departure3=dictionary[2].operationalTimes.publishedDeparture.dateLocal;
                                arrival3=dictionary[2].operationalTimes.publishedArrival.dateLocal;
                               
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
                                actualStatus1 = getStatus(flightstatuses1);
                                actualStatus2 = getStatus(flightstatuses2);
                                actualStatus3 = getStatus(flightstatuses3);


                                function getStatus(s)
                                {
                                var myStatus = s ;  // convert num to string
                                if(statusCodes[myStatus])
                                        return  statusCodes[myStatus];
                                
                                }
                               

                            }
 
 // list
  app1.askWithList(app1.buildRichResponse()
    .addSimpleResponse(`Flight from ${dep1} to ${arr1} Status: ${actualStatus1} departure ${departure1} arrival ${arrival1}. 
    next flight from ${dep2} to ${arr2} Status: ${actualStatus2} departure ${departure2} arrival ${arrival2}`)
    //.addSuggestions(['Yes', 'No'])
    ,
      app1.buildList('Flight Status')
    // Add the first item to the list
    .addItems(app1.buildOptionItem('Flight 1')
      .setTitle(` ${dep1} to ${arr1} Status: ${actualStatus1}`)
      .setDescription(`D: ${departure1} A: ${arrival1}`)
      .setImage('https://miamain.blob.core.windows.net/wp-uploads/wp-content/uploads/2015/09/icons-home-arrivals-departures.png', 'Departure')
      // .setImage('https://www.dropbox.com/s/l1h4x5r6ox5f60q/rsz_departure.png?raw=1', 'Departure')
       
      )
    // Add the second item to the list
    .addItems(app1.buildOptionItem('Flight 2')
      .setTitle(` ${dep2} to ${arr2} Status: ${actualStatus2}`)
      .setDescription(`D: ${departure2} A: ${arrival2}`)
        .setImage('https://miamain.blob.core.windows.net/wp-uploads/wp-content/uploads/2015/09/icons-home-arrivals-departures.png', 'Departure')
    )
    //add third item
    .addItems(app1.buildOptionItem('Flight 3')
    .setTitle(` ${dep3} to ${arr3} Status: ${actualStatus3}`)
      .setDescription(`D: ${departure3} A: ${arrival3}`)
       .setImage('https://miamain.blob.core.windows.net/wp-uploads/wp-content/uploads/2015/09/icons-home-arrivals-departures.png', 'Departure')
    )
  );      
      
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
