// Store our API endpoint inside queryUrl
var queryUrl = "fields.json";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
function createFeatures(ballData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.Field +
      "</h3><hr><p>" + (feature.properties.Team) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var fields = L.geoJSON(ballData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(fields);
}

function createMap(fields) {

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
    Fields: fields
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, fields]
  });
  var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

    // Use our detect's results. passive applied if supported, capture will be false either way.
// elem.addEventListener('touchstart', fn, supportsPassive ? { passive: true } : false); 


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  game_url = 'static/data/baseball_stats.csv'
  function getData() {
    d3.csv(game_url, function(game_data) {
        fields = [];
        h_wins=[];
        h_losses =[];
        v_wins = [];
        v_losses = [];
        game_data.date = +game_data.date;
        game_data = game_data.filter(game_data => game_data.date > 20020000)
        game_data.h_score = +game_data.h_score;
        game_data.v_score = +game_data.v_score;
        for(var i=0; i<game_data.length; i++) {
            fields.push(game_data[i].park_id)
            if (game_data[i].h_score > game_data[i].v_score) {
                h_wins.push(game_data[i].h_name)
                v_losses.push(game_data[i].v_name)
            } else if (game_data[i].v_score > game_data[i].h_score) {
                v_wins.push(game_data[i].v_name)
                h_losses.push(game_data[i].h_name)
            }
        }
        
        h_wins.sort()
        h_losses.sort()
        v_losses.sort()
        v_wins.sort()

        home_wins = { };
        for(var i = 0; i < h_wins.length; ++i) {
            if(!home_wins[h_wins[i]])
                home_wins[h_wins[i]] = 0;
            ++home_wins[h_wins[i]];
        }
        
        home_losses = { };
        for(var i = 0; i < h_losses.length; ++i) {
            if(!home_losses[h_losses[i]])
                home_losses[h_losses[i]] = 0;
            ++home_losses[h_losses[i]];
        }

        visiting_wins = { };
        for(var i = 0; i < v_wins.length; ++i) {
            if(!visiting_wins[v_wins[i]])
                visiting_wins[v_wins[i]] = 0;
            ++visiting_wins[v_wins[i]];
        }

        visiting_losses = { };
        for(var i = 0; i < v_losses.length; ++i) {
            if(!visiting_losses[v_losses[i]])
                visiting_losses[v_losses[i]] = 0;
            ++visiting_losses[v_losses[i]];
        }

        teams = ["Los Angeles Angels","Arizona Diamondbacks","Atlanta Braves","Baltimore Orioles","Boston Red Sox","Chicago White Sox",
                 "Chicago Cubs","Cincinnati Reds","Cleveland Indians","Colorado Rockies","Detroit Tigers","Florida Marlins","Houstin Astros",
                 "Kansas City Royals","Los Angeles Dodgers","Miami Marlins","Milwaukee Brewers","Minnesota Twins","Arizona Diamondbacks",
                 "New York Yankees","New York Mets","Oakland Athletics","Philadelphia Phillies","Pittsburgh Pirates","San Diego Padres",
                 "Seattle Mariners","San Francisco Giants","St. Louis Cardinals","Tampa Bay Rays","Texas Rangers","Toronto Bluejays",
                 "Washington Nationals"]
         
        var records = [];
        for (var i = 0; i<teams.length; ++i) {    
            records[i] = {
                team: teams[i]
            }
        }

        for (var i = 0; i<records.length; i++) {
            records[i].home_wins = parseInt(Object.values(home_wins)[i])
            records[i].home_losses = Object.values(home_losses)[i]
            records[i].visiting_wins=Object.values(visiting_wins)[i]
            records[i].visiting_losses = Object.values(visiting_losses)[i]
            records[i].home_win_pct = Math.round(parseInt(Object.values(home_wins)[i]) /  (parseInt(Object.values(home_wins)[i]) + parseInt(Object.values(home_losses)[i])) * 100) 
            records[i].visiting_win_pct = Math.round(parseInt(Object.values(visiting_wins)[i]) /  (parseInt(Object.values(visiting_wins)[i]) + parseInt(Object.values(visiting_losses)[i])) * 100) 
        }
        
        // order = [1,26,1,22,27,20,0,14,29,10,9,13,16,7,31,4,21,12,24,8,1,25,30,28,2,23,17,5,19,6,11,3]
        // for(var i = 1; i < 32; i++) {
        //   if (i===2) { continue; }
        //   var marker = L.marker([overlayMaps.Fields._layers[i]._latlng.lat, overlayMaps.Fields._layers[i]._latlng.lng],marker)
        //   marker.bindTooltip(`Team: ${records[order[i]].team}<br>
        //                       Home Wins: ${records[order[i]].home_wins}<br>
        //                       Home Losses: ${records[order[i]].home_losses}<br>
        //                       Home Win Percentage: ${records[order[i]].home_win_pct}%`).addTo(myMap)
        // }
        order = [1,26,1,22,27,20,0,14,29,10,9,13,16,7,31,4,21,12,24,8,1,25,30,28,2,23,17,5,19,6,11,3]
        for(var i = 1; i < 32; i++) {
          if (i===2) { continue; }
          var marker = L.circle([overlayMaps.Fields._layers[i]._latlng.lat, overlayMaps.Fields._layers[i]._latlng.lng],
            {radius: ((records[order[i]].home_win_pct) - 45) * 1000})
          marker.bindTooltip(`Team: ${records[order[i]].team}<br>
                              Home Wins: ${records[order[i]].home_wins}<br>
                              Home Losses: ${records[order[i]].home_losses}<br>
                              Home Win Percentage: ${records[order[i]].home_win_pct}%`).addTo(myMap)
        }
    })
  }
  getData();
  


}
