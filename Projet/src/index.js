import L from 'leaflet';
import map_data from './prepared_data/map.json';

const map = L.map('map').setView([46.79845, 8.23188], 8);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

const iconDown = L.icon({
  iconUrl: 'https://pics.freeicons.io/uploads/icons/png/6505515751548329636-512.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});

const iconUp = L.icon({
	iconUrl: 'https://www.shareicon.net/data/512x512/2015/09/07/97540_wind_512x512.png',
	iconSize: [50, 50],
	iconAnchor: [25, 50],
  });

map_data.forEach(turbine => {
	L.marker([turbine.latitude, turbine.longitude], {
		icon: turbine.dismantlingYear == "" ? iconUp : iconDown,
		title: turbine.id,
	}).addTo(map).bindPopup("Puissance: " + turbine.ratedPower + " kW<br>Fabriquant: " + turbine.manufacturer);
});