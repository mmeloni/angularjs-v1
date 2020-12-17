/**
 * Cover Directive
 * @author Maurizio Vacca
 */
(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnCover', WayonaraCover);
    WayonaraCover.$inject = ['$log', '$templateRequest', '$compile'];

    /**
     * @returns {*} the wnCover directive configuration.
     * @constructor
     */
    function WayonaraCover($log, $templateRequest, $compile) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                "wnCoverUrl":"=",
                "wnCoverType":"@",
                "wnCoverTemplate":"@",
                "user":"=",
                "tour":"=",
                "shard":"="
            },
            controller:"@",
            name:"wnController",
            link: function(scope, element) {
                $log.debug("WayonaraCover.link -", scope, element);

                $templateRequest("web/commons/cover/cover-" + scope.wnCoverTemplate + ".html").then(function (template) {
                    var $cover = $compile(template)(scope);
                    element.replaceWith($cover);
                });
            }
        };
    }
})();

/** User Cover Controller **/
(function() {
    'use strict';

    angular.module('wayonara.social').controller('CoverUserController', Controller);

    Controller.$inject = ['$scope', '$log', 'TranslationService', '$rootScope'];
    function Controller($scope, $log, TranslationService, $rootScope) {
        $scope.isUploadedCover = false;
        $scope.isUploadedAvatar = false;

        $log.debug('--- SCOPE FOR USER COVER', $scope);
        $rootScope.$on('WN_EVT_USER_COVER_UPLOADED', function() {
            $scope.isUploadedCover = true;
            $log.debug('WayonaraCover - WN_EVT_USER_COVER_UPLOADED', $scope.isUploadedCover);
        });

        $rootScope.$on('WN_EVT_USER_AVATAR_UPLOADED', function() {
            $scope.isUploadedAvatar = true;
            $log.debug('WayonaraCover - WN_EVT_USER_AVATAR_UPLOADED', $scope.isUploadedAvatar);
        });

        var translation = TranslationService.getTranslationLabels();
        $scope.translation = translation;

        $scope.goToUserWebsite = function(event) {
            event.preventDefault();
            window.open($scope.user.website);
        }

        $scope.setUploadedCover = function(isLoading) {
            $scope.isUploadedCover = isLoading;
        }

        $scope.setUploadedAvatar = function(isLoading) {
            $scope.isUploadedAvatar = isLoading;
        }
    }
}());

(function(){
    'use strict';

    angular.module('wayonara.tour').controller('CoverTourController', Controller);
    Controller.$inject = ['$scope', '$log', 'TourService', 'TranslationService', 'constants', 'HelperUploadCoverService'];

    /**
     *
     * @param $scope
     * @param $log
     * @param {TourService} TourService
     * @param {TranslationService} TranslationService
     * @constructor
     */
    function Controller($scope, $log, TourService, TranslationService, constants, HelperUploadCoverService) {
        $log.debug("CoverTourController.init -", $scope);
        var translation = TranslationService.getTranslationLabels();
        $scope.translation = translation;

        if ($scope.tour.title == "tour_title_empty"){
            $scope.tour.title = translation.tour_title_empty;
        }
        if ($scope.tour.description == "tour_description_empty"){
            $scope.tour.description = translation.tour_description_empty;
        }

        $scope.loading = false;
        $scope.isUploadedTourCover = false;

        $scope.applyFilters = HelperUploadCoverService.filterFile;

        /**
         * Upload a new tour cover.
         */
        $scope.uploadTourCover = function(file){
            $scope.loading = true;
            $scope.isUploadedTourCover = false;

            TourService.uploadTourCover(file, $scope.tour.id)
                .then(function(response){
                    $scope.loading = false;
                    $scope.isUploadedTourCover = true;
                })
                .catch(function(error){
                    $log.debug('An error occurred on Upload Tour Cover', error);
                    $scope.isUploadedTourCover = false;
                    $scope.loading = false;
                });
        };

        $scope.editTourTitle = function(value){
            if(value == null){
                value = translation.editTitle;
            }
            $scope.tour.title = value;
            $log.debug('scope tour ',$scope.tour);
            TourService.updateTour($scope.tour).then(
                function(response) {
                    $log.debug('Tour title modified');
                }
            );
        };

        $scope.editTourDescription = function(value){
            if(value == null){
                value = translation.editDescription;
            }
            $scope.tour.description = value;

            TourService.updateTour($scope.tour).then(
                function(response) {
                    $log.debug('Tour description modified');
                }
            );
        };

        $scope.setLoading = function(isLoading) {
            $scope.loading = isLoading;
        }
    }
})();

/** Place Cover Controller **/
(function(){
    'use strict';

    angular.module('wayonara.social').controller('CoverPlaceController', Controller);
    Controller.$inject = ['$scope','$log'];

    function Controller($scope, $log){
        $log.debug("CoverPlaceController");
        $log.debug("Shard", $scope.shard);
    }

})();
