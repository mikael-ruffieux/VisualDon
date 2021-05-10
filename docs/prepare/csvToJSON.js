//var csv is the CSV file with headers
// Adapted by Mikael from : http://techslides.com/convert-csv-to-json-in-javascript

function csvJSON(csv){
    const fs = require('fs');

    fs.readFile(csv, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        var lines=data.split("\n");
  
        var result = [];
    
        var headers=lines[0].split(",");
    
        for(var i=1;i<lines.length;i++){
    
            var obj = {};
            var currentline=lines[i].split(",");
    
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
            }
    
            result.push(obj);
    
        }

        console.log(JSON.stringify(result));
      })

    
}

csvJSON('./Windenergyplants_V1.Production.Production.csv');