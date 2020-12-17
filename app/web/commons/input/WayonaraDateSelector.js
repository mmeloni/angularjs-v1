/**
 * Directive for date selectors
 */

(function() {
    'use strict';

    angular.module('wayonara.social').directive('wnDateselector', WayonaraDateSelector);
    WayonaraDateSelector.$inject = ['$log', 'TranslationService'];

    function WayonaraDateSelector($log, TranslationService) {
        var config = {
            restrict: 'EA',
            templateUrl: 'web/commons/input/select-date.html',
            require: ['?ngModel'],
            replace: true,
            scope: {
                ngModel: '=ngModel',
                wnInputLabel: '@',
                wnExpiration: '@'
            },
            controller: function($scope, $log, TranslationService) {
                var translation = TranslationService.getTranslationLabels();
                $scope.translation = translation;

                $scope.selectedYear = undefined;
                $scope.selectedMonth = undefined;
                $scope.selectedDay = undefined;

                $scope.months = [
                    { value: 1, name: translation.jan },
                    { value: 2, name: translation.feb },
                    { value: 3, name: translation.mar },
                    { value: 4, name: translation.apr },
                    { value: 5, name: translation.may },
                    { value: 6, name: translation.jun },
                    { value: 7, name: translation.jul },
                    { value: 8, name: translation.aug },
                    { value: 9, name: translation.sep },
                    { value: 10, name: translation.oct },
                    { value: 11, name: translation.nov },
                    { value: 12, name: translation.dic }
                ];

                if ($scope.ngModel !== '' && $scope.ngModel !== undefined && $scope.ngModel !== null) {
                    $log.debug('-- WayonaraDateSelector - $scope.ngModel', $scope.ngModel);

                    var birthDate = $scope.ngModel.split('-');

                    $scope.selectedDay = parseInt(birthDate[2]);
                    $scope.selectedMonth = $scope.months[birthDate[1] - 1];
                    $scope.selectedYear = birthDate[0];
                }

                $scope.getDaysInMonth = function(y, m) {
                    var defaultYear = 1900;

                    if (m === undefined || m === '')
                        return 31;
                    else if (y === undefined || y === '')
                        return new Date(defaultYear, m, 0).getDate();
                    else
                        return new Date(y, m, 0).getDate();
                };

                $scope.setDays = function(elem) {
                    var year = elem.find('.wn-year-selector').val();
                    var month = elem.find('.wn-month-selector').val();

                    var maxD = $scope.getDaysInMonth(year, month);
                    $log.debug('max numbers of days: ' + maxD);
                    var d = [];
                    for (var i = 1; i <= maxD; i++) {
                        d.push(i);
                    }
                    return d;
                };

                $scope.setDate = function(elem) {
                    var year = elem.find('.wn-year-selector').val();
                    var month = elem.find('.wn-month-selector').val();
                    var day = elem.find('.wn-day-selector').val();

                    $scope.ngModel = moment({ year: year, month: month - 1, day: day }).format('YYYY-MM-DD');
                    $log.debug($scope.ngModel);
                };

                $scope.years = (function() {
                    //if wnDateSelector is used for expiration instead of birthdate, needs to show future years
                    var minY, maxY = null;

                    if ($scope.wnExpiration) {
                        minY = new Date().getFullYear();
                        maxY = new Date().getFullYear() + 18;
                    } else {
                        minY = 1900;
                        maxY = new Date().getFullYear();
                    }

                    var y = [];
                    for (var i = minY; i <= maxY; i++) {
                        y.push(i);
                    }

                    return y;
                })();
            },
            link: function(scope, elem) {
                //--Recalculate days if month/year change and set the new date.
                //--Validation will come later on
                scope.days = scope.setDays(elem);

                elem.find('.wn-month-selector').on('change', function() {
                    scope.days = scope.setDays(elem);
                    scope.setDate(elem);

                });
                elem.find('.wn-year-selector').on('change', function() {
                    scope.days = scope.setDays(elem);
                    scope.setDate(elem);
                });
                elem.find('.wn-day-selector').on('change', function() {
                    scope.setDate(elem);
                });
            }
        };

        return config;
    }
} ());
