    
var formatAsPercentage = d3.format("%"), formatAsInteger = d3.format(",");    
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function dsPieChart(features) {
    var dataArray = [];
    var dataArray2 = [];

    for (var i = 0; i < 12; i++) {
        var monthData = [];
        dataArray.push(monthData);
    }

    for (var i = 0; i < 12; i++) {
        features.forEach(function (feature) {
            if (feature.properties.month == i) {
                //return d;
                dataArray[i].push(feature);
            }
        });
    }

    for (var i = 0; i < 12; i++) {
        dataArray2[i] = (dataArray[i].length / features.length).toFixed(2);
    }

    var dataset = [
    { category: "Jan", measure: dataArray2[0], month: months[0], features: dataArray[0] },
     { category: "Feb", measure: dataArray2[1], month: months[1], features: dataArray[1] },
      { category: "Mar", measure: dataArray2[2], month: months[2], features: dataArray[2] },
       { category: "Apr", measure: dataArray2[3], month: months[3], features: dataArray[3] },
        { category: "May", measure: dataArray2[4], month: months[4], features: dataArray[4] },
         { category: "Jun", measure: dataArray2[5], month: months[5], features: dataArray[5] },
          { category: "Jul", measure: dataArray2[6], month: months[6], features: dataArray[6] },
           { category: "Aug", measure: dataArray2[7], month: months[7], features: dataArray[7] },
            { category: "Sep", measure: dataArray2[8], month: months[8], features: dataArray[8] },
             { category: "Oct", measure: dataArray2[9], month: months[9], features: dataArray[9] },
              { category: "Nov", measure: dataArray2[10], month: months[10], features: dataArray[10] },
               { category: "Dec", measure: dataArray2[11], month: months[11], features: dataArray[11] }
    ];

    var datasetAll = { category: "All", measure: 1.00, month: "All", features: features };

    var dataset3 = [
    { category: "Jan", measure: (dataArray[0].length / features.length).toFixed(2) },
     { category: "Feb", measure: (dataArray[1].length / features.length).toFixed(2) },
      { category: "Mar", measure: (dataArray[2].length / features.length).toFixed(2) },
       { category: "Apr", measure: (dataArray[3].length / features.length).toFixed(2) },
        { category: "May", measure: (dataArray[4].length / features.length).toFixed(2) },
         { category: "Jun", measure: (dataArray[5].length / features.length).toFixed(2) },
          { category: "Jul", measure: (dataArray[6].length / features.length).toFixed(2) },
           { category: "Aug", measure: (dataArray[7].length / features.length).toFixed(2) },
            { category: "Sep", measure: (dataArray[8].length / features.length).toFixed(2) },
             { category: "Oct", measure: (dataArray[9].length / features.length).toFixed(2) },
              { category: "Nov", measure: (dataArray[10].length / features.length).toFixed(2) },
               { category: "Dec", measure: (dataArray[11].length / features.length).toFixed(2) }

    ];          

    var width = 200, height = 200, outerRadius = Math.min(width, height) / 2, innerRadius = outerRadius * .999, innerRadiusFinal = outerRadius * .5,
       innerRadiusFinal3 = outerRadius * .45, color = d3.scale.category20();

    var vis = d3.select("#pieChart").append("svg:svg").data([dataset]).attr("width", width)           
             .attr("height", height)
             .append("svg:g")         
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    
    ;

    var arc = d3.svg.arc()            
.outerRadius(outerRadius).innerRadius(innerRadius);
           
    var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
    var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

    var pie = d3.layout.pie()
             .sort(null)         
             .value(function (d) { return d.measure; });    

    var arcs = vis.selectAll("g.slice")    
             .data(pie)                        
             .enter()                          
            .append("svg:g")             
            .attr("class", "slice")   
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", up)
    ;

    arcs.append("svg:path")
     .attr("fill", function (d, i) { return color(i); })
     .attr("d", arc)     
     .append("svg:title")            
     .text(function (d) { return d.data.month + ": " + formatAsPercentage(d.data.measure); });

    d3.selectAll("g.slice").selectAll("path").transition()
       .duration(750)
       .delay(10)
       .attr("d", arcFinal)
    ;           
    arcs.filter(function (d) { return d.endAngle - d.startAngle > .2; })
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
         .attr("transform", function (d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })           
        .text(function (d) { return d.data.category; })
    ;
          
    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }
         
    vis.append("svg:text")
       .attr("dy", ".35em")
       .attr("text-anchor", "middle")          
       .text("2015")
       .attr("class", "title")
       .on("click", up2)
    ;

    function mouseover() {
        d3.select(this).select("path").transition()
          .duration(750)               
          .attr("d", arcFinal3)
        ;
    }

    function mouseout() {
        d3.select(this).select("path").transition()
          .duration(750)             
         .attr("d", arcFinal)
        ;
    }

    function up(d, i) {               
        updateBarChart(d.data.category, color(i), d.data.measure, d.data.month, d.data.features);      
    }

    function up2(d, i) {               
        updateBarChart(datasetAll.category, "lightgrey", "1.00", "All", datasetAll.features);
    }
}
       
