/**
 * Directive for Input. Manages input text/password/and email
 */

(function() {
    'use strict';

    angular.module('wayonara.social').directive('wnInput', WnInput);

    WnInput.$inject = ['$log', '$timeout', '$window'];
    function WnInput($log, $timeout, $window) {
        var types = ['text', 'url', 'password', 'email', 'textarea'];

        var config = {
            restrict: 'EA',
            templateUrl: function(elem, attrs) {
                $log.debug('WnInput.templateUrl - Getting the template', elem, attrs);
                var templateUrl = 'web/commons/input/'
                var templateName = 'input.html'

                if (attrs.wnInputType === 'textarea') {
                    templateName = 'textarea.html';
                }
                if (attrs.autocompleteAvailable === 'true') {
                    templateName = 'inputAutocomplete.html';
                }

                $log.debug('WnInput.templateUrl - template', templateUrl + templateName);
                return templateUrl + templateName;
            },
            replace: true,
            require: ['?wnInputModel'],
            scope: {
                wnInputId: '@',
                wnInputType: '@',
                wnInputLabel: '@',
                wnInputModel: '=',
                wnInputValue: '=',
                wnInputNoResult: '=',
                wnInputRequired: '=',
                wnInputMaxlength: '=',
                wnInputMinlength: '=',
                wnMorph: '@',
                autocompleteAvailable: '@',
            },
            controller: '@',
            name: 'inputController',
            compile: function(element, attrs) {
                /*
                    if(types.indexOf(attrs.wnInputType) <= -1) {
                        throw new InvalidInputTypeException(attrs.wnInputType);
                    }
                */
                return {
                    pre: function(scope, element, inputAttrs) {

                        if (types.indexOf(inputAttrs.wnInputType) <= -1) {
                            throw new InvalidInputTypeException(inputAttrs.wnInputType);
                        }

                        var input = (scope.wnInputType === 'textarea') ? element.find('textarea') : element.find('input');
                        input.addClass('wn-input');
                        input.addClass('form-control');

                        if (scope.wnMorph) {
                            input.addClass('morpher');
                        }
                    },
                    post: function(scope, element, ctrl, wnInputModel) {
                        var input = (scope.wnInputType === 'textarea') ? element.find('textarea') : element.find('input');

                        scope.$watch('scope.wnInputModel', function() {
                            $log.debug('Model updated: ' + scope.wnInputModel);
                            var prefill = scope.wnInputModel;

                            if (prefill !== undefined && prefill !== '' && prefill != null) {
                                input.value = prefill;
                                input.trigger('input');
                            }
                        });
                    }
                }
            }
        };

        /* Directive Exceptions */
        function InvalidInputTypeException(type) {
            this.type = type;
            this.message = 'Not a valid input type provided.';
            this.toString = function() {
                return this.value + ' ' + this.message;
            };
        }

        return config;
    }
}());
