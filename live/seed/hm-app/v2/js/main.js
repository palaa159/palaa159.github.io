/* Your code starts here */

var app = app || {};

app.main = (function() {
    // d3
    var force;
    var inventory = [],
        filter_1, filter_2, filter_3, filter_4, output = [],
        key_ppp = ['Category – People',
            'Category – Product',
            'Category – Place'
        ],
        key_linkage = ['Link – Product',
            'Link – Product Family',
            'Link – Product Category',
            'Link – Customer',
            'Link – Customer Segment',
            'Link – Dealer',
            'Link – Employee',
            'Link – Region',
            'Link – Category',
            'Link – MSA',
            'Link – Time',
            'Link – Product Line',
            'Link – Product Type',
            'Link – Sales Representative'
        ],
        key_dep = ['Department – Design/Development',
            'Department – IT',
            'Department – Sales',
            'Department – Marketing',
            'Department – Performance Environments',
            'Department – Product Management',
            'Department – Research'
        ];
    var conditionArray = ['1', '2', '3'];
    // stats
    var stat = 0;
    var cCat = '#baff12',
        cLink = '#feb612',
        cDep = '#14a2fa';
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
        var template, compiled;
        $('#view').html('');
        $('svg').remove();
        if (force) {
            force.stop();
        }
        $('.d3-tip').remove();
        if (page === '#/search') {
            filter_1 = 'Any';
            filter_2 = 'Any';
            filter_3 = 'Any';
            filter_4 = 'Any';
            template = $('#tpl-filter').html();
            compiled = _.template(template);
            $('#view').html(compiled);
            renderSearch();
        } else if (page === '#/vis_all') {
            template = $('#tpl-network').html();
            compiled = _.template(template);
            $('#view').html(compiled);
            renderNetworkD3('networkgraph.csv', conditionArray);
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
        $(window).off('resize');
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
        $('#number_of_resources').html(output.length + ' of ' + inventory.length + ' Data Resources found');
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
    var renderNetworkD3 = function(csv, condition) {
        $('svg').remove();
        var width = window.innerWidth,
            height = window.innerHeight;

        var svg = d3.select('#view').append("svg")
            .attr("width", width)
            .attr("height", height);
        if (force) {
            force.stop();
        }
        force = d3.layout.force()
            .size([width, height])
            .charge(-300)
            .linkDistance(80);

        d3.csv('data/vis/' + csv, function(links) {
            var nodesByName = {};

            // Create nodes for each unique source and target.
            stats = 0;
            console.log(conditionArray);
            links.forEach(function(link) {
                conditionArray.forEach(function(query) {
                    // 1, 2, 3
                    if (link.target_type === query) {
                        link.source = nodeByName(link.source);
                        link.target = nodeByName(link.target);
                        // add to
                        stats += 1;
                    }
                });
            });

            // Extract the array of nodes from the map by name.
            var nodes = d3.values(nodesByName);
            // print stats
            $('.graphStats').html(nodes.length + ' Nodes Displayed' + '<br>' + stats + ' Edges Displayed');

            // Create the link lines.
            var link = svg.selectAll(".link")
                .data(links)
                .enter()
                .append("line")
                .attr({
                    'data-source': function(d) {
                        // console.log(d);
                        return d.source.name;
                    },
                    'data-target': function(d) {
                        return d.target.name;
                    },
                    stroke: function(d) {
                        // if ppp
                        if (d.target_type === '1') {
                            d3.select(this).attr({
                                class: 'graph-data link i_cat'
                            });
                            return cCat;
                        } else if (d.target_type === '2') {
                            d3.select(this).attr({
                                class: 'graph-data link i_dep'
                            });
                            return cDep;
                        } else if (d.target_type === '3') {
                            d3.select(this).attr({
                                class: 'graph-data link i_link'
                            });
                            return cLink;
                        } else {
                            return '#000';
                        }
                    }
                });

            // tooltip
            $('.d3-tip').remove();
            var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
                // console.log(d);
                return d.data_tooltip;
            });

            // create text
            var text = svg.selectAll('g')
                .data(nodes)
                .enter().append('text')
                .text(function(d) {
                    // console.log(d);
                    if (_.contains(key_linkage, d.name)) {
                        d3.select(this).attr({
                            class: 'graph-data text'
                        });
                        return d.name;
                    } else if (_.contains(key_ppp, d.name)) {
                        d3.select(this).attr({
                            class: 'graph-data text'
                        });
                        return d.name;
                    } else if (_.contains(key_dep, d.name)) {
                        d3.select(this).attr({
                            class: 'graph-data text'
                        });
                        return d.name;
                    }
                });

            // Create the node circles.
            var node = svg.selectAll("g")
                .data(nodes)
                .enter().append("circle")
                .attr({
                    'data-name': function(d) {
                        return d.name.replace(/\u00a0/g, ' ');
                    },
                    r: function(d) {
                        d.data_tooltip = createToolTipText(d.name);
                        // if ppp
                        if (_.contains(key_ppp, d.name)) {
                            // console.log('ppp');
                            d3.select(this).attr({
                                class: 'graph-data node'
                            });
                            return 10;
                            // if linkage
                        } else if (_.contains(key_linkage, d.name)) {
                            d3.select(this).attr({
                                class: 'graph-data node'
                            });
                            return 10;
                            // if dep
                        } else if (_.contains(key_dep, d.name)) {
                            d3.select(this).attr({
                                class: 'graph-data node'
                            });
                            return 10;
                        } else {
                            d3.select(this).attr({
                                class: 'graph-data node i_genpop'
                            });
                            return 3;
                        }
                    },
                    fill: function(d) {
                        // if ppp
                        if (_.contains(key_ppp, d.name)) {
                            // console.log('ppp');
                            return cCat;
                            // if linkage
                        } else if (_.contains(key_dep, d.name)) {
                            // console.log('linkage');
                            return cDep;
                            // if dep
                        } else if (_.contains(key_linkage, d.name)) {
                            return cLink;
                        } else {
                            return '#c4c4c4';
                        }
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
            // .off('tick', null)
            .on("tick", tick)
                .friction(0.6)
            // .theta(0.00008)
            // .alpha(0.1)
            .start();

            // setTimeout(function() {
            //     force.stop();
            // }, 5000);

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
                    });
                text.attr({
                    dx: function(d) {
                        return d.x + 8;
                    },
                    dy: function(d) {
                        return d.y - 10;
                    }
                });
            }

            function nodeByName(name) {
                return nodesByName[name.replace(/\u00a0/g, ' ')] || (nodesByName[name.replace(/\u00a0/g, ' ')] = {
                    name: name.replace(/\u00a0/g, ' ')
                });
            }
            checkNetworkGraphInput();
        });
        // listener for network graph options
        $('.networkGraphOptionInput').off('change').on('change', function() {
            // check if checked
            checkNetworkGraphInput();
            renderNetworkD3('networkgraph.csv', conditionArray);
        });

        var checkNetworkGraphInput = function() {
            conditionArray = [];
            $.each($('.networkGraphOptionInput:checked'), function(i, item) {
                conditionArray.push($(item).val());
            });
        };

        // resize listener
        var lazyLayout = _.debounce(rebuildSVG, 150);
        $(window).off('resize').on('resize', lazyLayout);
    };

    var rebuildSVG = function() {
        renderNetworkD3('networkgraph.csv', conditionArray);
    };

    var createToolTipText = function(name) {
        var i = customIndexOf(inventory, name);
        // console.log(i);
        if (inventory[i]) {
            // console.log(inventory[i]['Name']);
            // console.log(inventory[i]['Used By Department 1']);
            // console.log(inventory[i]['Used By Department 2']);
            // console.log(inventory[i]['Used By Department 3']);
            // console.log(inventory[i]['Used By Department 4']);
            // console.log(inventory[i]['Frequency Updated']);
            // console.log(inventory[i]['Frequency Used']);
            return '<span style="font-size: 1.25em; line-height: 1.25em; margin-bottom: 9px">' + inventory[i]['Name'] + '</span>' +
                '<br><span style="line-height: 1.35em;">Owned by: ' + (inventory[i]['Used By Department 1'] !== '' ? inventory[i]['Used By Department 1'] : '') +
                (inventory[i]['Used By Department 2'] !== '' ? ', ' + inventory[i]['Used By Department 2'] : '') +
                (inventory[i]['Used By Department 3'] !== '' ? ', ' + inventory[i]['Used By Department 3'] : '') +
                (inventory[i]['Used By Department 4'] !== '' ? ', ' + inventory[i]['Used By Department 4'] : '') +
                '<br>Frequency Updated: ' +
                inventory[i]['Frequency Updated'] +
                '<br>Frequency Used: ' +
                inventory[i]['Frequency Used'] + '</span>';
        } else {
            return name;
        }

    };

    return {
        init: init,
        load: load
    };
})();

app.main.load();

// helpers
function customIndexOf(array, id) {
    var result = -1;

    _.some(array, function(element, index) {
        if (id.toLowerCase().replace(/\s+/g, '') === element.Name.toLowerCase().replace(/\s+/g, '')) {
            result = index;
            // result[1] = element;
            return true;
        }
        return false;
    });

    return result;
}