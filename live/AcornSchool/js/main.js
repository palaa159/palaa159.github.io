var init = function() {
    /* Your code starts here */
    console.log('see?');
    // Activate carousel
    $('.my-carousel').slick({
        autoplay: true
    });
    // check parallax
    // know how detect scroll
    var lastScrollTop = 0;
    var img_pos = -300;
    $(window).scroll(function(event) {
        var st = $(this).scrollTop();
        var wH = window.innerHeight;
        // console.log(st);
        var imgParallaxTop = $('#img-parallax').position().top - st;

        // if imgParallaxTop is less than window height, meaning it is appearing
        // in the view

        if (st > lastScrollTop) {
            // downscroll code
            console.log('scroll down');
            if (imgParallaxTop <= wH) {
                img_pos -= 1;
                console.log('in');
                // move background image
                $('#img-parallax').css({
                    'background-position': '0px ' + img_pos + 'px'
                });
            } else {
                console.log('out');
            }
        } else {
            // upscroll code
            console.log('scroll up');
            img_pos += 1;
                console.log('in');
                // move background image
                $('#img-parallax').css({
                    'background-position': '0px ' + img_pos + 'px'
                });
        }
        lastScrollTop = st;
    });
};

$(document).ready(init);

// smooth scrolling
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});