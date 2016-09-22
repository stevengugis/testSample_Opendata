  
//var geojson_url = "http://opendata.dc.gov/datasets/35034fcb3b36499c84c94c069ab1a966_27.geojson";     
var geojson_url = "";
var daraSource_url = "http://opendata.dc.gov/datasets/35034fcb3b36499c84c94c069ab1a966_27";
var instruction = "Description: Search crime data in search bar, move slide bar to see the crime incidents in different months, click incident point to check details";
var whereClause = "?where=OFFENSE+%3D%27ROBBERY%27";
var layerIDs = [];

$('#title').text("DC Crime Incidents Viewer");
       
$('#subtitle3').text(instruction);
       
mapboxgl.accessToken = 'pk.eyJ1IjoieXVuamllIiwiYSI6ImNpZnd0ZjZkczNjNHd0Mm0xcGRoc21nY28ifQ.8lFXo9aC9PfoKQF9ywWW-g';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-77.034084142948, 38.909671288923],
    zoom: 12
});

var popup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false
});

var monthLabel = document.getElementById('month');
var curMonth;
var newMonth;
var monCount = 0;
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var offenseType = ["ARSON", "ASSAULT W/DANGEROUS WEAPON", "BURGLARY", "HOMICIDE", "MOTOR VEHICLE THEFT", "ROBBERY", "SEX ABUSE", "THEFT F/AUTO", "THEFT/OTHER"];
var ARSOnIcon = 'url(images/arson_sym.gif)',
        ASSAULTIcon = 'url(images/adw_gun_sym.gif)',
        BURGLARYIcon = 'url(images/burglary_sym.gif)',
        HOMICIDEIcon = 'url(images/homicide_sym.gif)',
        MOTORIcon = 'url(images/stolen_auto_sym.gif)',
        ROBBERYIcon = 'url(images/robbery_sym.gif)',
        SEXABUSEIcon = 'url(images/sex_abuse_sym.gif)',
        THEFTAUTOIcon = 'url(images/theft_from_auto_sym.gif)',
        THEFTOTHERIcon = 'url(images/theft_sym.gif)';

var downloadedData = {};
var markerCollection = [];

function filterBy(month) {          
    popup.remove();

    var filters = [
        "all",
        ["==", "month", month]
    ];
           
    monthLabel.textContent = months[month];
}

map.on('load', function () {
    var start, end;
    /*
    getDataset();
    
    var winClosed = setInterval(function () {
        if (geojson_url != "") {
            clearInterval(winClosed);
            funcA();
            console.log("get crime data");
        }        
    }, 250);         
    */
});

function getDataset() {
    var items = Object.keys(localStorage);

    var newLyrName = localStorage.getItem("New Layer Name");

    if ((newLyrName != "") && (newLyrName.toString().toUpperCase().indexOf("CRIME") != -1)) {
        $.each(items, function (key, value) {
            var oKey = key;
            var oValue = value;
        });

        var retrivedObj = localStorage.getItem(newLyrName);
        var storedObj = JSON.parse(retrivedObj);

        $('#download').text(newLyrName);
        //$('#download').text("Downloading crime data...");
        geojson_url = storedObj.geojsonurl;
        //return ture;
    }   
    else {
        //return false;
    }
}

