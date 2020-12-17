/**
 * Created by paolomastinu on 21/03/16.
 */

(function(){
    'use strict';

    angular.module('wayonara.social').directive('cutText', cutText);
    cutText.$inject = ['$log'];

    function cutText($log){
        return {
            link: function(scope, element) {
                $log.debug("cut Text", element.val());
            }
        }
    }
})();
