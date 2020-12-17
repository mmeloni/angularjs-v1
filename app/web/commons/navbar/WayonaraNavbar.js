/**
 * Created by mauriziovacca on 26/11/15.
 */

(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnNavbar', WayonaraNavbar);
    WayonaraNavbar.$inject = ['$log'];

    function WayonaraNavbar($log){
        var templatePath = 'web/commons/navbar/';
        var config = {
            restrict: 'EA',
            templateUrl: templatePath + 'navbar.html',
            replace: true,
            controller: '@',
            name: 'navbarController',
            scope: {
                logged: '=',
                type: '@',
                tourModel: '=',
                participants: '=',
                theme: '@',
                breadcrumbs: "="
            },
            compile: function(elements, attrs, controller) {
                return {
                    pre: function(scope){
                        if(scope.logged === true) {
                            switch(scope.type){
                                case 'tour':
                                    scope.controllers = templatePath + 'navbar-tour.html';
                                    break;
                                case 'tour-presentation':
                                    scope.controllers = templatePath + 'navbar-tour-presentation.html';
                                    break;
                                case 'booking':
                                    scope.controllers = templatePath + 'navbar-booking.html';
                                    break;
                                case 'error':
                                    scope.controllers = templatePath + 'navbar-error.html';
                                    break;
                                default:
                                    scope.controllers = templatePath + 'navbar-error.html';
                                    break;
                            }
                        }
                        else {
                            scope.controllers = templatePath + 'navbar-not-logged.html';
                        }
                    },
                    post: function(scope, elem){
                        //--Link the opacity onscroll
                        if(scope.type === "social"){
                            $(window).on('scroll', function(){
                                var topScrolling = $(this).scrollTop();
                                if(topScrolling > 0 && !scope.scrollingStarted) {
                                    elem.addClass("navbar-wayonara-onscroll");
                                    scope.scrollingStarted = true;
                                }
                                else if(topScrolling == 0 && scope.scrollingStarted) {
                                    elem.removeClass("navbar-wayonara-onscroll");
                                    scope.scrollingStarted = false;
                                }
                            });
                        }

                        scope.$on('WN_EVT_PAGELOADING', function(){
                            $log.debug("WayonaraNavbar.link() - page loading ...");
                            scope.status="loading";
                        });

                        scope.$on('WN_EVT_PAGELOADED', function(){
                            scope.status="ready";
                        });
                    }
                };
            }
        };

        return config;
    }
})();
