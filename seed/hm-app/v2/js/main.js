/* Your code starts here */

var app = app || {};

app.main = (function() {
    var inventory = [],
        filter_1, filter_2, filter_3, filter_4, output = [],
        keys = ["Any", "Design/Development", "IT", "Marketing", "Performance Environments", "Product Management", "Research", "Sales", "Any", "Product", "Product Family", "Product Category", "Customer", "Customer Segment", "Dealer", "Employee", "Region", "Any", "Real Time", "Daily", "Weekly", "Monthly", "Once", "Any", "People", "Product", "Place"];
    var load = function() {
        // app starts running here
        var path = 'data/inventory.csv';
        queue()
            .defer(d3.csv, path)
            .await(function(err, file) {
                inventory = file;
                init();
            });
    };

    var init = function() {
        console.log('finished loading data');
        // initialize initial selectors value
        hashListener();
        window.location.hash = '';
        window.location.hash = '/search';
        attachEvents();
    };

    var hashListener = function() {
        console.log('listening page');
        $(window).on('hashchange', function() {
            var page = window.location.hash;
            $('a').removeClass('selected');
            $('a[href="' + page + '"]').addClass('selected');
            // console.log(page);
            renderPage(page);
            attachEvents();
        });
    };

    var renderPage = function(page) { // --> #/blah
        $('#view').html('');
        if (page === '#/search') {
            filter_1 = 'Any';
            filter_2 = 'Any';
            filter_3 = 'Any';
            filter_4 = 'Any';
            var template = $('#tpl-filter').html();
            var compiled = _.template(template);
            $('#view').html(compiled);
            renderSearch();
        } else if (page === '#/vis_ppp') {
            renderD3('ppp.csv');
        } else if (page === '#/vis_linkage') {
            renderD3('linkage.csv');
        } else if (page === '#/vis_department') {
            renderD3('department.csv');
        }
    };

    var attachEvents = function() {
        // listen for selectors
        // Frequency Update
        $('#sel_freq_updated')
            .off('change')
            .on('change', function(e) {
                // console.log($(this).val());
                filter_1 = $(this).val();
            });
        // Used By
        $('#sel_used_by')
            .off('change')
            .on('change', function(e) {
                // console.log($(this).val());
                filter_2 = $(this).val();
            });
        // Linked to
        $('#sel_linked_to')
            .off('change')
            .on('change', function(e) {
                // console.log($(this).val());
                filter_3 = $(this).val();
            });
        // Relevant to (People, Product, Place)
        $('#sel_relevant_to')
            .off('change')
            .on('change', function() {
                filter_4 = $(this).val();
            });
        // GO
        $('#btn_submit')
            .off('click')
            .on('click', function() {
                renderSearch();
            });
    };

    var renderSearch = function() {
        console.log('empty output');
        output = [];
        console.log('filter#1: ' + filter_1);
        console.log('filter#2: ' + filter_2);
        console.log('filter#3: ' + filter_3);
        console.log('filter#4: ' + filter_4);

        var tmp1 = [],
            tmp2 = [],
            tmp3 = [],
            tmp4 = [];

        // Filtering
        _.each(inventory, function(item) {
            // Filter 1
            if (filter_1 !== 'Any' && item[$('#field_freq_updated').text()] === filter_1) {
                // console.log('yes');
                tmp1.push(item);
            } else if (filter_1 === 'Any') {
                tmp1.push(item);
            }
            // Filter 2
            if (filter_2 !== 'Any' &&
                (item['Used By Department 1'] === filter_2) ||
                item['Used By Department 2'] === filter_2 ||
                item['Used By Department 3'] === filter_2 ||
                item['Used By Department 4'] === filter_2) {
                tmp2.push(item);
            } else if (filter_2 === 'Any') {
                tmp2.push(item);
            }
            // Filter 3
            if (filter_3 !== 'Any' &&
                (item['Linkable Data 1'] === filter_3) ||
                item['Linkable Data 2'] === filter_3 ||
                item['Linkable Data 3'] === filter_3) {
                tmp3.push(item);
            } else if (filter_3 === 'Any') {
                tmp3.push(item);
            }
            // Filter 4 (Relevant to)
            if (filter_4 !== 'Any' && item[filter_4] === '1') {
                tmp4.push(item);
            } else if (filter_4 === 'Any') {
                tmp4.push(item);
            }
        });
        output = _.intersection(tmp1, tmp2, tmp3, tmp4);
        // console.log(output);
        // print number of data returned
        $('#number_of_resources').html(output.length + ' Data Resources found');
        // console.log(output);
        // console.log(output);
        // render
        var template = $('#tpl-result').html();
        var compiled = _.template(template, {
            array: output
        });

        $('#result_container').html(compiled);

        $('.tb_result').fadeIn();
    };

    // D3
    var renderD3 = function(csv) {
        var width = window.innerWidth,
            height = window.innerHeight;

        var svg = d3.select('#view').append("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .size([width, height])
            .charge(-80)
            .linkDistance(70);

        d3.csv('../data/vis/' + csv, function(links) {
            var nodesByName = {};

            // Create nodes for each unique source and target.
            links.forEach(function(link) {
                link.source = nodeByName(link.source);
                link.target = nodeByName(link.target);
            });

            // Extract the array of nodes from the map by name.
            var nodes = d3.values(nodesByName);

            // Create the link lines.
            var link = svg.selectAll(".link")
                .data(links)
                .enter().append("line")
                .attr("class", "link");

            // tooltip
            var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
                return d.name;
            });

            // Create the node circles.
            var node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("circle")
                .attr({
                    class: function(d) {
                        return 'node';
                    }
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .call(force.drag)
                .call(tip);

            // Start the force layout.
            force
                .nodes(nodes)
                .links(links)
                .on("tick", tick)
                .start();

            function tick() {
                link.attr("x1", function(d) {
                    return d.source.x;
                })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });

                node.attr("cx", function(d) {
                    return d.x;
                })
                    .attr("cy", function(d) {
                        return d.y;
                    })
                    .attr('r', function(d) {
                        if (d.weight >= 4) {
                            return Math.max(d.weight / 20, 5);
                        } else {
                            return 4;
                        }
                    })
                    .attr('fill', function(d) {
                        if (d.weight >= 4) {
                            // return color
                            return 'hsl(1,75%,50%)';
                        } else {
                            return '#000';
                        }
                    });
            }

            function nodeByName(name) {
                return nodesByName[name] || (nodesByName[name] = {
                    name: name
                });
            }
        });
    };

    return {
        init: init,
        load: load
    };
})();

app.main.load();