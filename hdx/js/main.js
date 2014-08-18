//
var countries, topo, hdx, currentYear;
var key_year = [],
	d_min, d_max, tooltip = d3.select('#tooltip').attr({
		class: 'hidden'
	});

var width = window.innerWidth,
	height = window.innerHeight;

// create world projection
var projection = d3.geo.mercator()
	// how you scale a map!
	.scale((width + 1) / 2 / Math.PI)
	.translate([width / 2, height / 2])
	.precision(0.1);

// create path
var path = d3.geo.path()
	.projection(projection);

// graticule (optional)
var graticule = d3.geo.graticule();

// load queue
queue()
	.defer(d3.json, 'data/world-centroid.json')
	.defer(d3.csv, 'data/PVH140_Baseline.csv')
	.awaitAll(function(error, results) {
		// console.log(results);
		topo = results[0];
		countries = results[0].objects.countries.geometries;
		hdx = results[1];
		console.info('start combining');

		for (var i = 0; i < hdx.length; i++) {
			var h_name = hdx[i]['Country name'].toLowerCase();
			for (var j = 0; j < countries.length; j++) {
				var c_name = countries[j].properties.name.toLowerCase();
				if (h_name === c_name) {
					hdx[i].center = countries[j].properties.center;
				}
			}
			// if center not found, delete the index
		}
		for (var k = 0; k < hdx.length; k++) {
			if (typeof hdx[k].center === 'undefined') {
				hdx.splice(k, 1);
			}
		}
		for (var l = 0; l < hdx.length; l++) {
			if (typeof hdx[l].center[0] === 'object') {
				hdx.splice(l, 1);
			}
		}
		console.info('all done');
		init();
	});


