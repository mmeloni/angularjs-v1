(function(){
    'use strict';

    angular.module('wayonara.social').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', '$log', 'translationResolved', 'userResolved'];
    function SettingsController($scope, $log, translationResolved, userResolved) {
        $scope.user = userResolved;
        $scope.translation = translationResolved;

        //Default active menu
        $scope.activeMenu = "myBookings";

        $scope.changeActiveMenu = function(activeMenuName){
            $scope.activeMenu = activeMenuName;
        };

        $scope.$on('WN_EVT_MYBOOKING_ACTIVE_MENU', function(event, args) {
            $scope.changeActiveMenu(args.activeMenu);
        });

    }

})();
