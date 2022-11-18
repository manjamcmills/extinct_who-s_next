function init() {
  // Grab a reference to the dropdown select element  
 var selector = d3.select("#selDataset").attr('class','bold');
 
   // Use the list of sample names to populate the select options
   d3.json("sea_ice.json").then((data) => {
     // Object.entries(data.samples[0]).forEach(([key]) => {
     //   console.log(key)
     // });
 
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
   d3.json("sea_ice.json").then((data) => {
     var metadata = data.metadata;
     // Filter the data for the object with the desired sample number
     var resultArray = metadata.filter(sampleObj => sampleObj.Type == sample);
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
   d3.json("sea_ice.json").then((data) =>{
       //console.log(data.samples)
       var samples = data.samples;
       var filterSamples = samples.filter(sampleObj => sampleObj.Type == sample);
       var firstSample = filterSamples[0];
       var yearSub = []
       for (var i = 0; i < 61; i++) {
           yearSub.push(1978);
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
       for (var x = 0; x <= 70; x += 1) {
           xValues.push(x+1978);
           yValues.push(x * slope + intercept);
       }
       //console.log(xValues);
       //console.log(yValues);
   });
};



//Create the buildCharts function.
function buildCharts(sample) {
 //Use d3.json to load and retrieve the samples.json file 
 d3.json("sea_ice.json").then((data) => {
   //Create a variable that holds the samples array. 
   var samples = data.samples;
   var metaD = data.metadata;
   //Create a variable that filters the samples for the object with the desired sample number.
   var filterSamples = samples.filter(sampleObj => sampleObj.Type == sample);
   // Create a variable that filters the metadata array for the object with the desired sample number.
   var filterMeta = metaD.filter(metaObj => metaObj.Type == sample);
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
     type: "scatter",
     
   };
     
   
   // Create the layout for the bar chart. 
   var barLayout = {
    legend: { x: 0.1,
      y: .5,
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 12,
        color: '#000'
      },
      bgcolor: '#E2E2E2',
      bordercolor: '#FFFFFF',
      borderwidth: 2
    },
    title: {text: Object.values(firstSample).pop(), 
    font: {color: "green", size: 30, family: "Arial"}},  xaxis:{title:"Years"},  yaxis:{title: 'millions of sq km'}
   };
   // Use Plotly to plot the data with the layout. 
   Plotly.newPlot("bar", [barData], barLayout);
 
   var yearSub = []
       for (var i = 0; i < 61; i++) {
           yearSub.push(1978);
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
       for (var x = 0; x < 50; x += 1) {
           xValues.push(x+1978);
           yValues.push(x * slope + intercept);
       }
   
   // Create the trace for the linear regression chart.
   var linearData = {
     x: xValues,
     y: yValues,
     text: years,
     name: "FORECASTED " + Object.values(firstSample).pop(),
     //name: Object.values(firstSample).pop(), 
     line: {color: "red", width: 4},
     type: "line",
     
   };

 // Create the layout for the linear regression chart.
 var linearLayout = {
  legend: { x: .3,
    y: 1,
    traceorder: 'normal',
    font: {
      family: 'sans-serif',
      size: 12,
      color: '#000'
    },
    bgcolor: '#E2E2E2',
    bordercolor: '#FFFFFF',
    borderwidth: 2
  },
   title: {text: Object.values(firstSample).pop(), 
   font: {color: "green", size: 30, family: "Arial"}},  xaxis:{title:"Years"},  yaxis:{title: 'millions of sq km'}
 };
 var scatterData = {
   x: xticks,
   y: year_value,
   text: years,
   name: Object.values(firstSample).pop(),
   marker: {color: "black", opacity: 0.6},
   type: "scatter",
   
 };
 //  Use Plotly to plot the data with the layout.
 Plotly.newPlot("bar", [linearData, scatterData], linearLayout);
 

 });
};

//Global Sea Ice Chart
d3.json("global_sea_ice.json").then((data) => {
  var years = Object.keys(data.data)
  
  var data_values = Object.values(data.data);
  console.log(Object.values(data.data))
  var xticks = years;

  var co2Reg = {
      x: xticks,
      y: data_values,
      text: years,
      name: "Global Sea Ice Area",
      marker: {color: "teal", opacity: 0.6},
      type: "bar",
      
    };
 
  var CO2Layout = {
    legend: { x: 0.1,
      y: .5,
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 12,
        color: '#000'
      },
      bgcolor: '#E2E2E2',
      bordercolor: '#FFFFFF',
      borderwidth: 2
    },
    title: {text: "<b>Is Global Sea Ice Decreasing? </b>", 
    font: {color: "teal", size: 40, family: "Arial"}}, xaxis:{title:"Years"},  yaxis:{title: "Sea ice area, in millions of sq km"}
  };

  var yearSub = []
  for (var i = 0; i < 61; i++) {
      yearSub.push(1978);
  }
   
  var xArray = [];
  for(var i = 0; i<years.length; i++)
      xArray.push(years[i] - yearSub[i]);
  
  var yArray = data_values;
  //console.log(xArray)
  // Calculate Sums
  var xSum=0, ySum=0 , xxSum=0, xySum=0;
  var count = xArray.length;
  console.log(count);
  for (var i = 0, len = count; i < count; i++) {
      xSum += xArray[i];
      ySum += yArray[i];
      xxSum += xArray[i] * xArray[i];
      xySum += xArray[i] * yArray[i];
  }
  
  // Calculate slope and intercept
  var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
  var intercept = (ySum / count) - (slope * xSum) / count;
  
  // Generate values
  var xValues = [];
  var yValues = [];
  for (var x = 0; x < 50; x += 1) {
      xValues.push(x+1978);
      yValues.push(x * slope + intercept);
  }

// Create the trace for the linear regression chart.
var co2Data = {
x: xValues,
y: yValues,
text: years,
name: "Forecasted Sea Ice Area",
//name: Object.values(firstSample).pop(), 
line: {color: "red", width: 4},
type: "line",

};

Plotly.newPlot("sea_ice", [ co2Reg, co2Data], CO2Layout);
});