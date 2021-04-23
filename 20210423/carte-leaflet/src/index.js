import L from 'leaflet'
import restaurants from './restaurants.json'
import batiments from './batiments.json'

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
  iconUrl: 'https://cdn.iconscout.com/icon/free/png-256/restaurant-1495593-1267764.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})


/*
restaurants.map(d => {
  const [lon, lat] = d
  L.marker([lat, lon], { icon })
  
  .addTo(map)
})
*/


L.geoJSON(
  restaurants,
  {
    onEachFeature: (feature, layer) =>
      layer.bindPopup(feature.properties.name || feature.properties['addr:street'] || feature.properties.uid)  
  },
).addTo(map)