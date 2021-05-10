import L from 'leaflet';

const map = L.map('map').setView([46.79845, 8.23188], 8);

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	ext: 'png'
}).addTo(map);

const icon = L.icon({
  iconUrl: 'http://www.2ef.fr/images/eolienne_icon.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});