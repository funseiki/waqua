var width = 600,
    height = 400;

// map id's to numbers
var countyMapping = d3.map();

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

var classMap = {

};

var classCSS = "";

// initialize a queue of files to load before using files
queue()
    // load the .json and .tsv
    .defer(d3.json, "data/illinois.json")
    .defer(d3.tsv, "data/counties.tsv", function(d) {
        var contaminants = d.contaminants.split(",");

        for(var i = 0; i < contaminants.length; i++) {
            var key = contaminants[i];
            if(!classMap[key]) {
                classMap[key] = key.replace(/ /g, '');

            }
        }
        countyMapping.set(d.id, {
            name: d.name,
            date: d.date,
            contaminants: contaminants
        });
    })
    // After they are loaded, call ready() and give each .json
    .await(ready);

var colorsCSS = [
    "#BF7130",
    "#A64B00",
    "#1D7373",
    "#006363",
    "#269926",
    "#269926",
    "#008500",
    "#BF3030"
];

// function that lays out the map
function ready(error, us) {
    var count = 0;
    for (var key in classMap) {
        count = (count + 1) % colorsCSS.length;
        var cssClass = classMap[key].split("(")[0];

        classCSS += "\n" +
            ".contaminant-" + cssClass + " {\n"+
            + "    fill:" + colorsCSS[count] + "\n"
            +"}";
    }
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
            return "county ";
            //return quantize(countyMapping.get(d.id)) + " county";
        })
        .attr("id", function(d) { return "countyId-"+ d.id})
        .on("click", county_click)
        .attr("d", path);
}
// Click on county brings up stuff

d3.select(self.frameElement).style("height", height + "px");