function funcA() {
    $("#downdiv").css("display", "block");
    $("#download").text("Downloading crime data...");

    $.getJSON(geojson_url + whereClause, function (data) {
        if (!data || !data.features) {
            console.log("data is not downloaded");
            //$("#download").text("Data is not downloaded, please refresh page!");
        }
        else {

            downloadedData = data;
            console.log("geojson data downloaded");

            $('#downdiv').show();
            $("#downdiv").css("display", "block");
            var newLyrName = localStorage.getItem("New Layer Name");
            $('#download').text(newLyrName);
            $('#month').show();
            $('#slider').show();

            var slider = document.getElementById("slider");
            slider.value = 0;

            data.features = data.features.map(function (d) {
                var tmp = Date.parse(d.properties.REPORTDATETIME);
                d.properties.month = new Date(tmp).getMonth();
                return d;
            });

            var filteredData = {};
            var selectedData = [];

            $.each(data.features, function (i, d) {
                if (d.properties.month == 0) {
                    selectedData.push(d);
                }
            });

            filteredData.features = selectedData;
            filteredData.type = "FeatureCollection";
            addCluster(filteredData);                  
            curMonth = 0;
            filterBy(0);

            document.getElementById('slider').addEventListener('input', function (e) {
                var month = parseInt(e.target.value, 10);
                setMonth(month);
                filterBy(month);
                resetSource(month);
                addLegend(month);
            });

            map.on('mousemove', function (e) {
                var features = map.queryRenderedFeatures(e.point, { layers: layerIDs });                      
                map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
            });

            map.on('click', function (e) {
                var features = map.queryRenderedFeatures(e.point, { layers: layerIDs });
                popup.remove();

                if (!features.length) {
                    popup.remove();
                    return;
                }

                if ((features.length == 1) && (!features[0].properties.point_count)) {
                    var feature = features[0];

                    var cont = "Time: " + feature.properties.REPORTDATETIME + "<br>Crime: " + feature.properties.OFFENSE + "<br>Location: " + feature.properties.BLOCKSITEADDRESS;  
                    var coords = feature.geometry.coordinates;
                    var ll = new mapboxgl.LngLat(coords[0], coords[1]);
                    var wrapped = ll.wrap();

                    popup.setLngLat(wrapped)
                        .setHTML(cont)
                        .addTo(map);
                }
            });
        }
    });

    setTimeout(function () {
        start = +new Date();
        $.getJSON(geojson_url, function (wholedata) {
            if (wholedata) {
                console.log("whole geojson data downloaded");
                $("#downdiv").css("display", "block");
                $('#month').show();
                $('#slider').show();

                var slider = document.getElementById("slider");
                slider.value = 0;

                wholedata.features = wholedata.features.map(function (d) {
                    var tmp = Date.parse(d.properties.REPORTDATETIME);
                    d.properties.month = new Date(tmp).getMonth();
                    return d;
                });

                end = +new Date();
                var diff = end - start;
                console.log("downlaod whole data cost " + diff / 1000 + " secons");
                downloadedData = wholedata;
                reLoadLayer(0);
                addLegend(0);
                /*
                if (selectedObj != null) {
                    selectedYear = selectedObj.name.slice(-4);
                }
                $("#pieChart").css("display", "block");
                $("#barChart").css("display", "block");
                $("#lineChart").css("display", "block");
                $("#pieChart").empty();
                $("#barChart").empty();
                dsPieChart(downloadedData.features);
                dsBarChart_init(downloadedData.features);
                */
            }
        });
    }, 1000);

    map.on('zoom', function () {
        var zoom = map.getZoom();
        console.log("zoom = " + zoom);

        if (zoom > 14) {
            if (map.getLayer("non-cluster-markers")) {
                map.removeLayer("non-cluster-markers");
            }

            removeMarkers(markerCollection);
            addMarkers(downloadedData);

        }
        else {
            removeMarkers(markerCollection);
        }
    });
}

function resetSource(month) {
    if (month == curMonth) {
        return;
    }

    curMonth = month;
    var zoom = map.getZoom();
    console.log("in month of " + month + ", zoom = " + zoom);

    if (zoom > 14) {
        removeMarkers(markerCollection);
        addMarkers(downloadedData);
    }
    else {
        removeMarkers(markerCollection);

        if (map.getSource("crimes")) {
            map.removeSource("crimes");
        }

        if (map.getLayer("non-cluster-markers")) {
            map.removeLayer("non-cluster-markers");
        }

        var filteredData = {};
        var selectedData = [];

        $.each(downloadedData.features, function (i, d) {
            if (d.properties.month == month) {
                selectedData.push(d);
            }
        });

        filteredData.features = selectedData;

        filteredData.type = "FeatureCollection";
        addCluster(filteredData);
    }
}

function addMarkers(downloadedData) {
    var filteredData = {};
    var selectedData = [];

    $.each(downloadedData.features, function (i, d) {
        if (d.properties.month == curMonth) {
            selectedData.push(d);
        }
    });

    console.log("in addMarkers, curMontg = " + curMonth + ", downloaded data length = " + downloadedData.features.length + ", selectedData length = " + selectedData.length);

    selectedData.forEach(function (feature) {
        var offense = feature.properties.OFFENSE;             
        var marker = getOffenceMarker(offense);
        $(marker).attr('data-latlon', feature.geometry.coordinates);
        marker['data-properties'] = feature.properties;
        markerCollection.push(marker);               
        new mapboxgl.Marker(marker)
                .setLngLat(feature.geometry.coordinates)
                .addTo(map);
    });

    $('.marker').click(function (e) {
        e.stopPropagation();
        popup.remove();

        var cont = "Crime: " + this['data-properties'].OFFENSE + "<br>Time: " + this['data-properties'].REPORTDATETIME + "<br>Location: " + this['data-properties'].BLOCKSITEADDRESS;
        var latlon = $(this).attr('data-latlon').split(",");
        var latlon = $(this).attr('data-latlon').split(",");
        latlon = [Number(latlon[0]), Number(latlon[1])];

        popup.setLngLat((latlon))
            .setHTML(cont)
            .addTo(map);

    });
}

function removeMarkers(markerCollection) {
    if (markerCollection.length > 0) {
        markerCollection.forEach(function (marker) {
            marker.remove();
        });
    }
}

