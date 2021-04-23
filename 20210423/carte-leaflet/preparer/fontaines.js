const data = require('./fontaines.json')

const result = data.features
  .filter(d => d.geometry.type === 'Point' && d.properties.amenity === 'drinking_water')
  .map(d => d.geometry.coordinates)

console.log(
  JSON.stringify(
    result
  )
)