var baseball_url = 'static/data/baseball_stats.csv';
var football_url = 'stadiums.json';
var hockey_data_url = 'NHL_HomeWins.csv';
var ctx = document.getElementById('myChart').getContext('2d');

d3.csv(baseball_url, function(data) {
    h_wins = [];
    h_losses = [];
    data = data.filter(data => data.date > 20020000)
    data.h_score = +data.h_score;
    data.v_score = +data.v_score;
    for(var i=0; i<data.length; i++) {
        if (data[i].h_score > data[i].v_score) {
            h_wins.push(data[i].h_name)
        } else if (data[i].v_score > data[i].h_score) {
            h_losses.push(data[i].h_name)
        } 
    }
    h_wins.sort()
    h_losses.sort()
    home_wins = { };
    for(var i = 0; i < h_wins.length; ++i) {
        if(!home_wins[h_wins[i]])
            home_wins[h_wins[i]] = 0;
        ++home_wins[h_wins[i]];
    }
    h_wins_array = Object.values(home_wins);
    
    home_losses = { };
    for(var i = 0; i < h_losses.length; ++i) {
        if(!home_losses[h_losses[i]])
            home_losses[h_losses[i]] = 0;
        ++home_losses[h_losses[i]];
        }
    h_losses_array = Object.values(home_losses);
    var h_win_pct = [];
    
    for (var i = 0; i <h_losses_array.length; ++i) {
        h_win_pct.push(Math.round(parseFloat( h_wins_array[i] / (h_wins_array[i] + h_losses_array[i]) * 100)))
    }
    h_win_pct.splice(11,1);
    h_win_pct.splice(17,1);

    teams = ["Los Angeles Angels","Arizona Diamondbacks","Atlanta Braves","Baltimore Orioles","Boston Red Sox","Chicago White Sox",
                    "Chicago Cubs","Cincinnati Reds","Cleveland Indians","Colorado Rockies","Detroit Tigers","Houstin Astros",
                    "Kansas City Royals","Los Angeles Dodgers","Miami Marlins","Milwaukee Brewers","Minnesota Twins",
                    "New York Yankees","New York Mets","Oakland Athletics","Philadelphia Phillies","Pittsburgh Pirates","San Diego Padres",
                    "Seattle Mariners","San Francisco Giants","St. Louis Cardinals","Tampa Bay Rays","Texas Rangers","Toronto Bluejays",
                    "Washington Nationals"]
            
    d3.csv(hockey_data_url, function(data) {
        hteams = [];
        hh_wins=[];
        hh_losses = [];
        hh_ties = [];
        hwin_pct = [];
        data.W = +data.W;
        data.L = +data.L;
        data.PP = +data.PP
        for (var i = 0; i <data.length; ++i) {
        hteams.push(data[i].Team)
        hh_wins.push(parseInt(data[i].W))
        hh_losses.push(parseInt(data[i].L))
        hh_ties.push(parseInt(data[i].T))
        hwin_pct.push(Math.round(parseFloat(data[i].PP) * 100))
        }
        
        d3.json(football_url, function(data) {
            data = data.features
            fteams = [];
            fh_wins = [];
            fh_losses = [];
            fwin_pct = [];
            
            for (var i = 0;i<data.length;i++) {
                fteams.push(data[i].properties.Team)
                fh_wins.push(data[i].properties.Homefield_Wins)
                fh_losses.push(data[i].properties.Homefield_Losses)
            }
            for (var i = 0; i<fh_wins.length;i++) {
                fwin_pct.push(Math.round(fh_wins[i] / (fh_wins[i] + fh_losses[i]) * 100))
            }

            
            
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: teams,
                    datasets: [{
                        
                        label: 'NFL Homefield Win %',
                        // data: [fwin_pct],
                        data:h_win_pct,
                        color: 'red',
                        backgroundColor: [
                            
                        ],
                        borderColor: [
                            
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                locations: [1,2,3,4,5],
                                beginAtZero: true,
                            }
                        }]
                    }
                }
            });
        
        
        }); 
    });
















})




// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
                
//             ],
//             borderColor: [
                
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }]
//         }
//     }
// });