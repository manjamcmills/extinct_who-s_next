function init() {
  // Grab a reference to the dropdown select element  
 var selector = d3.select("#selDataset").attr('class','bold');
 
   // Use the list of sample names to populate the select options
   d3.json("sea_level.json").then((data) => {
     // Object.entries(data.samples[0]).forEach(([key]) => {
     //   console.log(key)
     // });
     console.log(data);
     var sampleNames = data.names;
     sampleNames.forEach((sample) => {
       selector
         .append("option")
         .text(sample)
         .property("value", sample)
         .attr('class','bold');
     });
       // Use the first sample from the list to build the initial plots
     var firstSample = sampleNames[0];
     buildCharts(firstSample);
     buildMetadata(firstSample);
 });
 }
 // Initialize the dashboard
 init();

function optionChanged(newSample) {
 // Fetch new data each time a new sample is selected
   buildMetadata(newSample);
   buildCharts(newSample);
}
// Country Info Panel 
function buildMetadata(sample) {
   d3.json("sea_level.json").then((data) => {
     var metadata = data.metadata;
     console.log(metadata[0])
     // Filter the data for the object with the desired sample number
     var resultArray = metadata.filter(sampleObj => sampleObj.body_of_water == sample);
     var result = resultArray[0];
     // Use d3 to select the panel with id of `#sample-metadata`
     var PANEL = d3.select("#sample-metadata");
     
     // Use `.html("") to clear any existing metadata
     PANEL.html("");
     // Use `Object.entries` to add each key and value pair to the panel
     Object.entries(result).forEach(([key, value]) => {
       PANEL.append("h6").attr("class", "bold").text(`${key.toUpperCase()}: ${value}`);
     });
     
   });
   
 }
 function linReg(sample) {
   d3.json("sea_level.json").then((data) =>{
       //console.log(data.samples)
       var samples = data.samples;
       var filterSamples = samples.filter(sampleObj => sampleObj.body_of_water == sample);
       var firstSample = filterSamples[0];
       var yearSub = []
       for (var i = 0; i < 30; i++) {
           yearSub.push(1992);
       }
       //console.log(yearSub)
       var years = Object.keys(firstSample).slice(0,-1);
       //console.log(years);
       var year_value = Object.values(firstSample).slice(0,-1);
       //console.log(year_value)
       
       var xArray = [];
       for(var i = 0; i<years.length; i++)
           xArray.push(years[i] - yearSub[i]);
       
       console.log(xArray);
       
       var yArray = year_value;
       
       // Calculate Sums
       var xSum=0, ySum=0 , xxSum=0, xySum=0;
       var count = xArray.length;
       //console.log(count);
       for (var i = 0, len = count; i < count; i++) {
           xSum += xArray[i];
           ySum += yArray[i];
           xxSum += xArray[i] * xArray[i];
           xySum += xArray[i] * yArray[i];
       }
       //console.log(xSum);
       // Calculate slope and intercept
       var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
       var intercept = (ySum / count) - (slope * xSum) / count;
       console.log(slope);
       console.log(intercept);
       // Generate values
       var xValues = [];
       var yValues = [];
       for (var x = 0; x <= 30; x += 1) {
           xValues.push(x+1992);
           yValues.push(x * slope + intercept);
       }
       //console.log(xValues);
       //console.log(yValues);
   });
};



//Create the buildCharts function.
function buildCharts(sample) {
 //Use d3.json to load and retrieve the samples.json file 
 d3.json("sea_level.json").then((data) => {
   //Create a variable that holds the samples array. 
   var samples = data.samples;
   var metaD = data.metadata;
   //Create a variable that filters the samples for the object with the desired sample number.
   var filterSamples = samples.filter(sampleObj => sampleObj.body_of_water== sample);
   // Create a variable that filters the metadata array for the object with the desired sample number.
   var filterMeta = metaD.filter(metaObj => metaObj.body_of_water== sample);
   //  Create a variable that holds the first sample in the array.
   var firstSample = filterSamples[0];
    // Create a variable that holds the first sample in the metadata array.
   var firstMeta = filterMeta[0];
   // Create variables that hold the otu_ids, otu_labels, and sample_values.
   var years = Object.keys(firstSample).slice(0,-1);
   //console.log(years);
   var year_value = Object.values(firstSample).slice(0,-1);
   //console.log(year_value)

    
   var xticks = years;
   // Create the trace for the bar chart. 
   var barData = {
     x: xticks,
     y: year_value,
     text: years,
     name: Object.values(firstSample).pop(), 
     marker: {color: "blue", opacity: 1},
     mode: 'markers',
     type: "bar",
     
   };
     
   
   // Create the layout for the bar chart. 
   var barLayout = {
    title: {text: "<b>Temperature Change with Respect to a Baseline Climatology</b><br>Country:  " +  Object.values(firstSample).pop(), 
    font: {color: "blue", size: 30, family: "Arial"}}, showlegend: false, xaxis:{title:"Years"},  yaxis:{title: 'Baseline Climatology corresponding <br> to the period 1951-1980'}
  };
   // Use Plotly to plot the data with the layout. 
   Plotly.newPlot("bar", [barData], barLayout);
 
   var yearSub = []
       for (var i = 0; i < 61; i++) {
           yearSub.push(1992);
       }
        
       var xArray = [];
       for(var i = 0; i<years.length; i++)
           xArray.push(years[i] - yearSub[i]);
       
       console.log(xArray);
       
       var yArray = year_value;
       
       // Calculate Sums
       var xSum=0, ySum=0 , xxSum=0, xySum=0;
       var count = xArray.length;
       //console.log(count);
       for (var i = 0, len = count; i < count; i++) {
           xSum += xArray[i];
           ySum += yArray[i];
           xxSum += xArray[i] * xArray[i];
           xySum += xArray[i] * yArray[i];
       }
       //console.log(xSum);
       // Calculate slope and intercept
       var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
       var intercept = (ySum / count) - (slope * xSum) / count;
       console.log(slope);
       console.log(intercept);
       // Generate values
       var xValues = [];
       var yValues = [];
       for (var x = 0; x < 40; x += 1) {
           xValues.push(x+1992);
           yValues.push(x * slope + intercept);
       }
   
   // Create the trace for the linear regression chart.
   var linearData = {
     x: xValues,
     y: yValues,
     text: years,
     //name: Object.values(firstSample).pop(), 
     line: {color: "red", width: 4},
     type: "line",
     
   };

 // Create the layout for the linear regression chart.
 var linearLayout = {
    title: {text: "<b>FORECASTED Temperature Change with Respect to a Baseline Climatology</b><br>Country:  " +  Object.values(firstSample).pop(), 
    font: {color: "green", size: 30, family: "Arial"}}, showlegend: false, xaxis:{title:"Years"},  yaxis:{title: 'Baseline Climatology corresponding <br> to the period 1951-1980'}
  };
 var scatterData = {
   x: xticks,
   y: year_value,
   text: years,
  mode: "markers",
   name: Object.values(firstSample).pop(),
   marker: {color: "black", opacity: 0.6},
   type: "scatter",
   
 };
 //  Use Plotly to plot the data with the layout.
 Plotly.newPlot("linReg", [linearData, scatterData], linearLayout);
 

 });
};