const nflUrl = "'/nfl_work/transformed_nfl_data.csv'";
const nhlUrl = '/NHL_HomeWins.csv'
const mblURL = '/static/baseball_stats.csv'

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
