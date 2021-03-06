function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
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

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then (sampledata =>{
    console.log(sampledata)
    var ids = sampledata.samples[0].otu_ids;
    console.log(ids)
    var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
    console.log(sampleValues)
    var labels =  sampledata.samples[0].otu_labels.slice(0,10);
    console.log (labels)
    var scrubs = sampledata.metadata[0].wfreq;
    console.log (scrubs)
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last.  
    var yticks = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
    // get the otu id's to the desired form for the plot
    var OTU_id = yticks.map(d => "OTU " + d);
    console.log(`OTU IDS: ${OTU_id}`)
    // get the top 10 labels for the plot
    var labels =  sampledata.samples[0].otu_labels.slice(0,10);
    console.log(`OTU_labels: ${labels}`)
    var barData = [{
        x: sampleValues,
        y: OTU_id,
        text: labels,
        type:"bar",
        orientation: "h",
    }];
    // Create layout for the bar chart.
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 30
        }
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);
    // Create the trace for the bubble chart.
    var bubbleData = [{
        x: sampledata.samples[0].otu_ids,
        y: sampledata.samples[0].sample_values,
        mode: "markers",
        marker: {
            size: sampledata.samples[0].sample_values,
            color: sampledata.samples[0].otu_ids
        },
        text:  sampledata.samples[0].otu_labels

    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000
    };

    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: scrubs,
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
        gauge: {
          axis: { range: [null, 10]},
          bar: { color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}  