// Read in json data
d3.json("samples.json").then(function(data) {

    // Display the json in the console
    console.log(data);

    // Select the dropdown menu
    var select = d3.select("#selDataset");

    // Append the list of test subjects to the dropdown menu
    for (var i=0; i<data.names.length; i++) {
        select.append("option").text(data.names[i])
    };
});

function handleSubmit() {

    // Prevent page from refreshing
    d3.event.preventDefault();

    // Select dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Select the test subject number
    var id_selection = dropdownMenu.property("value");

    // Build plot with chosen test subject
    buildPlot(id_selection);
};

function buildPlot(id_selection) {

    // Remove all a tags before adding demographic info
    d3.selectAll("p").remove();

    // Read in json data
    d3.json("samples.json").then(function(data) {

        // Select arry of test subject demographic info
        var id_info = data.metadata;

        // Loop through array and grab demographic info that matches id
        for (var i=0; i<id_info.length; i++) {
            if (id_info[i].id === parseInt(id_selection)) {
                var id = id_info[i].id;
                var ethnicity = id_info[i].ethnicity;
                var gender = id_info[i].gender;
                var age = id_info[i].age;
                var location = id_info[i].location;
                var bbtype = id_info[i].bbtype;
                var wfreq = id_info[i].wfreq;
                break;
            };
        };

        // Append demographic info to div
        var select = d3.select("#sample-metadata");
        select.append("p").text('id: ' + id);
        select.append("p").text('ethnicity: ' + ethnicity);
        select.append("p").text('gender: ' + gender);
        select.append("p").text('age: ' + age);
        select.append("p").text('location: ' + location);
        select.append("p").text('bbtype: ' + bbtype);
        select.append("p").text('wfreq: ' + wfreq);

        // Select array of test bacteria data from json
        var id_sample = data.samples;

        // Loop through array and grab data that matches id
        for (var i=0; i<id_sample.length; i++) {
            if (id_sample[i].id === id_selection) {
                var sample_values = id_sample[i].sample_values;

                var otu_ids_ints = id_sample[i].otu_ids;
                var otu_ids = [];
                for (var j=0; j<otu_ids_ints.length; j++) {
                    otu_ids.push(String("OTU " + otu_ids_ints[j]));
                };

                var otu_labels = id_sample[i].otu_labels;

                break;
            };
        };

        // Grab top 10 values for bar chart
        var sample_values_10 = sample_values.slice(0, 10);
        var otu_ids_10 = otu_ids.slice(0, 10);
        var otu_labels_10 = otu_labels.slice(0, 10);

        // Plot data on bar chart
        var trace2 = {
            x: sample_values_10,
            y: otu_ids_10,
            type: "bar",
            text: otu_labels_10,
            orientation: 'h'
        };
        var data = [trace2];
        var layout = {
            title: "Top 10 Bacteria Cultures Found"
        };
        Plotly.newPlot("bar", data, layout);

        // Plot data on bubble chart
        var desired_maximum_marker_size = 100;
        var trace2 = {
            x: otu_ids_ints,
            y: sample_values,
            mode: "markers",
            text: otu_labels,
            marker: {
                color: otu_ids_ints,
                colorscale: 'Picnic',
                size: sample_values,
                sizeref: 2.0 * Math.max(...sample_values) / (desired_maximum_marker_size**2),
                sizemode: 'area'
            },
            type: 'scatter'
        };
        var data = [trace2];
        var layout = {
            title: "Bacteria Cultures Per Sample"
        };
        Plotly.newPlot("bubble", data, layout);
    });
};

// When a new test subject number run the function handleSubmit
d3.select("#selDataset").on("change", handleSubmit);