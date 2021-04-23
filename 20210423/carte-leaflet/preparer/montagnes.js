const data = require('./montagnes.json')

const result = data.features
  .filter(d => d.type === 'Feature' && d.properties.natural === 'peak')
  .map(d => d)

console.log(
  JSON.stringify(
    result
  )
)