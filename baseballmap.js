// Create variables for data files
var queryUrl = "fields.json";
var baseball_url = 'static/data/baseball_stats.csv';
var football_url = 'stadiums.json';
var hockey_url = "nhl-stadiums.json";
var hockey_data_url = 'NHL_HomeWins.csv';
// Create variarable for icon
var diamondIcon = L.icon({iconUrl: 'images/baseball.png',
  iconSize: [25,25]
  });
var footballIcon = L.icon({
  iconUrl: 'images/football.png',
  iconSize: [25, 25],
  });
var hockeyIcon = L.icon({
    iconUrl: 'images/hockey-icon.png.png',
    iconSize: [25, 25],
});

var layers = {
    Baseball: new L.LayerGroup(),
    Football: new L.LayerGroup(),
    Hockey: new L.LayerGroup()
};

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
    "Baseball": layers.Baseball, 
    "Football": layers.Football,
    "Hockey": layers.Hockey
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
center: [
37.09, -95.71
],
zoom: 4,
layers: [streetmap, layers.Baseball, layers.Football, layers.Hockey]
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

//Define a function we want to run once for each feature in the features array, add layer to layer control
function createBaseballFeatures(baseballData) {
    L.geoJson(baseballData  ,{
        pointToLayer: function(feature,latlng){
            return L.marker(latlng,{icon: diamondIcon});
            }
        }).addTo(layers.Baseball)
}

//Run function to add baseball stadiums to map
d3.json(queryUrl, function(data) {
    createBaseballFeatures(data.features);
});

// Define a function we want to run once for each feature in the features array, give each feature a popup describing the team and stadium
function createFootballFeatures(footballData) {
    function onEachFeature(feature, layer) {
        L.Icon.Default.prototype.options.iconSize='0'
        var marker = L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {icon: footballIcon})
        // marker.addTo(layers.Football)
        marker.bindPopup("<h3>" + (feature.properties.Stadium) + "</h3><hr><p>" + (feature.properties.Team) + " (" + feature.properties.Conference + ")" 
        + "</p><hr><p>" + "Wins at home: " + (feature.properties.Homefield_Wins) + "</p> \r\n" + "<p>" + "Homefield Advantage Ranking: "+ (feature.properties.Homefield_adv_rank) + "</p>");
        marker.bindTooltip( `Team: ${feature.properties.Team}<br>
                          Home Wins: ${feature.properties.Homefield_Wins}<br>
                          Home Losses: ${feature.properties.Homefield_Losses} <br>
                          Home Win Percentage: ${feature.properties.Home_Win_Percentage}`).addTo(layers.Football);
        }
        L.geoJSON(footballData, {
            onEachFeature: onEachFeature
            }).addTo(layers.Football)
}
  
//Run function to add football stadiums to map
d3.json(football_url, function(data2) {
  createFootballFeatures(data2.features);
});
//Define a function for each feature, add popup and tooltip to each hockey rink
function createHockeyFeatures(hockeyData) {
    function onEachFeature(feature, layer) {
      var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{icon: hockeyIcon})
      marker.bindTooltip("<h3>" + feature.properties.name +
        "</h3><hr><p>" + (feature.properties.team) + "</p>").addTo(layers.Hockey);
    }  
    L.geoJSON(hockeyData, {
        onEachFeature: onEachFeature
        }).addTo(layers.Hockey)
}

//Run function to add hockey arenas to map
d3.json(hockey_url, function(data) {
  createHockeyFeatures(data.features);
});

// Read and parse data from hockey csv
function getHockeyData(){
  d3.csv(hockey_data_url, function(game_data) {
    teams = [];
    h_wins=[];
    h_losses = [];
    h_ties = [];
    win_pct = [];
    game_data.W = +game_data.W;
    game_data.L = +game_data.L;
    game_data.PP = +game_data.PP
    for (var i = 0; i <game_data.length; ++i) {
      teams.push(game_data[i].Team)
      h_wins.push(parseInt(game_data[i].W))
      h_losses.push(parseInt(game_data[i].L))
      h_ties.push(parseInt(game_data[i].T))
      win_pct.push(Math.round(parseFloat(game_data[i].PP) * 100))
    }
    
    order = [25,0,9,3,8,22,20,10,21,28,2,13,29,17,19,4,18,14,23,7,16,12,11,24,5,1,6,27,15]
    // console.log(overlayMaps.Hockey)
    for (var i = 236, j=0; i<324, j<29 ; i+=3, j++) {
      if (i === 233) { continue; }
      if (i === 320) { continue; }
        var marker = L.marker([overlayMaps.Hockey._layers[233]._layers[i]._latlng.lat, overlayMaps.Hockey._layers[233]._layers[i]._latlng.lng],{icon: hockeyIcon})
                    marker.bindTooltip(`Team: ${teams[order[j]]}<br>
                                        Home Wins: ${h_wins[order[j]]}<br>
                                        Home Losses: ${h_losses[order[j]]}<br>
                                        Home Win Percentage: ${win_pct[order[j]]}%`).addTo(layers.Hockey);
         }
  })
}
getHockeyData();

// Read and parse data from baseball database
function getBaseballData() {
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
        // console.log(overlayMaps.Baseball)
        for(var i = 1; i < 32; i++) {
            if (i===2) { continue; }
            var marker = L.marker([overlayMaps.Baseball._layers[41]._layers[(i+39)]._latlng.lat, overlayMaps.Baseball._layers[41]._layers[(i+39)]._latlng.lng],{icon: diamondIcon})
            marker.bindTooltip(`Team: ${records[order[i]].team}<br>
                                Home Wins: ${records[order[i]].home_wins}<br>
                                Home Losses: ${records[order[i]].home_losses}<br>
                                Home Win Percentage: ${records[order[i]].home_win_pct}%`).addTo(layers.Baseball)
        }
    });
}
getBaseballData();