var group = "All";
var datasetBarChart = [];
//var offenseType = ["ARSON", "ASSAULT W/DANGEROUS WEAPON", "BURGLARY", "HOMICIDE", "MOTOR VEHICLE THEFT", "ROBBERY", "SEX ABUSE", "THEFT F/AUTO", "THEFT/OTHER"];
var offenseType2 = ["Arson", "Assult", "Burglary", "Homeside", "Motor Theft", "Robbery", "Sex Abuse", "F/Auto", "Theft/Other"];

function dsBarChart_init(features) {
    var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var barArray = [];  
    var barArray2 = [];   
             
    for (var j = 0; j < offenseType.length; j++) {
        var subOffense = offenseType[j];
        var subOffense2 = offenseType2[j];
        var typeObj = {};
        barArray2 = [];

        $.each(features, function (i, d) {
            if (d.properties.OFFENSE == subOffense) {
                barArray2.push(d);
            }
        });

        typeObj.group = "All";               
        typeObj.category = subOffense2;
        typeObj.measure = barArray2.length;
        datasetBarChart.push(typeObj);
    }
           
    for (var k = 0; k < 12; k++) {
        for (var j = 0; j < offenseType.length; j++) {
            var subOffense = offenseType[j];
            var subOffense2 = offenseType2[j];
            var selectedData = [];
            var typeObj = {};
            barArray2 = [];

            $.each(features, function (i, d) {
                if ((d.properties.OFFENSE == subOffense) && (d.properties.month == k)) {                           
                    barArray2.push(d);
                }
            });

            typeObj.group = monthArray[k];                   
            typeObj.category = subOffense2;
            typeObj.measure = barArray2.length;
            datasetBarChart.push(typeObj);
        }
    }        

    dsBarChart(datasetBarChart, features)
}

function datasetBarChosen(group) {
    var ds = [];
    for (x in datasetBarChart) {
        if (datasetBarChart[x].group == group) {
            ds.push(datasetBarChart[x]);
        }
    }
    return ds;
}


function dsBarChartBasics() {

    var margin = { top: 30, right: 10, bottom: 15, left: 10 },
                   width = 600 - margin.left - margin.right,
                   height = 180 - margin.top - margin.bottom,
                   colorBar = d3.scale.category20(),
                   barPadding = 1
    ;

    return {
        margin: margin,
        width: width,
        height: height,
        colorBar: colorBar,
        barPadding: barPadding
    }
    ;
}
       
