var width = 400,
    height = 400;

var classFromContaminant = function(contaminant) {
    var noSpace = contaminant.replace(/ /g, '');
    return "contaminant-" + noSpace.split("(")[0];
}

// map id's to numbers
var countyMapping = d3.map();
var countyNameToId = {

};

var allContaminants = {

};

// Loads the albers projection to project map
var projection = d3.geo.albersUsa()
    // Bigger > zooms in
    //.center([-90.9119886116482,40.19316792190344])
    .scale(3520)
    .translate([-width/2, height / 1.5]);

// Creates a path data string sutable for "d" in svg's
var path = d3.geo.path()
    .projection(projection);

// Make a new svg
var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var county_click = function(county) {
    console.log(d3.select("#countyID-"+county.id));
}

// initialize a queue of files to load before using files
queue()
    // load the .json and .tsv
    .defer(d3.json, "data/illinois.json")
    .defer(d3.tsv, "data/counties.tsv", function(d) {
        var contaminants = d.contaminants.split(",");
        countyNameToId[d.name] = d.id;
        for(var i = 0; i < contaminants.length; i++) {
            if(!allContaminants[contaminants[i]]) {
                allContaminants[contaminants[i]] = [];
            }
            allContaminants[contaminants[i]].push(d.id);
        }
        countyMapping.set(d.id, {
            name: d.name,
            date: d.date,
            contaminants: contaminants
        });
    })
    // After they are loaded, call ready() and give each .json
    .await(ready);

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, obj) {
            var str = obj.value;
            if (substrRegex.test(str)) {
                // the typeahead jQuery plugin expects suggestions to a
                // JavaScript object, refer to typeahead docs for more info
                matches.push({ value: str });
            }
        });

        cb(matches);
    };
};

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
            var county = countyMapping.get(d.id);
            return "county "+ classFromContaminant(county.contaminants[0]);
        })
        .attr("id", function(d) { return "countyId-"+ d.id})
        .on("click", county_click)
        .attr("d", path);

    $('#county_select .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 0
    },
    {
        name: 'countyList',
        displayKey: 'value',
        source: substringMatcher($.map(countyMapping, function(county) {return {id: county.id, value: county.name}}))
    });
    $('#county_select').bind('typeahead:selected', function(obj, datum, name) {
        var county = countyMapping.get(countyNameToId[datum.value]);
        $("#county-info-name").html(county.name);
        $("#county-violation-date").html(county.date);
        $("#county-contaminants").html(county.contaminants.toString());
    });

    for(var index in allContaminants) {
        $(".dropdown-menu").append('<li><a>'+ index +'</a></li>');
    }

    $( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
        var $target = $( event.currentTarget );
        var contaminant = $target.find('a').html();
        var group = $target.closest( '.btn-group' );
        group.find('.selection_text').html(contaminant);
        if(contaminant == "All Contaminants") {
            d3.selectAll('.county').classed('noContaminant', false);
        }
        else {
            d3.selectAll('.county').classed('noContaminant', true);
            for(var i = 0; i < allContaminants[contaminant].length; i++) {
                var id = allContaminants[contaminant][i];
                d3.select('#countyId-' + id).classed('noContaminant', false);
            }
        }
    });
}

// Click on county brings up stuff
d3.select(self.frameElement).style("height", height + "px");
