// Create an array of each country's numbers
var nfl = Object.values('/nflchart.js');
var nhl = Object.values('/mlbchart.js');
var mlb = Object.values('/nhlchart.js');

// Create an array of music provider labels
var labels = Object.keys(data.us);



// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// Function called by DOM changes
function getData() {
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");
  // Initialize an empty array for the country's data
  var data = [];

  if (dataset == 'nfl') {
      data = nfl;
  }
  else if (dataset == 'nhl') {
      data = nhl;
  }
  else if (dataset == 'mlb') {
      data = mlb;
  }
  // Call function to update the chart
  updatePlotly(data);
}



init();