// center of the map
var start = [51.165691, 10.451526];

// Create the map
var map = L.map('map').setView(start, 3.1);

// Set up the OSM layer
L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(map);

// add a marker in the given location
L.marker([54.11667, -9.16667]).addTo(map);