function dsBarChart(datasetBarChart, features) {
    var firstDatasetBarChart = datasetBarChosen(group);
    var basics = dsBarChartBasics();
    var margin = basics.margin,
        width = basics.width,
        height = basics.height,
        colorBar = basics.colorBar,
        barPadding = basics.barPadding
    ;

    var xScale = d3.scale.linear()
                   .domain([0, firstDatasetBarChart.length])
                   .range([0, width])
    ;           
    var yScale = d3.scale.linear()           
                   .domain([0, d3.max(firstDatasetBarChart, function (d) { return d.measure; })])           
                   .range([height, 0])
    ;
    var svg = d3.select("#barChart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id", "barChartPlot")
    ;

    var plot = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

    plot.selectAll("rect")
        .data(firstDatasetBarChart)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);
        })
      .attr("width", width / firstDatasetBarChart.length - barPadding)
      .attr("y", function (d) {
          return yScale(d.measure);
      })
   .attr("height", function (d) {
       return height - yScale(d.measure);
   })
   .attr("fill", "lightgrey")
    ;
    plot.selectAll("text")
        .data(firstDatasetBarChart)
       .enter()
       .append("text")
       .text(function (d) {
           return formatAsInteger(d3.round(d.measure));
       })
       .attr("text-anchor", "middle")           
       .attr("x", function (d, i) {
           return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
       })
     .attr("y", function (d) {   
         return yScale(d.measure) - 5;
     })
     .attr("class", "yAxis")          
    ;       

    var xLabels = svg.append("g")
                     .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")")
    ;
    xLabels.selectAll("text.xAxis")
           .data(firstDatasetBarChart)
           .enter()
           .append("text")
           .text(function (d) { return d.category; })
           .attr("text-anchor", "middle")          
           .attr("x", function (d, i) {
               return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
           })         
           .attr("y", 15)
           .attr("class", "xAxis")                   
    ;          

    svg.append("text").attr("x", (width + margin.left + margin.right) / 2)            
       .attr("y", 25)
       .attr("class", "title")
       .attr("text-anchor", "middle")         
       .text("Overall Crime Incidents 2015: " + features.length)
    ;
}       

function updateBarChart(group, colorChosen, measure, month, features) {

    var currentDatasetBarChart = datasetBarChosen(group);

    var basics = dsBarChartBasics();

    var margin = basics.margin,
         width = basics.width,
        height = basics.height,
        colorBar = basics.colorBar,
        barPadding = basics.barPadding
    ;

    var xScale = d3.scale.linear()
                         .domain([0, currentDatasetBarChart.length])
                         .range([0, width])
    ;

    var yScale = d3.scale.linear()
                   .domain([0, d3.max(currentDatasetBarChart, function (d) { return d.measure; })])
                   .range([height, 0])
    ;

    var svg = d3.select("#barChart svg");

    var plot = d3.select("#barChartPlot")
                 .datum(currentDatasetBarChart)
    ;
          
    plot.selectAll("rect")
        .data(currentDatasetBarChart)
        .transition()
        .duration(750)
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("width", width / currentDatasetBarChart.length - barPadding)
        .attr("y", function (d) {
            return yScale(d.measure);
        })
        .attr("height", function (d) {
            return height - yScale(d.measure);
        })
       .attr("fill", colorChosen)
    ;

    plot.selectAll("text.yAxis") 
        .data(currentDatasetBarChart)
        .transition()
        .duration(750)
        .attr("text-anchor", "middle")
        .attr("x", function (d, i) {
            return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
        })
        .attr("y", function (d) {  
            return yScale(d.measure) - 5;
        })
         .text(function (d) {
             return formatAsInteger(d3.round(d.measure));
         })
         .attr("class", "yAxis")
    ;

    if (month != "All") {
        svg.selectAll("text.title") 
           .attr("x", (width + margin.left + margin.right) / 2)                
           .attr("y", 25)
           .attr("class", "title")
           .attr("text-anchor", "middle")               
            .text("Crime Incident in " + month + " 2015: " + features.length + " (" + formatAsPercentage(measure) + ")")
        ;
    }
    else if (month == "All") {
        svg.selectAll("text.title") 
           .attr("x", (width + margin.left + margin.right) / 2)               
           .attr("y", 25)
           .attr("class", "title")
           .attr("text-anchor", "middle")               
           .text("Overall Crime Incidents 2015: " + features.length)
        ;
    }
}  
