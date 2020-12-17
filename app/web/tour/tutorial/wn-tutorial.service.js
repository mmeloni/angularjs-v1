(function(){
    'use strict';

    angular.module('wayonara.tour').service('WayonaraTutorialService', WayonaraTutorialService);

    WayonaraTutorialService.$inject = ['$log', '$rootScope', '_', 'WayonaraTutorialHelperService', 'TranslationService'];
    function WayonaraTutorialService($log, $rootScope, _, WayonaraTutorialHelperService, TranslationService) {
        var currentStep = 'tBoxNoPlaces',
            self = this;

        this.setCurrentStep = setCurrentStep;
        this.getCurrentStep = getCurrentStep;
        this.getSteps = getSteps;
        this.triageStepByTour = triageStepByTour;

        function setCurrentStep(newStep) {
            $log.debug('#### setCurrentStep', newStep);
            // TODO - add checks on `newStep`
            currentStep = newStep;
            var translation = TranslationService.getTranslationLabels();

            var step = WayonaraTutorialHelperService.getStep(self.getCurrentStep());
            var stepInfo = step.info;
            _.forEach(stepInfo, function(value, key) {
                if (key !== 'messageIconClasses' && key !== 'step')
                stepInfo[key] = translation[value];
            });
            step.info = stepInfo;

            $rootScope.$broadcast('WN_EVT_TUTORIAL_STEP_CHANGED', step);
        }

        function getCurrentStep() {
            $log.debug('#### getCurrentStep');
            return currentStep;
        }

        function triageStepByTour(tour) {
            var stepKey;

            var timelineLength = 0;
            var vehiclesCount = 0;
            if (angular.isArray(tour.timeline)) {
                var timelineFiltered = _.filter(tour.timeline, function(item) {
                    return item.model.category === 'shard';
                });
                timelineLength = timelineFiltered.length;

                timelineFiltered = _.filter(tour.timeline, function(item) {
                    return item.model.category === 'vehicle';
                });
                vehiclesCount = timelineFiltered.length;
            }

            var shardCount = 0;
            if (angular.isArray(tour.shardsId)) {
                shardCount = tour.shardsId.length;
            }

            if (timelineLength === 0) {
                stepKey = WayonaraTutorialHelperService.triageStepByTravelBox(shardCount);
            } else if (vehiclesCount > 0) {
                stepKey = WayonaraTutorialHelperService.triageStepByVehicles(vehiclesCount)
            } else {
                stepKey = WayonaraTutorialHelperService.triageStepByTimeline(timelineLength);
            }

            return stepKey;
        }

        function getSteps() {
            return WayonaraTutorialHelperService.getSteps();
        }
    }
}());
