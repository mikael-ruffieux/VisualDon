import L from 'leaflet';
import {select,max} from 'd3';
import map_data from './prepared_data/prepared_map_v2.json';
import production_data from './prepared_data/prepared_production.json';

// ##### Progress bar ######

// La largeur maximale est la largeur du container #production 
const MAX_WIDTH = document.getElementById("production").offsetWidth;
let currentYear = parseInt(document.getElementById("myRange").value);

function kwToGw(kw) {
	return kw/1000000;
}

function kwToPx(kw) {
	let maxValue = max(production_data, d => d.yearlyProduction);

	return Math.round(kw/maxValue * MAX_WIDTH);
}

var svg = select('#production')
	.append('svg')
	.attr('height', 50)
	.attr('width', MAX_WIDTH);

// Fond de la barre de progression
svg.append('rect')
	.attr('class', 'bg-rect')
	.attr('fill', '#d3d3d3')
	.attr('height', 25)
	.attr('width', MAX_WIDTH)
	.attr('x', 0);


// Barre de progression
var progress = svg.append('rect')
	.attr('class', 'progress-rect')
	.attr('fill', 'blue')
	.attr('height', 25)
	.attr('width', 0)
	.attr('x', 0);

progress.transition()
	.duration(800)
	.attr('width', 10);

function moveProgressBar(value){
	if(value == 0 ) {
		document.getElementById("production-label").innerHTML = "<b>Production annuelle</b><br>[not available]";
		progress.transition()
			.duration(1000)
			.attr('width', 0);
	} else {
		document.getElementById("production-label").innerHTML = "<b>Production annuelle</b><br>" + kwToGw(value).toFixed(4) + " GWh";

		progress.transition()
			.duration(1000)
			.attr('width', kwToPx(value));
	}
}


// ##### Map ######
const map = L.map('map').setView([46.79845, 8.23188], 8);

function isDismantled (currentYear, yearOfDismantling) {
	if(yearOfDismantling == "" || currentYear < yearOfDismantling) {
		return false;
	} else {
		return true;
	}
}

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const iconDown = L.icon({
  iconUrl: 'https://pics.freeicons.io/uploads/icons/png/6505515751548329636-512.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});

const iconUp = L.icon({
	iconUrl: 'https://www.shareicon.net/data/512x512/2015/09/07/97540_wind_512x512.png',
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50],
  });

var layerGroup = L.layerGroup().addTo(map);

function displayTurbines (year) {
	let filtered_data = map_data.filter(d => d.year == year).map(d => d);

	/*
	if(parseInt(year) == 1990) {
		// Efface les markers une fois la boucle effectuée
		layerGroup.clearLayers();
	}
	*/

	if(filtered_data.length != 0) {
		// Efface les markers à chaque fois (?), sauf si aucun changement
		layerGroup.clearLayers();

		filtered_data[0].turbines.forEach(turbine => {
			if(turbine.latitude && turbine.longitude) {
				L.marker([turbine.latitude, turbine.longitude], {
					icon: isDismantled(year, turbine.yearOfDismantling) ? iconDown : iconUp,
					title: turbine.id,
				}).addTo(layerGroup).bindPopup("Puissance: " + turbine.ratedPower + " kW<br>Fabriquant: " + turbine.manufacturer + "<br>Statut : " + (isDismantled(year, turbine.yearOfDismantling) ? "Hors service" :"En exploitation"));
			}
		});
	}
}

displayTurbines(currentYear);


// ##### Slider ######
function updateData(newYear) {
	displayTurbines(newYear);
	document.getElementById("year").innerHTML = newYear;
	
	try {
		moveProgressBar(production_data.filter(d => d.year == newYear)[0].yearlyProduction);
	} catch (error) {
		moveProgressBar(0);
	}
}

// Initialisation du slide à 1986
updateData(currentYear);

const slider = document.getElementById("myRange");

slider.addEventListener("input", () => updateData(slider.value));
slider.addEventListener("change", () => updateData(slider.value));

// Animation

let pauseBtn = document.getElementById("pause");
let playBtn = document.getElementById("play");
let isPaused = false;

// Pause 
pauseBtn.addEventListener("click", () => {
	pauseBtn.classList = "d-none";
	playBtn.classList = "";
	isPaused = true;
});

// Play
playBtn.addEventListener("click", () => {
	playBtn.classList = "d-none";
	pauseBtn.classList = "";
	isPaused = false;
});

setInterval(() => {
	if(!isPaused) {
		let range = document.getElementById("myRange");
	
		if(parseInt(range.value) < 2020) {
			range.value = parseInt(range.value) + 1;
		} else {
			range.value = 1986;
		}
		updateData(range.value);
	}
}, 1000);