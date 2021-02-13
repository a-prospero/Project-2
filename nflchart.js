fetch('./nfl_work/transformed_nfl_data.csv')
   .then(function (response) {
      return response.text();
   })
   .then(function (text) {
    let series = csvToSeries(text);
    renderChart(series);
    console.log(series);
})
   .catch(function (error) {
      //Something went wrong
      console.log(error);
   });
   function csvToSeries(text) {
	const winPercentage = 'Home_Win_Percentage';
	let dataAsJson = JSC.csv2Json(text);
	let wins = [], losses = [];
	dataAsJson.forEach(function (row) {
		 //add either to male, female, or discard.
         if (row.teams === '49ers','Bears', 'Bengals', 'Bills', 'Broncos', 'Browns', 'Buccaneers', 'Cardinals', 'Chargers', 'Chiefs', 'Colts', 'Cowboys', 'Dolphins', 'Eagles', 'Falcons', 'Giants', 'Jaquars', 'Jets', 'Lions', 'Packers', 'Panthers', 'Patriots', 'Raiders', 'Rams', 'Ravens', 'Redskins', 'Saints', 'Seahawks', 'Steelers', 'Texans', 'Titans', 'Vikings' ) {
			if (row.wins >0) {
				wins.push({x: row.teams, y: row["wins"]});
			
				losses.push({x: row.teams, y: row["losses"]});
			}
		}    
	});
    return [
        {name: 'Wins', points: wins},
        {name: 'Losses', points: losses}
    ];
    console.log([wins,losses]);
}

function renderChart(series){
    JSC.Chart('chartDiv', {
       series: series
    });
}

