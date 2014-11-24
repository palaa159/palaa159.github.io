var s = {};
var data = [];
var init = function() {
    /* Your code starts here */
    console.log('see?');
    updateScreen();
    DB.main.query();
};

var updateScreen = function() {
    s.width = window.innerWidth;
    s.height = window.innerHeight;
};

var renderProjects = function(d) {
    // console.log(d.projects);
    data = d.projects;
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

    });
};

// listener
$(window).on('resize', updateScreen);
$(window).on('qSuccess', renderProjects);
$(document).ready(init);