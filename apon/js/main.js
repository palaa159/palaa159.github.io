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
        var that = $(this);
        // console.log('click');
        $('body').append($('<div id="limbo-bg">'));
        $('#limbo-bg').animate({
            opacity: 0.8
        }, function() {
            // console.log(data[that.attr('data-index')]);
            var tpl = $('#tpl-project-detail').html();
            var compiled = _.template(tpl, {
                project: data[that.attr('data-index')].attributes
            });
            $('body').append(compiled);
            $('.project-detail').animate({
                height: s.height - 200
            });
            attachEvents();
        });
    });
    $('.project-detail-close').off('click').on('click', function() {
        $('.project-detail').animate({
            height: 0
        }, function() {
            $('#limbo-bg').animate({
                opacity: 0
            }, function() {
                setTimeout(function() {
                    $('#limbo-bg').remove();
                    $('.project-detail-body').remove();
                }, 0);
            });
        });
    });
};

// listener
$(window).on('resize', updateScreen);
$(window).on('qSuccess', renderProjects);
$(document).ready(init);