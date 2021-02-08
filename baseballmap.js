// Create variables for data files
var queryUrl = "fields.json";
var baseball_url = 'static/data/baseball_stats.csv';
// Create variarable for icon
var diamondIcon = L.icon({iconUrl: 'images/diamond.png',
  iconSize: [25,25]})
// Perform a GET request to the query URL and send data.features to createFeatures function
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
  });
// Define a function we want to run once for each feature in the features array
function createFeatures(ballData) {
  var baseball = L.geoJson(ballData  ,{
    pointToLayer: function(feature,latlng){
      return L.marker(latlng,{icon: diamondIcon});
    }
  })
  createMap(baseball);
}

function createMap(baseball) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define darkmap layer
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
    Baseball: baseball
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, baseball]
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

  // Create a layer control with baseMaps and overlayMaps, add to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Read and parse data from baseball database
  function getData() {
    d3.csv(baseball_url, function(game_data) {
        h_wins=[];
        h_losses =[];
        v_wins = [];
        v_losses = [];
        game_data.date = +game_data.date;
        game_data = game_data.filter(game_data => game_data.date > 20020000)
        game_data.h_score = +game_data.h_score;
        game_data.v_score = +game_data.v_score;
        for(var i=0; i<game_data.length; i++) {
            if (game_data[i].h_score > game_data[i].v_score) {
                h_wins.push(game_data[i].h_name)
                v_losses.push(game_data[i].v_name)
            } else if (game_data[i].v_score > game_data[i].h_score) {
                v_wins.push(game_data[i].v_name)
                h_losses.push(game_data[i].h_name)
            }
        }
        
        // Break down wins and losses, home and away, by team
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

        // List all teams in the order they appear in geoJSON
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
        order = [1,26,1,22,27,20,0,14,29,10,9,13,16,7,31,4,21,12,24,8,1,25,30,28,2,23,17,5,19,6,11,3]
        
        // Iterate through records objects and create tooltips and add to baseball layer
        for(var i = 1; i < 32; i++) {
          if (i===2) { continue; }
          var marker = L.marker([overlayMaps.Baseball._layers[i]._latlng.lat, overlayMaps.Baseball._layers[i]._latlng.lng],{icon: diamondIcon})
          marker.bindTooltip(`Team: ${records[order[i]].team}<br>
                              Home Wins: ${records[order[i]].home_wins}<br>
                              Home Losses: ${records[order[i]].home_losses}<br>
                              Home Win Percentage: ${records[order[i]].home_win_pct}%`).addTo(overlayMaps.Baseball)
        }
      
        var ctx = document.getElementById('chart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: records[teams[order[i]]],
        datasets: [{
            label: 'Teams',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
      
      
      })
  }
  getData();
}

