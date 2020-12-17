/**
 * Created by paolomastinu on 03/10/16.
 */

(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnErrImage', ErrorImage);
    ErrorImage.$inject = ['$log'];

    function ErrorImage($log){
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src != attrs.wnErrImage) {
                        attrs.$set('src', attrs.wnErrImage);
                    }
                });

                attrs.$observe('ngSrc', function(value) {
                    if (!value && attrs.errSrc) {
                        attrs.$set('src', attrs.wnErrImage);
                    }
                });
            }
        }
    }
})();
