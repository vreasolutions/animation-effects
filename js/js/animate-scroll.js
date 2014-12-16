/*
Plugin Name: jQuery Animation Scroll Plugin
Author: Jason Lusk
URI: JasonLusk.com
Example:
<p data-animate-scroll='{"scaleX": "1.5","scaleY": "1.5","x": "-10","y": "-10","rotation": "-3","alpha": "1","easingType": "Cubic.easeOut","duration": "1"}'>test</p>
 */
(function($, window, document) {
    'use strict';
    var $window = $(window),
        //init scroll-event only once for better performance -> save target-data first in arrays
        throttles = {},
        animations = [],
        animateScroll = {
            bind: function(el, options) {
                $(el).on('reverse play', function(evt) {
                    // animate target object based on viewport check event
                    var $this = $(this),
                        $timeline = $this.data('tween'),
                        action;
                    if (!!$timeline && evt.type != action) {
                        if (!options.animateAll && evt.type == 'play') {
                            $timeline.progress(1, true);
                        }
                        $timeline[evt.type]();
                        action = evt.type;
                    }
                });
                if (!!throttles.watch) {
                    $window.find('body').andSelf().on('scroll resize orientationchange touchend gestureend', function(e) {
                        // trigger viewport animation check
                        throttles.scroll = (throttles.scroll == null) && setTimeout(function() {
                            animateScroll.inview(e.type == 'resize' || e.type == 'orientationchange');
                            throttles.scroll = null;
                        }, 101);
                    });
                }
                throttles.watch = el;
            },
            check: function(target) {
                // is stored original element position centered within the viewport
                var tObj = $(target),
                    vTop = $window.scrollTop(),
                    vBottom = vTop + $window.height(),
                    elTop = tObj.data('originalOffset').top,
                    elBottom = elTop + parseInt(tObj.data('originalSize').height);
                throttles.transition = null;
                return (vTop < elBottom && elBottom < vBottom) || (vTop < elTop && elTop < vBottom) ? 'reverse' : 'play';
            },
            update: function($this, $timeline) {
                var newOffset = $this.offset(),
                    oldOffset = $this.data('originalOffset') || {
                        top: 0
                    };
                if (newOffset.top != oldOffset.top) {
                    // update saved offset and size
                    $this.data({
                        'originalOffset': newOffset,
                        'originalSize': {
                            width: $this.width(),
                            height: $this.height()
                        }
                    });
                }
            },
            inview: function(resize) {
                animations.each(function() {
                    var $this = $(this),
                        $timeline = $this.data('tween');
                    // update trigger position
                    if (!!resize) {
                        setTimeout(function() {
                            animateScroll.update($this, $timeline);
                            // trigger animation event
                            $this
                                .trigger(animateScroll.check($this));
                        }, 250);
                    } else {
                        // trigger animation event
                        $this
                            .trigger(animateScroll.check($this));
                    }
                });
            },
            init: function(animations) {

                // add resize event to body
                addResizeListener($('body')[0], function() {
                    $('body').trigger('resize');
                });

                // function to initialize plugin and pass custom variables from html5 data attributes
                animations.each(function() {
                    var $el = $(this);
                    $el
                        .animateScroll($el.data('animate-scroll'));
                })
                    .promise()
                    .done(function() {
                        animateScroll.inview();
                    });
            },
            setup: function($this, $parent, options) {
                // setup parent element perspective
                TweenMax.set($parent, {
                    transformPerspective: options.transformPerspective,
                    onComplete: function() {
                        $parent
                            .css({
                                'perspective': options.transformPerspective
                            });
                    }
                });
                $this
                    .addClass('animateScroll')
                    .css({
                        "-webkit-transform": "translate3D(0,0,1px)"
                    });
                $this
                    .data({
                        'originalOffset': $this.offset(),
                        'originalSize': {
                            width: $this.width(),
                            height: $this.height()
                        },
                        'tween': new TimelineMax({
                            paused: true,
                            onComplete: function() {
                                animateScroll.update($this, this);
                            }
                        })
                            .to($this, options.duration, {
                                transformStyle: 'preserve-3d',
                                transformOrigin: options.transformOrigin,
                                x: options.x,
                                y: options.y,
                                scaleX: options.scaleX,
                                scaleY: options.scaleY,
                                rotation: options.rotation,
                                rotationX: options.rotationX,
                                rotationY: options.rotationY,
                                autoAlpha: options.alpha,
                                delay: options.delay,
                                z: options.z,
                                force3D: options.force3D,
                                ease: options.easingType
                            }).progress(1, false)
                    })
                    .promise()
                    .done(function() {
                        animateScroll
                            .bind($this, options);
                    });
            }
        };
    $.fn.animateScroll = function(options) {
        //set up default options
        var defaults = {
            transformPerspective: 1000, // Parent Transform Perspective
            lazyLoad: false, // Lazy Load Images (experimental)
            animateAll: false, // Animate elements outside of viewport?
            transformOrigin: '50% 50%', // Transform Origin X/Y Position
            x: 0, // Horizontal offset in px
            y: 0, // Vertical offset in px
            scaleX: 1, // Scale X position
            scaleY: 1, // Scale Y position
            rotation: 0, // Rotation in degrees
            rotationX: 0, // Rotation X position
            rotationY: 0, // Rotation X position
            alpha: 0.9, // Opacity from 0.0-1
            delay: 0, // Animation Delay
            z: 0.1, // Z position
            force3D: true, // Force 3D Hardware
            easingType: 'Back.easeInOut', // Animation easing Type
            duration: 0.3 // Animation diration in seconds
        };

        //vars
        var options = $.extend({}, defaults, options);
        if (this[0] != document) {

            this.each(function(index) {
                var $this = $(this),
                    $parent = $this.parent();
                if (options.lazyLoad && $this.is('img')) {
                    $this.on('load', function() {
                        animateScroll
                            .setup($this, $parent, options);
                    });
                } else {
                    animateScroll
                        .setup($this, $parent, options);
                }
            });
        } else {
            animations = $('[data-animate-scroll]');
            animateScroll
                .init(animations);
        }
    }

    // element resize listener [add|remove]ResizeListener(resizeElement, resizeCallback);
    // based on https://github.com/sdecima/javascript-detect-element-resize
    var attachEvent = document.attachEvent,
        stylesCreated = false;
    if (!attachEvent) {
        var createStyles = function() {
                if (!stylesCreated) {
                    var e = '.r-t { visibility: hidden; } .r-t, .r-t > div, .c-t:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .r-t > div { background: #eee; overflow: auto; } .c-t:before { width: 200%; height: 200%; }',
                        n = document.head || document.getElementsByTagName("head")[0],
                        r = document.createElement("style");
                    r.type = "text/css";
                    if (r.styleSheet) {
                        r.styleSheet.cssText = e
                    } else {
                        r.appendChild(document.createTextNode(e))
                    }
                    n.appendChild(r)
                }
            },
            requestFrame = function() {
                var e = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(e) {
                    return window.setTimeout(e, 20)
                };
                return function(t) {
                    return e(t)
                }
            }(),
            cancelFrame = function() {
                var e = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
                return function(t) {
                    return e(t)
                }
            }(),
            resetTriggers = function(e) {
                var t = e.__rt__,
                    n = t.firstElementChild,
                    r = t.lastElementChild,
                    i = n.firstElementChild;
                r.scrollLeft = r.scrollWidth;
                r.scrollTop = r.scrollHeight;
                i.style.width = n.offsetWidth + 1 + "px";
                i.style.height = n.offsetHeight + 1 + "px";
                n.scrollLeft = n.scrollWidth;
                n.scrollTop = n.scrollHeight
            },
            checkTriggers = function(e) {
                return e.offsetWidth != e.__rl__.width || e.offsetHeight != e.__rl__.height
            },
            scrollListener = function(e) {
                var t = this;
                resetTriggers(this);
                if (this.__rRAF__) cancelFrame(this.__rRAF__);
                this.__rRAF__ = requestFrame(function() {
                    if (checkTriggers(t)) {
                        t.__rl__.width = t.offsetWidth;
                        t.__rl__.height = t.offsetHeight;
                        t.__rl__.forEach(function(n) {
                            n.call(t, e)
                        })
                    }
                })
            };
    }
    window.addResizeListener = function(t, n) {
        if (attachEvent) t.attachEvent("onresize", n);
        else {
            if (!t.__rt__) {
                if (getComputedStyle(t).position == "static") t.style.position = "relative";
                createStyles();
                t.__rl__ = {};
                t.__rl__ = [];
                (t.__rt__ = document.createElement("div")).className = "r-t";
                t.__rt__.innerHTML = '<div class="e-t"><div></div></div>' + '<div class="c-t"></div>';
                t.appendChild(t.__rt__);
                resetTriggers(t);
                t.addEventListener("scroll", scrollListener, true)
            }
            t.__rl__.push(n)
        }
    };
    window.removeResizeListener = function(t, n) {
        if (attachEvent) t.detachEvent("onresize", n);
        else {
            t.__rl__.splice(t.__rl__.indexOf(n), 1);
            if (!t.__rl__.length) {
                t.removeEventListener("scroll", scrollListener);
                t.__rt__ = !t.removeChild(t.__rt__)
            }
        }
    }
})(jQuery, window, document);
