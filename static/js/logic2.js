game_url = 'static/data/baseball_stats.csv'
parks_url = 'Parks.csv'
function getData() {
    d3.csv(game_url, function(game_data) {
        d3.csv(parks_url, function(parks_data) {
            console.log(parks_data)    
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

            teams = Object.keys(home_wins)
            teams.sort()
            
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
                records[i].home_win_pct = Math.round(parseInt(Object.values(home_wins)[i]) /  (parseInt(Object.values(home_wins)[i]) + parseInt(Object.values(home_losses)[i])) * 100) / 100
                records[i].visiting_win_pct = Math.round(parseInt(Object.values(visiting_wins)[i]) /  (parseInt(Object.values(visiting_wins)[i]) + parseInt(Object.values(visiting_losses)[i])) * 100) / 100
            }

            // console.log(teams)
            // console.log(records)
            // console.log(col)
            // console.log(home_wins)
            // console.log(home_losses)
            // console.log(visiting_wins)
            // console.log(visiting_losses)
            // // console.log(winners)
            // console.log(fields)
            // const distinctFields = [...new Set(fields)]
            // console.log(distinctFields)
    
        })
    })
}





getData();


