System.register([], function($__export) {
  "use strict";
  return {
    setters: [],
    execute: function() {
      $(function() {
        $('a[href*="#"]:not([href="#"])').click(function() {
          if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
              $('html, body').animate({scrollTop: target.offset().top}, 1000);
              return false;
            }
          }
        });
      });
    }
  };
});

System.register([], function($__export) {
  "use strict";
  return {
    setters: [],
    execute: function() {
      ;
      (function(window) {
        'use strict';
        var keys = {
          37: 1,
          38: 1,
          39: 1,
          40: 1
        };
        function preventDefault(e) {
          e = e || window.event;
          if (e.preventDefault)
            e.preventDefault();
          e.returnValue = false;
        }
        function preventDefaultForScrollKeys(e) {
          if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
          }
        }
        function disableScroll() {
          if (window.addEventListener)
            window.addEventListener('DOMMouseScroll', preventDefault, false);
          window.onwheel = preventDefault;
          window.onmousewheel = document.onmousewheel = preventDefault;
          window.ontouchmove = preventDefault;
          document.onkeydown = preventDefaultForScrollKeys;
        }
        function enableScroll() {
          if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
          window.onmousewheel = document.onmousewheel = null;
          window.onwheel = null;
          window.ontouchmove = null;
          document.onkeydown = null;
        }
        function debounce(func, wait, immediate) {
          var timeout;
          return function() {
            var context = this,
                args = arguments;
            var later = function() {
              timeout = null;
              if (!immediate)
                func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
              func.apply(context, args);
          };
        }
        ;
        function randomIntFromInterval(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
        }
        var mainContainer = document.querySelector('.view'),
            gridEl = mainContainer.querySelector('.grid'),
            gridItems = [].slice.call(gridEl.querySelectorAll('.grid__item')),
            titleEl = mainContainer.querySelector('.title-wrap > .title--main'),
            subtitleEl = mainContainer.querySelector('.title-wrap > .title--sub'),
            pagemover = mainContainer.querySelector('.page--mover'),
            loadingStatusEl = pagemover.querySelector('.la-square-loader'),
            winsize = {
              width: window.innerWidth,
              height: window.innerHeight
            },
            introPositions = [{
              tx: -.6,
              ty: -.3,
              s: 1.1,
              r: -20
            }, {
              tx: .2,
              ty: -.7,
              s: 1.4,
              r: 1
            }, {
              tx: .5,
              ty: -.5,
              s: 1.3,
              r: 15
            }, {
              tx: -.2,
              ty: -.4,
              s: 1.4,
              r: -17
            }, {
              tx: -.15,
              ty: -.4,
              s: 1.2,
              r: -5
            }, {
              tx: .7,
              ty: -.2,
              s: 1.1,
              r: 15
            }],
            deviceEl = mainContainer.querySelector('.device'),
            showGridCtrl = document.getElementById('showgrid'),
            pageTitleEl = mainContainer.querySelector('.page__title > .page__title-main'),
            pageSubTitleEl = mainContainer.querySelector('.page__title > .page__title-sub'),
            loadMoreCtrl = mainContainer.querySelector('button.button--load'),
            isAnimating,
            scrolled,
            view = 'stack';
        function init() {
          [].slice.call(gridEl.querySelectorAll('img')).forEach(function(el) {
            el.src += '?' + Number(new Date());
          });
          classie.add(document.body, 'overflow');
          disableScroll();
          imagesLoaded(gridEl, function() {
            enableScroll();
            classie.add(mainContainer, 'view--loaded');
            showIntro();
            initEvents();
          });
        }
        function showIntro() {
          gridItems.slice(0, 6).forEach(function(item, pos) {
            var itemOffset = item.getBoundingClientRect(),
                settings = introPositions[pos],
                center = {
                  x: winsize.width / 2 - (itemOffset.left + item.offsetWidth / 2),
                  y: winsize.height - (itemOffset.top + item.offsetHeight / 2)
                };
            dynamics.css(item, {
              opacity: 1,
              translateX: center.x,
              translateY: center.y,
              scale: 0.5
            });
            dynamics.animate(item, {
              translateX: center.x + settings.tx * item.offsetWidth,
              translateY: center.y + settings.ty * item.offsetWidth,
              scale: settings.s,
              rotateZ: settings.r
            }, {
              type: dynamics.bezier,
              points: [{
                "x": 0,
                "y": 0,
                "cp": [{
                  "x": 0.2,
                  "y": 1
                }]
              }, {
                "x": 1,
                "y": 1,
                "cp": [{
                  "x": 0.3,
                  "y": 1
                }]
              }],
              duration: 1000,
              delay: pos * 80
            });
          });
          dynamics.css(deviceEl, {translateY: winsize.height * 0.25});
          dynamics.animate(deviceEl, {translateY: 0}, {
            type: dynamics.bezier,
            points: [{
              "x": 0,
              "y": 0,
              "cp": [{
                "x": 0.2,
                "y": 1
              }]
            }, {
              "x": 1,
              "y": 1,
              "cp": [{
                "x": 0.3,
                "y": 1
              }]
            }],
            duration: 1000
          });
        }
        function initEvents() {
          showGridCtrl.addEventListener('click', showGrid);
          var scrollfn = function() {
            scrolled = true;
            showGrid();
            window.removeEventListener('scroll', scrollfn);
          };
          window.addEventListener('scroll', scrollfn);
          window.addEventListener('resize', debounce(function(ev) {
            winsize = {
              width: window.innerWidth,
              height: window.innerHeight
            };
            if (view === 'stack') {
              gridItems.slice(0, 6).forEach(function(item, pos) {
                dynamics.css(item, {
                  scale: 1,
                  translateX: 0,
                  translateY: 0,
                  rotateZ: 0
                });
                var itemOffset = item.getBoundingClientRect(),
                    settings = introPositions[pos];
                dynamics.css(item, {
                  translateX: winsize.width / 2 - (itemOffset.left + item.offsetWidth / 2) + settings.tx * item.offsetWidth,
                  translateY: winsize.height - (itemOffset.top + item.offsetHeight / 2) + settings.ty * item.offsetWidth,
                  scale: settings.s,
                  rotateZ: settings.r
                });
              });
            }
          }, 10));
        }
        function showGrid() {
          if (isAnimating)
            return;
          isAnimating = true;
          dynamics.css(showGridCtrl, {display: 'none'});
          dynamics.animate(titleEl, {
            translateY: -winsize.height / 2,
            opacity: 0
          }, {
            type: dynamics.bezier,
            points: [{
              "x": 0,
              "y": 0,
              "cp": [{
                "x": 0.7,
                "y": 0
              }]
            }, {
              "x": 1,
              "y": 1,
              "cp": [{
                "x": 0.3,
                "y": 1
              }]
            }],
            duration: 600
          });
          dynamics.animate(subtitleEl, {
            translateY: -winsize.height / 2,
            opacity: 0
          }, {
            type: dynamics.bezier,
            points: [{
              "x": 0,
              "y": 0,
              "cp": [{
                "x": 0.7,
                "y": 0
              }]
            }, {
              "x": 1,
              "y": 1,
              "cp": [{
                "x": 0.3,
                "y": 1
              }]
            }],
            duration: 600,
            delay: 100
          });
          dynamics.animate(deviceEl, {
            translateY: 500,
            opacity: 0
          }, {
            type: dynamics.bezier,
            points: [{
              "x": 0,
              "y": 0,
              "cp": [{
                "x": 0.7,
                "y": 0
              }]
            }, {
              "x": 1,
              "y": 1,
              "cp": [{
                "x": 0.3,
                "y": 1
              }]
            }],
            duration: 600
          });
          dynamics.animate(pagemover, {translateY: -winsize.height}, {
            type: dynamics.bezier,
            points: [{
              "x": 0,
              "y": 0,
              "cp": [{
                "x": 0.7,
                "y": 0
              }]
            }, {
              "x": 1,
              "y": 1,
              "cp": [{
                "x": 0.3,
                "y": 1
              }]
            }],
            duration: 600,
            delay: scrolled ? 0 : 120,
            complete: function(el) {
              dynamics.css(el, {opacity: 0});
              view = 'grid';
              classie.add(mainContainer, 'view--grid');
            }
          });
          gridItems.slice(0, 6).forEach(function(item, pos) {
            dynamics.stop(item);
            dynamics.animate(item, {
              scale: 1,
              translateX: 0,
              translateY: 0,
              rotateZ: 0
            }, {
              type: dynamics.easeInOut,
              duration: 600,
              delay: scrolled ? 0 : 120
            });
          });
          dynamics.css(pageTitleEl, {
            translateY: 200,
            opacity: 0
          });
          dynamics.animate(pageTitleEl, {
            translateY: 0,
            opacity: 1
          }, {
            type: dynamics.bezier,
            points: [{
              "x": 0,
              "y": 0,
              "cp": [{
                "x": 0.2,
                "y": 1
              }]
            }, {
              "x": 1,
              "y": 1,
              "cp": [{
                "x": 0.3,
                "y": 1
              }]
            }],
            duration: 800,
            delay: 400
          });
          dynamics.css(pageSubTitleEl, {
            translateY: 150,
            opacity: 0
          });
          dynamics.animate(pageSubTitleEl, {
            translateY: 0,
            opacity: 1
          }, {
            type: dynamics.bezier,
            points: [{
              "x": 0,
              "y": 0,
              "cp": [{
                "x": 0.2,
                "y": 1
              }]
            }, {
              "x": 1,
              "y": 1,
              "cp": [{
                "x": 0.3,
                "y": 1
              }]
            }],
            duration: 800,
            delay: 500
          });
          gridItems.slice(6).forEach(function(item) {
            dynamics.css(item, {
              scale: 0,
              opacity: 0
            });
            dynamics.animate(item, {
              scale: 1,
              opacity: 1
            }, {
              type: dynamics.bezier,
              points: [{
                "x": 0,
                "y": 0,
                "cp": [{
                  "x": 0.2,
                  "y": 1
                }]
              }, {
                "x": 1,
                "y": 1,
                "cp": [{
                  "x": 0.3,
                  "y": 1
                }]
              }],
              duration: 800,
              delay: randomIntFromInterval(100, 400)
            });
          });
        }
        window.onbeforeunload = function() {
          window.scrollTo(0, 0);
        };
        init();
      })(window);
    }
  };
});

System.register(["angular2/platform/browser", "angular2/router", "./app.component"], function($__export) {
  "use strict";
  var bootstrap,
      ROUTER_PROVIDERS,
      AppComponent;
  return {
    setters: [function($__m) {
      bootstrap = $__m.bootstrap;
    }, function($__m) {
      ROUTER_PROVIDERS = $__m.ROUTER_PROVIDERS;
    }, function($__m) {
      AppComponent = $__m.AppComponent;
    }],
    execute: function() {
      bootstrap(AppComponent, [ROUTER_PROVIDERS]);
    }
  };
});
