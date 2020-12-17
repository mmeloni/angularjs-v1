(function() {
    angular.module('wayonara.tour').directive('wnTutorial', function() {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: 'web/tour/tutorial/wn-tutorial.template.html',
            controller: 'WayonaraTutorialController',
            controllerAs: 'ctrl',
            scope: {},
            bindToController: {
                message: '@',
                shards: '='
            }
        }
    })
    .controller('WayonaraTutorialController', WayonaraTutorialController)
    .config(WayonaraTutorialConfig);

    WayonaraTutorialController.$inject = ['TutorialToastService', '$scope', '$log'];
    function WayonaraTutorialController(TutorialToastService, $scope, $log) {
        $scope.$on('WN_EVT_TUTORIAL_STEP_CHANGED', function(event, data) {
            $log.debug('#### got event with: ', event, data);

            var templateUrl = 'web/tour/tutorial/tutorial-toast.template.html';
            TutorialToastService.toggleToast({
                info: data.info,
                options: angular.merge({ templateUrl: templateUrl }, data.options)
            });
        });
    }

    WayonaraTutorialConfig.$inject = ['ngToastProvider'];
    function WayonaraTutorialConfig(ngToastProvider) {
        ngToastProvider.configure({
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            animation: 'slide',
            additionalClasses: 'wn-tutorial-toast'
        });
    }
}());
