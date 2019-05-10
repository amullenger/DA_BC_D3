// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 40,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from csv 
d3.csv('data.csv').then(function(censusData, error){
  if (error) {
    console.log(error);
  };

  // Cast desired columns as numbers
  censusData.forEach(function(data){
    console.log(data.poverty);
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });
  
  // Create axis scales
  var xLinearScale = d3.scaleLinear()
    .domain([6, d3.max(censusData, d => d.poverty)])
    .range([0, width]);
  var yLinearScale = d3.scaleLinear()
    .domain([10, d3.max(censusData, d => d.obesity)])
    .range([height, 0]);
  
  // Create axis variables
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale)

  // Append axes
  chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append('g')
    .call(leftAxis);
  
  // Create circles group
  var circlesGroup = chartGroup.selectAll('circle')
    .data(censusData)
    .enter()
    .append('circle')
    .attr('class', 'stateCircle')
    .attr('cx', d => xLinearScale(d.poverty))
    .attr('cy', d => yLinearScale(d.obesity))
    .attr('r', '15');
  
  circlesGroup.append('text')
    .attr('class', 'stateText')
    .attr('dx', d => xLinearScale(d.poverty))
    .attr('dy', d => yLinearScale(d.obesity))
    .text(function(d) {
      return (`${d.abbr}`)
    });

  // Create tooltip to display state abbreviations
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-2, 0])
    .html(function(d){
      return (`${d.abbr}`);
    });
  
  chartGroup.call(toolTip);

  circlesGroup.on('mouseover', function(data){
    toolTip.show(data, this);
  })
    .on('mouseout', function(data, index){
      toolTip.hide(data);
    });
  
  // Create axis labels
  
  chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0-margin.left+15)
    .attr('x', 0-(height / 1.5))
    .attr('dy', 'lem')
    .attr('class', 'axisText')
    .text('Obesity Percentage');

  chartGroup.append('text')
    .attr('transform', `translate(${width / 2.5}, ${height + margin.top - 10})`)
    .attr('class', 'axisText')
    .text('Poverty Percentage');
  });