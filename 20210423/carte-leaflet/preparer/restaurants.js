const data = require('./gruyere.json')

const result = data.features
  .filter(d => d.type === 'Feature' && d.properties.amenity === 'restaurant')
  .map(d => d)

console.log(
  JSON.stringify(
    result
  )
)