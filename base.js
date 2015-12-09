var dates, map;

var breaks = [0.283044, 0.397056, 0.555200, 0.985058, 254.421067]

var sklonovani = function(num) {
	if (num == 1) {
		return num + " kapesní krádež";
	} else if ((num >= 1) & (num <= 4)) {
		return num + " kapesní krádeže"
	} else {
		return num + " kapesních krádeží"
	}
}

var style = function () {
  var style = {}
  style.version = 8;
  style.sources = {}
  style.sources.kapsari = {
      "type": "vector",
      "tiles": [location.origin+location.pathname+"./tiles/{z}/{x}/{y}.pbf"],
      "maxzoom": 13
      
    };
   style.sources.back = {
   		"type": "raster",
      "tiles": ["https://samizdat.cz/tiles/ton_b1/{z}/{x}/{y}.png"],
      "tileSize": 256
   };
   style.sources.mistopis = {
   		"type": "raster",
      "tiles": ["https://samizdat.cz/tiles/ton_l1/{z}/{x}/{y}.png"],
      "tileSize": 256
   };
    style.layers = [
    {
    	"id": "back",
      "interactive": true,
      "type": "raster",
      "source": "back"
     },
    {
      "id": "hon1",
      "interactive": true,
      "type": "fill",
      "source": "kapsari",
      "source-layer": "oop_kapsari",
      "filter": [
        "all",
        [">=", "rate", 0],
        ["<", "rate", breaks[0]]
        ],
      "paint": {
        "fill-color": "#fee5d9",
        "fill-outline-color": "#d9d9d9",
        "fill-opacity": 0.8
    }
    },
    {
      "id": "hon2",
      "type": "fill",
      "interactive": true,
      "source": "kapsari",
      "source-layer": "oop_kapsari",
      "filter": [
        "all",
        [">=", "rate", breaks[0]],
        ["<", "rate", breaks[1]]
        ],
      "paint": {
        "fill-color": "#fcae91",
        "fill-outline-color": "#d9d9d9",
        "fill-opacity": 0.8
    }
    },
    {
      "id": "hon3",
      "type": "fill",
      "interactive": true,
      "source": "kapsari",
      "source-layer": "oop_kapsari",
      "filter": [
        "all",
        [">=", "rate", breaks[1]],
        ["<", "rate", breaks[2]]
        ],
      "paint": {
        "fill-color": "#fb6a4a",
        "fill-outline-color": "#d9d9d9",
        "fill-opacity": 0.8
    }
    },
    {
      "id": "hon4",
      "type": "fill",
      "interactive": true,
      "source": "kapsari",
      "source-layer": "oop_kapsari",
      "filter": [
        "all",
        [">=", "rate", breaks[2]],
        ["<", "rate", breaks[3]]
        ],
      "paint": {
        "fill-color": "#de2d26",
        "fill-outline-color": "#d9d9d9",
        "fill-opacity": 0.8
    }
    },{
      "id": "hon5",
      "type": "fill",
      "interactive": true,
      "source": "kapsari",
      "source-layer": "oop_kapsari",
      "filter": [">=", "rate", breaks[3]],
      "paint": {
        "fill-color": "#a50f15",
        "fill-outline-color": "#d9d9d9",
        "fill-opacity": 0.8
    }},
    {
    	"id": "mistopis",
      "interactive": true,
      "type": "raster",
      "source": "mistopis"
     }
    ];
    return style;
};


var drawChart = function(months) {
		$("#chart").empty()
		dates = []
		months = JSON.parse(months.replace(/'/g, '"'))

		for(var year=2013; year <= 2015; year++) {
			for (var month=1; month <= 12; month++) {
				dates.push(month + '-' + year)
			}
		}
		var data = dates.slice(0, 33).map(function(date ,i) {
			return {'x': i, 'y': (months[date] || 0), 'label': date}
		});

		//chart
            var w = 950;
            var h = 150;

            var yscale = d3.scale.linear()
                            .domain([0, 154])
                            .range([1, h])

            var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h + 25);
            
            svg.selectAll("rect")
               .data(data)
               .enter()
               .append("rect")
               .attr("x", function(d) {
                	return d.x * 27;
               })
               .attr("y", function(d) {
                	return h - yscale(d.y)
               })
               .attr("width", 25)
               .attr("height", function(d) {
                	return yscale(Math.max(0, d.y));
               })
               .attr("fill", "#4292c6")

            svg.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return Math.max(0, d.y);
                })
                .attr("x", function(d, i) {
                    return (d.x * 27) + 2;
                })
                .attr("y", function(d) {
                    if (d != 0) {
                        return h - yscale(d.y) - 3;
                    } else {
                        return h - yscale(d.y) + 2
                    }
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "black")

            svg.selectAll("text.datum")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.label.split('-')[0] + '. ' + d.label.substr(d.label.length - 2);
                })
                .attr("x", function(d, i) {
                    return (d.x * 27) + 3;
                })
                .attr("y", h + 15)
                .attr("font-family", "sans-serif")
                .attr("font-size", "8px")
                .attr("fill", "black")
    };

var drawMap = function() {
	$("#map").empty()
	$("#chart").empty()
	map = new mapboxgl.Map({
	  container: 'map',
	  center: [14.46562, 50.05981],
	  zoom: 6,
	  style: style()
	});

	map.addControl(new mapboxgl.Navigation());
	map.dragRotate.disable();


	map.on('mousemove', function(e) {
	    map.featuresAt(e.point, {}, function(err, features) {
	        if (err) throw err;
	        average = 0;
	        $(".info").empty()
	        $("#chart").empty()
	        drawChart(features[0].properties['data'])
	        $(".info").append("Služebna <b>" + features[0].properties['OOP_NAZEV'] + "</b><br>" + "Průměrně <b>" + sklonovani(Math.round(features[0].properties['rate'] * 10)) + "</b> měsíčně na 100 tis. obyvatel.")
	    });
	});
};

var form = document.getElementById("frm-geocode");
		var geocoder = null;
		var geocodeMarker = null;
		form.onsubmit = function(event) {
			if (!geocoder) {
				geocoder = new google.maps.Geocoder();
			}
			event.preventDefault();
			var text = document.getElementById("inp-geocode").value;

			geocoder.geocode({'address':text}, function(results, status) {
				if(status !== google.maps.GeocoderStatus.OK) {
					alert("Bohužel, danou adresu nebylo možné najít");
					return;
				}
				var result = results[0];
				var latlng = new L.LatLng(result.geometry.location.lat(), result.geometry.location.lng());
				map.flyTo({center: latlng, zoom: 12});
			});
		};

drawMap();

