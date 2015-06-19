var s = {};
var data = [];
var init = function() {
    /* Your code starts here */
    console.log('see?');
    updateScreen();
    DB.main.query();
    var c = {
        svgEl: null,
        planeArray: []
    };
    c.init = function() {
        // append svg
        c.svgEl = d3.select('body').append('svg').attr({
            width: '100%',
            height: '600'
        });

        var numPlane = 20;

        for (var i = 0; i < numPlane; i++) {
            c.planeArray[i] = Plane.create();
        }

        for (var j = 0; j < numPlane; j++) {
            Plane.fly(j, randNum(5000) + 8000);
        }

        setTimeout(function() {
            delete c;
            $('svg').remove();
        }, 10000);
    };

    var Plane = {};
    // create path for plane
    Plane.create = function() {
        // three trinagle plane
        function generateForm() {
            var t1, t2, t3;
            var Sx = 0,
                Sy = 0,
                scale = randNum(2) + 0.5,
                cockpit = {
                    x: 56,
                    y: 5
                };
            t1 = 'M' + Sx + ' ' + Sy + 'L' + (Sx + cockpit.x) * scale + ' ' + (Sy + cockpit.y) * scale + 'L' + Sx + '  ' + (Sy + 24) * scale;
            t2 = 'M' + Sx + ' ' + Sy + 'L' + (Sx + cockpit.x) * scale + ' ' + (Sy + cockpit.y) * scale + 'L' + (Sx + 12) * scale + '  ' + (Sy + 24) * scale;
            t3 = 'M' + Sx + ' ' + Sy + 'L' + (Sx + cockpit.x) * scale + ' ' + (Sy + cockpit.y) * scale + 'L' + (Sx - 12) * scale + '  ' + (Sy + 12) * scale;
            return {
                t1: t1,
                t2: t2,
                t3: t3
            };
        }
        var t = generateForm();
        var tc = randomColor();
        var group = c.svgEl.append('g');
        // append behind wing
        group.append('path')
            .attr({
                d: t.t3
            })
            .style({
                fill: tc.c1
            });
        // a
        // append torso
        group.append('path')
            .attr({
                d: t.t1
            })
            .style({
                fill: tc.c2
            });
        // append above wing
        group.append('path')
            .attr({
                d: t.t2
            })
            .style({
                fill: tc.c3
            });
        // return
        return group;
    };

    Plane.fly = function(num, duration) {
        var myPath = c.svgEl.append("path")
            .data([generatePath()])
            .attr("d", d3.svg.line()
                .tension(0) // Catmull–Rom
                .interpolate("basis"));

        c.planeArray[num]
            .transition()
            .duration(duration)
            .attrTween("transform", translateAlong(c.planeArray[num].node().getBBox(), myPath.node()));
    };

    // c.init();
};

var updateScreen = function() {
    s.width = window.innerWidth;
    s.height = window.innerHeight;
};

var renderProjects = function() {
    // console.log(d.projects);
    var tpl = $('#tpl-project').html();
    data.forEach(function(item, index) {
        if (item.attributes.show) {
            var compiled = _.template(tpl, {
                project: item.attributes,
                index: index
            });
            $('#projects .container').append(compiled);
        }
    });
    //
    attachEvents();
};

var attachEvents = function() {
    $('.project').off('click').on('click', function() {
        var index = $(this).attr('data-index');
        var tpl = $('#tpl-project-detail').html();
        var compiled = _.template(tpl, {
            project: data[index].attributes
        });
        $('html,body').animate({
            scrollTop: $("#main-projects").offset().top
        });
        $('#projects .container').html(compiled);
        attachEvents();
    });

    $('.project-detail-close').off('click').on('click', function() {
        $('.project-detail-body').remove();
        renderProjects();
        $('html,body').animate({
            scrollTop: $("#main-projects").offset().top
        });
    });
};

// listener
$(window).on('resize', updateScreen);
$(window).on('qSuccess', renderProjects);
$(document).ready(init);

// smooth scroll
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 500);
                return false;
            }
        }
    });
});

// helpers
// helper
function generatePath() {
    var pathArray = [];
    for (var i = 0; i < 5; i++) {
        pathArray.push([i * 500, randNum(400)]);
    }
    return pathArray;
}

function translateAlong(el, path) {
    var l = path.getTotalLength();
    var t0 = 0;
    return function(i) {
        return function(t) {
            var p0 = path.getPointAtLength(t0 * l); //previous point
            var p = path.getPointAtLength(t * l); ////current point
            var angle = Math.atan2(p.y - p0.y, p.x - p0.x) * 180 / Math.PI; //angle for tangent
            t0 = t;
            //Shifting center to center of rocket
            var centerX = p.x - el.width,
                centerY = p.y - el.height;
            return "translate(" + centerX + "," + centerY + ")rotate(" + angle + " " + el.width + " " + el.height + ")";
        };
    };
}


function randNum(num) {
    return Math.floor(Math.random() * num) + 1;
}

function randomColor() {
    var c1, c2, c3;
    var rand = Math.floor(Math.random() * 120) + 120;
    c1 = 'hsl(' + rand + ',75%,30%)';
    c2 = 'hsl(' + rand + ',75%,55%)';
    c3 = 'hsl(' + rand + ',75%,80%)';
    return {
        c1: c1,
        c2: c2,
        c3: c3
    };
}