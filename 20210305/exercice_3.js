var selectedDatas = [];

function productionByCanton(result, value) {
    resultat 
}

const data = require('./data.json') // création du fichier via la cmd : curl url/.../source.json > data.json
    .map( elt => {
        const newData = {
            canton: elt.Canton,
            commune: elt.MunicipalityName,
            productionPotentielle: elt.Scenario1_RoofsOnly_PotentialSolarElectricity_GWh
        }
        
        selectedDatas.push(newData)
    })

//console.log(JSON.stringify(selectedDatas))
console.log(selectedDatas)