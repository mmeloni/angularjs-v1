(function(){
    'use strict';

    angular.module('wayonara.tour').service('WayonaraTutorialHelperService', WayonaraTutorialHelperService);

    WayonaraTutorialHelperService.$inject = ['$log', '$rootScope', '_', 'UserService'];
    function WayonaraTutorialHelperService($log, $rootScope, _, UserService) {
        var self = this;
        var booleanAddPlaceModalOpen = false;

        this.triageStepByTravelBox = triageStepByTravelBox;
        this.triageStepByTimeline = triageStepByTimeline;
        this.triageStepByVehicles = triageStepByVehicles;
        this.getStep = getStep;
        this.getSteps = getSteps;
        this.isAddPlaceModalOpen = isAddPlaceModalOpen;
        this.setAddPlaceModalOpen = setAddPlaceModalOpen;

        function triageStepByTravelBox(shardCount) {
            var stepKey = 'tBoxNoPlaces';

            if (shardCount >= 2) {
                stepKey = (self.isAddPlaceModalOpen() === true) ? 'tBoxTwoPlacesJustAdded' : 'tBoxTwoPlaces';
            } else {
                switch (shardCount) {
                    case 0:
                        stepKey = 'tBoxNoPlaces';
                        break;
                    case 1:
                        stepKey = 'tBoxOnePlace';
                        break;
                    default:
                        stepKey = 'whoops';
                }
            }

            return stepKey;
        }

        function triageStepByTimeline(timelineLength) {
            var stepKey = 'tLineOneDestination';

            switch (timelineLength) {
                case 1:
                    stepKey = 'tLineOneDestination';
                    break;
                case 2:
                    stepKey = 'tLineTwoDestinations';
                    break;
                case 3:
                    stepKey = 'tLineRoundtrip';
                    break;
                default:
                    stepKey = 'tLineOneDestination';
            }

            return stepKey;
        }

        function triageStepByVehicles(vehiclesCount) {
            var stepKey = 'vRoundtrip';

            switch (vehiclesCount) {
                case 1:
                case 2:
                    stepKey = 'vRoundtrip';
                    break;
                default:
                    stepKey = 'vRoundtrip';
            }

            return stepKey;
        }

        function getStep(stepKey) {
            $log.debug('#### getStep', stepKey);
            // TODO - add checks on `stepKey`
            return self.getSteps()[stepKey];
        }

        function getSteps() {
            var iconPlus   = 'wn-icon wn-icon-plus wn-icon-square wn-icon-pin font-weight-bold';
            var iconClose  = 'wn-icon wn-icon-delete wn-icon-square wn-icon-pin font-weight-bold';
            var iconPlace  = 'wn-icon wn-icon-place wn-icon-place-color wn-icon-circle wn-icon-pin';
            var iconFlight = 'wn-icon wn-icon-flight wn-icon-flight-color wn-icon-circle wn-icon-pin';

            return {
                whoops: {
                    info: {
                        title: 'whoopsTitle',
                        messageIntro: 'whoopsMessageIntro',
                        messageIconClasses: '',
                        messageOutro: '',
                        step: ''
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                planIt: {
                    info: {
                        title: 'planItTitle',
                        messageIntro: 'planItMessageIntro',
                        messageIconClasses: '',
                        messageOutro: '',
                        step: ''
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                tBoxNoPlaces: {
                    info: {
                        title: 'tBoxNoPlacesTitle',
                        messageIntro: 'tBoxNoPlacesMessageIntro',
                        messageIconClasses: iconPlus,
                        messageOutro: 'tBoxNoPlacesMessageOutro',
                        step: '1/7'
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                tBoxOnePlace: {
                    info: {
                        title: 'tBoxOnePlaceTitle',
                        messageIntro: 'tBoxOnePlaceMessageIntro',
                        messageIconClasses: iconPlus,
                        messageOutro: 'tBoxOnePlaceMessageOutro',
                        step: '2/7'
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                tBoxTwoPlacesJustAdded: {
                    info: {
                        title: 'tBoxTwoPlacesJustAddedTitle',
                        messageIntro: 'tBoxTwoPlacesJustAddedMessageIntro',
                        messageIconClasses: iconClose,
                        messageOutro: 'tBoxTwoPlacesJustAddedMessageOutro',
                        step: ''
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                tBoxTwoPlaces: {
                    info: {
                        title: 'tBoxTwoPlacesTitle',
                        messageIntro: 'tBoxTwoPlacesMessageIntro',
                        messageIconClasses: iconPlace,
                        messageOutro: 'tBoxTwoPlacesMessageOutro',
                        step: '3/7'
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                tLineOneDestination: {
                    info: {
                        title: 'tLineOneDestinationTitle',
                        messageIntro: 'tLineOneDestinationMessageIntro',
                        messageIconClasses: iconPlace,
                        messageOutro: 'tLineOneDestinationMessageOutro',
                        step: '4/7'
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                tLineTwoDestinations: {
                    info: {
                        title: 'tLineTwoDestinationsTitle',
                        messageIntro: 'tLineTwoDestinationsMessageIntro',
                        messageIconClasses: iconPlace,
                        messageOutro: 'tLineTwoDestinationsMessageOutro',
                        step: '5/7'
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                tLineRoundtrip: {
                    info: {
                        title: 'tLineRoundtripTitle',
                        messageIntro: 'tLineRoundtripMessageIntro',
                        messageIconClasses: iconPlus,
                        messageOutro: 'tLineRoundtripMessageOutro',
                        step: '6/7'
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                vRoundtrip: {
                    info: {
                        title: 'vRoundtripTitle',
                        messageIntro: 'vRoundtripMessageIntro',
                        messageIconClasses: iconFlight,
                        messageOutro: 'vRoundtripMessageOutro',
                        step: '7/7'
                    },
                    options: {
                        ngToastClassName: 'primary'
                    }
                },
                quoteEmpty: {
                    info: {
                        title: 'quoteEmptyTitle',
                        messageIntro: 'quoteEmptyMessageIntro',
                        messageIconClasses: '',
                        messageOutro: '',
                        step: '1/3'
                    },
                    options: {
                        ngToastClassName: 'flight'
                    }
                },
                quoteBeforeSearch: {
                    info: {
                        title: 'quoteBeforeSearchTitle',
                        messageIntro: 'quoteBeforeSearchMessageIntro',
                        messageIconClasses: '',
                        messageOutro: '',
                        step: '2/3'
                    },
                    options: {
                        ngToastClassName: 'flight'
                    }
                },
                quoteAfterSearch: {
                    info: {
                        title: 'quoteAfterSearchTitle',
                        messageIntro: 'quoteAfterSearchMessageIntro',
                        messageIconClasses: '',
                        messageOutro: '',
                        step: '3/3'
                    },
                    options: {
                        ngToastClassName: 'flight'
                    }
                },
                quoteAfterSearchEmpty: {
                    info: {
                        title: 'quoteAfterSearchEmptyTitle',
                        messageIntro: 'quoteAfterSearchEmptyMessageIntro',
                        messageIconClasses: '',
                        messageOutro: '',
                        step: ''
                    },
                    options: {
                        ngToastClassName: 'warning'
                    }
                },
                done: {
                    info: {
                        title: 'doneTitle',
                        messageIntro: 'doneMessageIntro',
                        messageIconClasses: '',
                        messageOutro: '',
                        step: ''
                    },
                    options: {
                        ngToastClassName: 'success',
                        dismissButton: true,
                        dismissButtonHtml: '<small>&times;</small>',
                        dismissOnClick: true,
                        onDismiss: function() {
                            var user = UserService.getUser();
                            user.onboardingTour = 1;
                            UserService.updateUserData(user).then(
                                function(response) {
                                    $log.debug('#### WayonaraTutorialHelperService dismiss and user:', response, user);
                                    UserService.setUser(user);
                                },
                                function(error) {
                                    $log.debug('#### WayonaraTutorialHelperService dismiss and error:', error, user);
                                });
                        }
                    }
                }
            }
        }

        function isAddPlaceModalOpen() {
            return booleanAddPlaceModalOpen;
        }

        function setAddPlaceModalOpen(value) {
            booleanAddPlaceModalOpen = value;
        }
    }
}());