var init = function() {
	// create svg canvas
	var svg = d3.select('#container')
		.append('svg')
		.attr({
			id: 'mapContainer',
			width: width,
			height: height
		})
		.append('g');

	var g = svg.append('g');
	var t = svg.append('g').attr('id', 'timeline');

	var drawMap = function(topo) {
		console.log('D3', 'Drawing the map');
		svg.append('path')
			.datum(graticule)
			.attr({
				class: 'graticule',
				d: path
			});
		var country = g.selectAll('.country').data(topo);
		country
			.enter()
			.insert('path')
			.attr({
				fill: '#ffffcc',
				title: function(d, i) {
					return d.properties.name;
				},
				class: 'country',
				d: path,
				id: function(d, i) {
					return d.di;
				}
			});
	};

	var drawNode = function(year) {
		// remove
		d3.selectAll('.node').remove();
		// console.log(radius);
		console.log('D3', 'Drawing Country Node');
		// console.log(currentYear, year);
		var node = g.selectAll('.node').data(hdx);
		node
			.enter()
			.insert('circle')
			.attr({
				cx: function(d, i) {
					// console.log('yes');
					return projection([d.center[1], d.center[0]])[0];
					// return projection([d.center[1], d.center[0]])[0];
				},
				cy: function(d, i) {
					// console.log('yes');
					return projection([d.center[1], d.center[0]])[1];
				},
				r: function(d, i) {
					return map_range(d[currentYear], 10, 500, 5, 100);
					// return (d[currentYear]);
				},
				name: function(d, i) {
					return d['Country name'];
				},
				class: 'node'
			})
			.on('mouseover', function() {
				var mouse = d3.mouse(svg.node()).map(function(d) {
					return parseInt(d);
				});
				tooltip.classed('hidden', false)
					.attr('style', 'left:' + (mouse[0] + 10) + 'px; top:' + (mouse[1] + 30) + 'px')
					.html(d3.select(this).attr('name').toLowerCase().capitalize() + ', ' + d3.select(this).attr('rate'));
			})
			.on('mouseout', function() {
				tooltip.classed('hidden', true);
			})
			.transition()
			.duration(1000)
			.attr({
				r: function(d, i) {
					return map_range(d[year], 10, 500, 5, 100);
				},
				rate: function(d, i) {
					return d[year];
				}
			});

		currentYear = year;
	};

	var drawHeat = function(year) {
		var allCountries = d3.selectAll('.country');
		hdx.forEach(function(v) {
			allCountries[0].forEach(function(c) {
				if (v['Country name'].toLowerCase() === d3.select(c).attr('title').toLowerCase()) {
					// console.log('match');
					d3.select(c).attr({
						// fill: d3.hsl(80, 0.75, 0.5)
						rate: v[year],
						fill: function() {
							var x = v[currentYear];
							x = map_range(x, 0, 300, 80, 0);
							return d3.hsl(x, 0.9, 0.50);
						}
					})
						.on('mouseover', function() {
							var mouse = d3.mouse(svg.node()).map(function(d) {
								return parseInt(d);
							});
							tooltip.classed('hidden', false)
								.attr('style', 'left:' + (mouse[0] + 10) + 'px; top:' + (mouse[1] + 30) + 'px')
								.html(d3.select(this).attr('title').toLowerCase().capitalize() + ', ' + d3.select(this).attr('rate'));
						})
						.on('mouseout', function() {
							tooltip.classed('hidden', true);
						})
						.transition()
						.duration(1000)
						.attr({
							fill: function() {
								var x = v[year];
								x = map_range(x, 0, 300, 80, 0);
								return d3.hsl(x, 0.9, 0.50);
							}
						});
				}
			});
		});
	currentYear = year;
	};

	var extractYear = function() {
		for (var k in hdx[0]) {
			if (parseInt(k))
			// console.log(parseInt(k));
				key_year.push(k.toString());
		}
		currentYear = key_year[0];
	};

	var drawTimeline = function() {
		// get example
		var t_width = 900;
		t.append('line')
			.attr({
				class: 't_line',
				x1: 5,
				y1: -20,
				x2: t_width - 5,
				y2: -20
			});
		key_year.forEach(function(v, i) {
			t.append('circle')
				.attr({
					class: 'yearDot',
					cx: 40 * i + 10,
					cy: -20,
					r: 5,
					year: v
				})
				.on('click', function() {
					d3.selectAll('.yearDot').attr('class', 'yearDot');
					d3.select(this).attr('class', 'yearDot selected');
					// redraw node
					// console.log(currentYear, d3.select(this).attr('year'));
					redraw(d3.select(this).attr('year'));
					// drawHeat(d3.select(this).attr('year'));
					// drawNode(d3.select(this).attr('year'));
				});

			t.append('text')
				.attr({
					class: 'year',
					x: 40 * i,
					y: 0
				})
				.text(v);
		});
		t.attr('width', t_width);
		t.attr('transform', 'translate(' + (width - t_width - 50) + ', ' + (height - 30) + ')');
	};

	var modeEl = document.getElementById('vizMode');

	var redraw = function(year) {
		// remove old el
		// remove
		d3.selectAll('.node').remove();

		var allCountries = d3.selectAll('.country');
		// return heat to default color and unbind event
		allCountries[0].forEach(function(c) {
			d3.select(c).attr({
				fill: '#ffffcc'
			}).on('mouseover', function() {
				// nothing happens
			});
		});
		var mode = modeEl.value;
		// console.log(mode);
		if(mode === 'node') {
			drawNode(year);
		} else if(mode === 'heat') {
			drawHeat(year);
		}
	};

	// listener for select option
	modeEl.addEventListener('change', function() {
		console.log(modeEl.value);
		redraw(currentYear);
	});

	topo = topojson.feature(topo, topo.objects.countries).features;
	// draw country
	drawMap(topo);
	// extract years
	extractYear();
	// draw timeline
	drawTimeline();
	// init first year in the list
	d3.select('.yearDot').attr('class', 'yearDot selected');
	// drawNode(currentYear);
	redraw(currentYear);
};

// helper
function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}