function getOffenceMarker(offense) {
    var iconUrl = getIconUrl(offense);
    var marker = document.createElement('div');
    marker.className = 'marker';

    marker.style.backgroundImage = iconUrl;
    marker.style.width = '12px';
    marker.style.height = '10px';

    return marker;
}

function getIconUrl(offense) {
    var iconUrl = '';
    switch (offense) {
        case "ARSON":
            iconUrl = ARSOnIcon;
            break;
        case "ASSAULT W/DANGEROUS WEAPON":
            iconUrl = ASSAULTIcon;
            break;
        case "BURGLARY":
            iconUrl = BURGLARYIcon;
            break;
        case "HOMICIDE":
            iconUrl = HOMICIDEIcon;
            break;
        case "MOTOR VEHICLE THEFT":
            iconUrl = MOTORIcon;
            break;
        case "ROBBERY":
            iconUrl = ROBBERYIcon;
            break;
        case "SEX ABUSE":
            iconUrl = SEXABUSEIcon;
            break;
        case "THEFT F/AUTO":
            iconUrl = THEFTAUTOIcon;
            break;
        case "THEFT/OTHER":
            iconUrl = THEFTOTHERIcon;
            break;
        default:
            iconUrl = '';
    }

    return iconUrl;
}

function addCluster(filteredData) {
    map.addSource('crimes', {
        'type': 'geojson',
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 100, 
        'data': filteredData
    });

    var layerID = "non-cluster-markers";
    layerIDs.push(layerID);

    map.addLayer({
        "id": layerID,
        "type": "circle",
        "source": "crimes",
        "paint": {
            "circle-color": "red",
            "circle-opacity": 0.75,
            "circle-radius": 5
        }
    });

    var lyrs = [
            [250, '#90d49a', 25],
            [100, '#f28cb1', 21],
            [20, '#f1f075', 18],
            [0, '#51bbd6', 15]
    ];

    lyrs.forEach(function (layer, i) {
        map.addLayer({
            "id": "cluster-" + i,
            "type": "circle",
            "source": "crimes",
            "paint": {
                "circle-color": layer[1],
                "circle-radius": layer[2]  
            },
            "filter": i == 0 ?
                    [">=", "point_count", layer[0]] :
                    ["all",
                        [">=", "point_count", layer[0]],
                        ["<", "point_count", lyrs[i - 1][0]]]
        });
    });
          
    map.addLayer({
        "id": "cluster-count",
        "type": "symbol",
        "source": "crimes",
        "layout": {
            "text-field": "{point_count}",
            "text-font": [
                        "DIN Offc Pro Medium",
                        "Arial Unicode MS Bold"
            ],
            "text-size": 12
        }
    });

}

      
function reLoadLayer(month) {
    if (map.getSource("crimes")) {
        map.removeSource("crimes");
    }

    if (map.getLayer("non-cluster-markers")) {
        map.removeLayer("non-cluster-markers");
    }

    var filteredData = {};
    var selectedData = [];

    $.each(downloadedData.features, function (i, d) {
        if (d.properties.month == month) {
            selectedData.push(d);
        }
    });

    filteredData.features = selectedData;

    filteredData.type = "FeatureCollection";

    addCluster(filteredData);

    console.log("layer reloaded");
}

function setMonth(month) {
    if (curMonth == month) {
        curMonth = month;
    }
    else {
        newMonth = month;
    }
}

function addLegend(month) {
    var stateLegendEl = document.getElementById('legendDiv');

    while (stateLegendEl.firstChild) {
        stateLegendEl.removeChild(stateLegendEl.firstChild);
    }

    var legend = document.createElement('div');
    legend.id = 'legend';


    var selectedData = [];
    $.each(downloadedData.features, function (i, d) {
        if (d.properties.month == month) {
            selectedData.push(d);
        }
    });

    var title = document.createElement('div');
    title.setAttribute("id", "titleDiv");
    var titleContent = "<p>Crimes in " + months[month] + " Total: " + selectedData.length + "</p>"
    titleContent = titleContent.fontsize(3);
    title.innerHTML = titleContent;
    legend.appendChild(title);

    for (var j = 0; j < offenseType.length; j++) {
        var legendItem = document.createElement('div');
        var selectedData = [];
        var subOffense = offenseType[j];

        $.each(downloadedData.features, function (i, d) {
            if ((d.properties.OFFENSE == subOffense) && (d.properties.month == month)) {
                selectedData.push(d);
            }
        });

        legendItem.innerHTML = ["<div class='img-sd' style='background-image:", getIconUrl(subOffense), "'></div>", offenseType[j], " ", selectedData.length].join("");
        legend.appendChild(legendItem);
    }

    stateLegendEl.appendChild(legend);
}

$(window).bind("load", function () {

});

