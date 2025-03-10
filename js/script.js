(function($) {
    'use strict';

    /*
     * SCROLLIT.JS FUNCTIONALITY
     */
    var scrollIt = function(options) {

        var defaults = {
            upKey: 38,
            downKey: 40,
            easing: 'linear',
            scrollTime: 600,
            activeClass: 'active',
            onPageChange: null,
            topOffset: 0
        };

        var settings = $.extend(defaults, options),
            active = 0,
            lastIndex = $('[data-scroll-index]:last').attr('data-scroll-index');

        /**
         * navigate
         *
         * sets up navigation animation
         */
        var navigate = function(ndx) {
            if (ndx < 0 || ndx > lastIndex) return;

            var targetTop = $('[data-scroll-index=' + ndx + ']').offset().top + settings.topOffset + 1;
            $('html, body').stop().animate({
                scrollTop: targetTop
            }, settings.scrollTime, settings.easing);
        };

        /**
         * doScroll
         *
         * runs navigation() when criteria are met
         */
        var doScroll = function(e) {
            var target = $(e.target).closest("[data-scroll-nav]").attr('data-scroll-nav') ||
                         $(e.target).closest("[data-scroll-goto]").attr('data-scroll-goto');
            navigate(parseInt(target));
        };

        /**
         * keyNavigation
         *
         * sets up keyboard navigation behavior
         */
        var keyNavigation = function(e) {
            if ($(window).width() <= 768) return; // Disable on mobile

            var key = e.which;
            if ($('html, body').is(':animated') && (key === settings.upKey || key === settings.downKey)) {
                return false;
            }
            if (key === settings.upKey && active > 0) {
                navigate(parseInt(active) - 1);
                return false;
            } else if (key === settings.downKey && active < lastIndex) {
                navigate(parseInt(active) + 1);
                return false;
            }
            return true;
        };

        /**
         * updateActive
         *
         * sets the currently active item
         */
        var updateActive = function(ndx) {
            if (settings.onPageChange && ndx && (active !== ndx)) settings.onPageChange(ndx);

            active = ndx;
            $('[data-scroll-nav]').removeClass(settings.activeClass);
            $('[data-scroll-nav=' + ndx + ']').addClass(settings.activeClass);
        };

        /**
         * watchActive
         *
         * watches currently active item and updates accordingly
         */
        var watchActive = function() {
            if ($(window).width() <= 768) return; // Disable on mobile

            var winTop = $(window).scrollTop();
            var visible = $('[data-scroll-index]').filter(function() {
                return winTop >= $(this).offset().top + settings.topOffset &&
                       winTop < $(this).offset().top + settings.topOffset + $(this).outerHeight();
            });

            var newActive = visible.first().attr('data-scroll-index');
            updateActive(newActive);
        };

        if ($(window).width() > 768) {
            $(window).on('scroll', watchActive).scroll();
            $(window).on('keydown', keyNavigation);
        }

        $('body').on('click', '[data-scroll-nav], [data-scroll-goto]', function(e) {
            e.preventDefault();
            doScroll(e);
        });
    };

    /*
     * DOCUMENT READY FUNCTION
     */
    $(document).ready(function() {

        // Navbar shrink on scroll
        $(window).on("scroll", function() {
            if ($(this).scrollTop() > 90) {
                $(".navbar").addClass("navbar-shrink");
            } else {
                $(".navbar").removeClass("navbar-shrink");
            }
        });

        // Parallax effect
        function parallaxMouse() {
            if ($("#parallax").length) {
                var scene = document.getElementById("parallax");
                var parallax = new Parallax(scene);
            }
        }

        parallaxMouse();

        // Skills Meter Animation
        $(window).scroll(function() {
            var hT = $("#skill-bar-wrapper").offset().top;
            var hH = $("#skill-bar-wrapper").outerHeight();
            var wH = $(window).height();
            var wS = $(this).scrollTop();

            if (wS > (hT + hH - 1.4 * wH)) {
                $('.skillbar-container').each(function() {
                    $(this).find('.skills').stop().animate({
                        width: $(this).attr('data-percent')
                    }, 1500);
                });
            }
        });

        // Filter gallery using Isotope
        let $btns = $('.img-gallery .sortBtn .filter-btn');
        $btns.click(function(e) {
            $('.img-gallery .sortBtn .filter-btn').removeClass('active');
            $(this).addClass('active');

            let selector = $(this).attr('data-filter');
            $('.img-gallery .grid').isotope({
                filter: selector
            });
            return false;
        });

        // Magnific Popup for gallery
        $('.image-popup').magnificPopup({
            type: 'image',
            gallery: { enabled: true }
        });

        // Owl Carousel for testimonials
        $('.testimonial-slider').owlCarousel({
            loop: true,
            margin: 0,
            autoplay: true,
            responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 3 }
            }
        });

        // Initialize ScrollIt only on desktop
        if ($(window).width() > 768) {
            scrollIt({
                topOffset: -50
            });
        }

        // Hiding Mobile Navbar when a nav link is clicked
        $(".nav-link").on("click", function() {
            $(".navbar-collapse").collapse("hide");
        });

        // Contact Form Validation
        document.getElementById("contactForm").addEventListener("submit", function(event) {
            let message = document.getElementById("message").value.trim();

            if (message.length < 10) {
                alert("Message must be at least 10 characters long.");
                event.preventDefault(); // Prevent form submission
            }
        });

    });

})(jQuery);
