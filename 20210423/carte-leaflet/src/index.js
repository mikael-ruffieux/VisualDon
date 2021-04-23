import L from 'leaflet'
import restaurants from './restaurants.json'
import fontaines from './fontaines.json'
import montagnes from './montagnes.json'

const map = L.map('map').setView([46.58462, 7.08356], 13)

L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
  {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png',
    bounds: [[45, 5], [48, 11]]
  }).addTo(map)

const icon = L.icon({
  iconUrl: 'https://image.flaticon.com/icons/png/512/892/892899.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
})

L.geoJSON(
  restaurants,
  {
    onEachFeature: (feature, layer) =>
      layer.bindPopup(feature.properties.name || feature.properties['addr:street'] || feature.properties.uid)  
  },
).addTo(map)

fontaines.map(d => {
  const [lon, lat] = d
  L.marker([lat, lon], { icon }).addTo(map)
})

// geoJSON layout with custom icon
function createCustomIcon (feature, latlng) {
  const peakIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Mountain-Icon_%28white%29.svg/480px-Mountain-Icon_%28white%29.svg.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor:  [0, -30]
  })
  return L.marker(latlng, { icon: peakIcon }).bindPopup(`<b>${feature.properties.name}</b><br/>${feature.properties.ele}m`)
}

// create an options object that specifies which function will called on each feature
let myLayerOptions = {
  pointToLayer: createCustomIcon
}

// create the GeoJSON layer
L.geoJSON(montagnes, myLayerOptions).addTo(map)