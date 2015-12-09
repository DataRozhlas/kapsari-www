var map;

var breaks = [0.283044, 0.397056, 0.555200, 0.985058, 254.421067]

var style = function () {
  var style = {}
  style.version = 8;
  style.sources = {}
  style.sources.kapsari = {
      "type": "vector",
      "tiles": [location.origin+location.pathname+"./tiles/{z}/{x}/{y}.pbf"],
      "maxzoom": 13
      
    };
    style.layers = [
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
        "fill-color": "#2c7bb6",
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
        "fill-color": "#abd9e9",
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
        "fill-color": "#ffffbf",
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
        "fill-color": "#fdae61",
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
        "fill-color": "#d7191c",
        "fill-outline-color": "#d9d9d9",
        "fill-opacity": 0.8
    }
    }];
    return style;
};


var drawChart = function(months) {
		$("#chart").empty()
		var dates = []
		months = JSON.parse(months.replace(/'/g, '"'))

		for(var year=2013; year <= 2015; year++) {
			for (var month=1; month <= 12; month++) {
				dates.push(month + '-' + year)
			}
		}
		var data = dates.map(function(date ,i) {
			return {'x': i, 'y': months[date], 'label': date}
		}).filter(function(obj) {
			return obj.y !== undefined
		});
		//chart

            var w = 400;
            var h = 150;

            var yscale = d3.scale.linear()
                            .domain([0, 154])
                            .range([5, h])

            var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
            
            svg.selectAll("rect")
               .data(data)
               .enter()
               .append("rect")
               .attr("x", function(d) {
                return d.x * 16;
               })
               .attr("y", function(d) {
                return h - yscale(d.y)
               })
               .attr("width", 14)
               .attr("height", function(d) {
                return yscale(Math.max(0, d.y));
               })
               .attr("fill", "#66c2a5")


            
		//chart end

    };

var drawMap = function() {
	$("#map").empty()
	$("#chart").empty()
	map = new mapboxgl.Map({
	  container: 'map',
	  center: [14.46562, 50.05981],
	  zoom: 7,
	  style: style()
	});

	map.dragRotate.disable();
	//map.addControl(new mapboxgl.Navigation());

	map.on('mousemove', function(e) {
	    map.featuresAt(e.point, {}, function(err, features) {
	        if (err) throw err;
	        $(".info").empty()
	        $("#chart").empty()
	        drawChart(features[0].properties['data'])
	        $(".info").append(features[0].properties['OOP_NAZEV'] + "<br>" + "Policie zde eviduje průměrně " + Math.round(features[0].properties['rate'] * 10) + " kapesních krádeží na 100 tis. obyvatel")
	    });
	});
};

drawMap();