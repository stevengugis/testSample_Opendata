var url = "http://opendata.dc.gov/datasets?q=*&page=3&sort_by=updated_at";
var url2 = "http://opendata.dc.gov/datasets?q=*&page=";
var url3 = "&sort_by=updated_at";
var page_count = 0;
var pageArray = [];
var datasetArray = [];
var tmpCount = 0;
var selectedObj = {};
localStorage.setItem("New Layer Name", "");

$(document).ready(function () {
    //1. get datasets count:
    var url1 = "http://opendata.dc.gov/datasets";
    $('#geoJsonUrl').val('');

    $.get(url1, function (data1) {
        var total_count = data1.metadata.stats.total_count;
        page_count = Math.ceil(total_count / data1.metadata.stats.count);
        getGeoJsonData(page_count)
    });
});

function getGeoJsonData(page_count) {
    for (var i = 1; i <= page_count; i++) {
        pageArray.push(url2 + i + url3);
    }

    for (var i = 0; i < pageArray.length; i++) {
        doAjax(i);
    }

    function doAjax(i) {
        var url5 = "http://opendata.dc.gov/datasets";

        $.get(pageArray[i], function (data3) {
            for (var j = 0; j < data3.metadata.stats.count; j++) {
                var datasetObj = {};
                tmpCount++;
                datasetObj.value = data3.data[j].item_name;

                if (datasetObj.value.toString().indexOf("Crime Incidents") != -1) {
                    datasetObj.id = data3.data[j].id;
                    datasetObj.geojsonurl = "http://opendata.dc.gov/datasets/" + data3.data[j].id + ".geojson";
                    datasetObj.csvurl = "http://opendata.dc.gov/datasets/" + data3.data[j].id + ".csv";
                    datasetArray.push(datasetObj);
                }
            }
        });
    }
}

$(function () {
    $("#geoJsonUrl").autocomplete({
        source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            var matching = $.grep(datasetArray, function (obj) {
                var name = obj.value;
                var id = obj.id;
                var geojsonurl = obj.geojsonurl;

                return matcher.test(name) || matcher.test(geojsonurl) || matcher.test(id);
            });
            response(matching);
        },
        select: function (event, ui) {
            selectedObj.name = ui.item.value;
            selectedObj.geojsonurl = ui.item.geojsonurl;
            selectedObj.csvurl = ui.item.csvurl;
        }
    });
});

$('#btnAdd').click(function () {
    localStorage.setItem(selectedObj.name, JSON.stringify(selectedObj));
    localStorage.setItem("New Layer Name", selectedObj.name);
    console.log("New Layer Name: " + selectedObj.name);          
    loadToMap();
});

function loadToMap() {
    getDataset();

    if (geojson_url != "") {
        funcA();
        createDashboard(selectedObj);
    }
}

function createDashboard(selectedObj) {
    selectedYear = selectedObj.name.slice(-4);
    $.getJSON(selectedObj.geojsonurl, function (wholedata) {
        if (wholedata) {
            console.log("whole geojson data downloaded");
            wholedata.features = wholedata.features.map(function (d) {
                var tmp = Date.parse(d.properties.REPORTDATETIME);
                d.properties.month = new Date(tmp).getMonth();
                return d;
            });
            downloadedData = wholedata;
            $("#pieChart").css("display", "block");
            $("#barChart").css("display", "block");
            $("#pieChart").empty();
            $("#barChart").empty();
            dsPieChart(downloadedData.features);
            dsBarChart_init(downloadedData.features);
        }
    });
}
