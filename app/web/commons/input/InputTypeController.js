/**
 * InputTupe Controller.
 *
 * @author Paolo Mastinu
 */
(function() {
    'use strict';

    angular.module('wayonara.social').controller('InputTypeController', InputTypeController);

    InputTypeController.$inject = ['$scope', 'TranslationService'];
    function InputTypeController($scope, TranslationService) {
        $scope.translation = TranslationService.getTranslationLabels();
    }
})();

/**
 * Autocomplete Controller.
 */
(function() {
    'use strict';

    angular.module('wayonara.social').controller('AutocompleteController', AutocompleteController);

    AutocompleteController.$inject = ['$scope', '$log', 'ShardService', 'TranslationService', 'constants'];
    function AutocompleteController($scope, $log, ShardService, TranslationService, constants) {
        $scope.translation = TranslationService.getTranslationLabels();

        $scope.getCity = function(needle) {
            $log.debug('-- InputTypeController - $scope.getCity needle', needle);
            var locale = TranslationService.getCurrentLocale();

            if(typeof(needle) !== 'undefined' && needle.length > 2) {
                $scope.needle = needle;
                return ShardService.getAutocompleteData(needle, locale,constants._AUTOCOMPLETE_ROLES_BIT_MASK.city).then(function(response) {
                    $scope.searchResults = response.data['pois'];
                    $log.debug('-- InputTypeController - $scope.searchResults', $scope.searchResults);
                    return $scope.searchResults;
                });
            }
            else{
                return $scope.searchResults = [];
            }

        };

    }
}());
