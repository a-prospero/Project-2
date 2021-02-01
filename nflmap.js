// Store our API endpoint inside queryUrl
var queryUrl = "stadiums.json";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(nflData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the team and stadium
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + (feature.properties.Stadium) + "</h3><hr><p>" + (feature.properties.Team) + " (" + feature.properties.Conference + ")" 
    + "</p><hr><p>" + "Wins at home: " + (feature.properties.Homefield_Wins) + "</p> \r\n" + "<p>" + "Homefield Advantage Ranking: "+ (feature.properties.Homefield_adv_rank) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the stadium object
  // Run the onEachFeature function once for each piece of data in the array
  var stadiums = L.geoJSON(nflData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(stadiums);
}

function createMap(stadiums) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Stadiums: stadiums
  };

  // Create our map, giving it the streetmap and stadiums layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, stadiums]
  });

  // //Create football icon
  // var myIcon = L.icon({
  //   iconURL: 'football.png',
  //   iconSize: [38, 95],
  //   iconAnchor: [22, 94]
  //     })
  //   L.marker([stadiums], {icon: myIcon}).addTo(myMap);  

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
