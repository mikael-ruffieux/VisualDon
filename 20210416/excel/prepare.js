const xlsx = require('xlsx')

const file = xlsx.readFile('peinaussteiger2018.xlsx')
const json = xlsx.utils.sheet_to_json(file.Sheets['data'])

const data = json.filter((d,i)=>i<10).map(d=>({nom:d.Bahnhof_Haltestelle, dtv:d.DTV_2018}))

console.log(data)

