/* 
Transformation à effectuer :
- Grouper par année, puis par "facility"
- Par année, un total
*/

const data = require('./production.json');

years = [];

data.forEach(elt => {
    if(!years.includes(elt.year)) { years.push(elt.year)};
});

years.sort();

result = [];

years.forEach(year => {
    const production = data.filter(d => d.year == year).map(d => d);

    let yearlyProduction = 0;

    production.forEach(facility => {
        yearlyProduction += parseInt(facility.production);
    });
    
    result.push({
        year: year,
        yearlyProduction: yearlyProduction, // en kWh
        production: production
    });
});

console.log(JSON.stringify(result));


/*
let model = [
    {
        year: 2003,
        production: [
            {facility: '...', production: '...'},
            {facility: '...', production: '...'},
            {...},
        ]
    },
    {
        year: 2004,
        production: [
            {facility: '...', production: '...'},
            {facility: '...', production: '...'},
            {...},
        ]
    }
];
*/

