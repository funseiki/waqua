var width = 600,
    height = 400;

// map id's to numbers
var rateById = d3.map();

// round values to a set value in the range
var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

// Loads the albers projection to project map
var projection = d3.geo.albersUsa()
    // Bigger > zooms in
    //.center([-90.9119886116482,40.19316792190344])
    .scale(3520)
    .translate([0, height / 1.5]);

// Creates a path data string sutable for "d" in svg's
var path = d3.geo.path()
    .projection(projection);

// Make a new svg
var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var county_click = function( thing) {
    console.log(thing);
    console.log(thing.id);
    console.log(d3.select("#countyID-"+thing.id));
    //event.
}

// initialize a queue of files to load before using files
queue()
    // load the .json and .tsv
    .defer(d3.json, "data/illinois.json")
    .defer(d3.tsv, "data/counties.tsv", function(d) { rateById.set(d.id, +d.rate); })
    // After they are loaded, call ready() and give each .json
    .await(ready);

// function that lays out the map
function ready(error, us) {
    // g Groups svgs
    svg.append("g")
        .attr("transform", "rotate(3.78)")
        // the group class is counties
        .attr("class", "counties")
        // all of the path uses the us.json counties data
        .selectAll("path")
            .data(topojson.feature(us, us.objects.illinois2).features)
        // sets each path data to each color class
        .enter().append("path")

        .attr("class", function(d) {
            return quantize(rateById.get(d.id)) + " county"; })
        .attr("id", function(d) { return "countyId-"+ d.id})
        .on("click", county_click)
        .attr("d", path);
}
// Click on county brings up stuff

d3.select(self.frameElement).style("height", height + "px");
