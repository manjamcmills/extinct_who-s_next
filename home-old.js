//Temperature Chart
d3.json("global_temp.json").then((data) => {
  var years = Object.keys(data.data)
  var data_values = Object.values(data.data);
  var xticks = years;
  var tempData = {
      x: xticks,
      y: data_values,
      text: years,
      name: data.description.title, 
      marker: {color: "blue", opacity: 0.6},
      type: "bar",
      
    };
 
  var linearLayout = {
    title: {text: "Are Global Temperatures Rising?", 
    font: {color: "blue", size: 30, family: "Arial"}}, showlegend: false, xaxis:{title:"Years"},  yaxis:{title: "Global Temperatures Standard<br> Deviation from the Mean"}
  };

  var yearSub = []
  for (var i = 0; i < 142; i++) {
      yearSub.push(1880);
  }
   
  var xArray = [];
  for(var i = 0; i<years.length; i++)
      xArray.push(years[i] - yearSub[i]);
  
  var yArray = data_values;
  //console.log(xArray)
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
  
  // Calculate slope and intercept
  var slope = (count * xySum - xSum * .01857200) / (count * xxSum - xSum * xSum);
  var intercept = (.01857200 / count) - (slope * xSum) / count;
  
  // Generate values
  var xValues = [];
  var yValues = [];
  for (var x = 0; x < 150; x += 1) {
      xValues.push(x+1880);
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

Plotly.newPlot("temp", [tempData, linearData], linearLayout);
});

//CO2 Chart
d3.json("global_co2.json").then((data) => {
  var years = Object.keys(data.data)
  
  var data_values = Object.values(data.data);
  console.log(Object.values(data.data))
  var xticks = years;

  var co2Reg = {
      x: xticks,
      y: data_values,
      text: years,
      marker: {color: "orange", opacity: 0.6},
      type: "bar",
      
    };
 
  var CO2Layout = {
    title: {text: "Are Carbon Emissions Increasing?", 
    font: {color: "orange", size: 30, family: "Arial"}}, showlegend: false, xaxis:{title:"Years"},  yaxis:{title: "Global Temperatures Standard<br> Deviation from the Mean"}
  };

  var yearSub = []
  for (var i = 0; i < 65; i++) {
      yearSub.push(1958);
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
  for (var x = 0; x < 80; x += 1) {
      xValues.push(x+1958);
      yValues.push(x * slope + intercept);
  }

// Create the trace for the linear regression chart.
var co2Data = {
x: xValues,
y: yValues,
text: years,
//name: Object.values(firstSample).pop(), 
line: {color: "red", width: 4},
type: "line",

};

Plotly.newPlot("CO2", [co2Data, co2Reg], CO2Layout);
});


//   //  Use Plotly to plot the data with the layout.
//   Plotly.newPlot("CO2", [linearData, barData], barLayout);
//   //  Use Plotly to plot the data with the layout.
//   Plotly.newPlot("ice", [linearData, iceData], linearLayout);
//   //  Use Plotly to plot the data with the layout.
//   Plotly.newPlot("level", [linearData, scatterData], linearLayout);
// };