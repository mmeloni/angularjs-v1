(function(){
	'use strict';

	angular.module('wayonara.social').controller('AddParticipantsModalController', AddParticipantsModalController);

	AddParticipantsModalController.$inject = ['$scope', '$state', '$log', '$filter' ,'ShardService', 'TranslationService', 'UserService', 'TourService', 'constants'];
	function AddParticipantsModalController($scope, $state, $log, $filter, ShardService, TranslationService, UserService, TourService, constants) {

        var actor = UserService.getUser();
        $scope.tourId = $state.params.tourId;
        $scope.roles = constants._TOUR_ROLES_BIT_MASK;
        $scope.ages = constants._AGES_SELECT;
        $log.debug(constants._AUTOCOMPLETE_ROLES_BIT_MASK.user);
        $log.debug(actor);
        $log.debug($scope.tourId);

        $scope.user = UserService.getUser();

        $scope.translation = TranslationService.getTranslationLabels();

        $scope.usersList = [];

        //initialize tour participants: $scope con participants in NavbarTourController
        $scope.tourModel = $scope.$parent.tour;
        $scope.addedParticipants = $scope.$parent.tour.participants;

        $scope.nextParticipantIndex = $scope.addedParticipants.length + 1;
        $scope.externalParticipantModel = { label : 'participant' + $scope.nextParticipantIndex, age : null, isPax : true, keyCode : $scope.nextParticipantIndex + '_', id: null };
        $scope.getUsers = function(needle){
            var locale = TranslationService.getCurrentLocale();
            if($scope.usersList.length <=0) {
                return ShardService.getAutocompleteData(needle, locale, constants._AUTOCOMPLETE_ROLES_BIT_MASK.user).then(function(response){
                    $log.debug(response);
                    return response.data['users'];
                });
            }
            else{
                return $scope.usersList;
            }
        };

        $scope.addInternalParticipant = function(participant){
            var internalParticipantModel = { nid : participant.nid, label : participant.label, isPax : true, bitMaskPermission : 1, id: null };

            var find_participant = $filter('filter')($scope.addedParticipants, function (p) {return p.nid === participant.nid;})[0];

            if(typeof(find_participant) === 'undefined'){
                $scope.addedParticipants.push(internalParticipantModel);

                TourService.addInternalTourParticipant({"tourId": $scope.tourId, "internalParticipant" : internalParticipantModel})
                    .then(function(response){
                        internalParticipantModel.id = response.data;
                        $log.debug('--- added internal participant:', internalParticipantModel);
                    })
                    .catch(function(response){
                    });
            } else {
                $log.debug('participant already exists', participant);
            }
        };

        $scope.updateInternalParticipantRole = function(participant){
            $log.debug('--- updated internal participant role:', participant);
            TourService.updateInternalTourParticipant({"tourId": $scope.tourId, "internalParticipant" : participant});
        };

        $scope.updateInternalParticipantPax = function(participant){
        $log.debug('--- updated internal participant pax:', participant);
            TourService.updateInternalTourParticipant({"tourId": $scope.tourId, "internalParticipant" : participant});
        };

        $scope.deleteInternalParticipant = function(participant){
            var index = $scope.addedParticipants.indexOf(participant);
            $scope.addedParticipants.splice(index, 1);

            $log.debug('--- deleted internal participant pax:', participant);
            TourService.deleteInternalTourParticipant({"tourId": $scope.tourId, "internalParticipant" : participant});
        };

        $scope.addExternalParticipant = function(){
            var nextParticipantIndex = $scope.addedParticipants.length + 1;
            $scope.externalParticipantModel = { label : 'participant' + nextParticipantIndex , age : null, isPax : true, keyCode : nextParticipantIndex + '_', id: null  };

            $scope.addedParticipants.push($scope.externalParticipantModel);

            TourService.addExternalTourParticipant({"tourId": $scope.tourId, "externalParticipant" : $scope.externalParticipantModel})
                .then(function(response){
                    $scope.externalParticipantModel.id = response.data;
                    $log.debug('--- added external participant:', $scope.externalParticipantModel);
                })
                .catch(function(response){
                    $log.debug('---an error occurred during adding external participant:', $scope.externalParticipantModel);
                });

        };

        $scope.updateExternalParticipant = function(participant){
            var index = $scope.addedParticipants.indexOf(participant);
            participant.keycode = index + '_' + participant.age;
            $log.debug('--- updated external participant:', participant);
            TourService.updateExternalTourParticipant({"tourId": $scope.tourId, "externalParticipant" : participant});
        };

        $scope.deleteExternalParticipant = function(participant){
            var index = $scope.addedParticipants.indexOf(participant);
            $scope.addedParticipants.splice(index, 1);
            /*
            var nextParticipantIndex = $scope.addedParticipants.length + 1;
            $scope.externalParticipantModel = { label : 'participant' + $scope.nextParticipantIndex , age : null, isPax : true, keyCode : $scope.nextParticipantIndex + '_'};
            */
            $log.debug('--- deleted external participant:', participant);
            TourService.deleteExternalTourParticipant({"tourId": $scope.tourId, "externalParticipant" : participant});

        };
	}
})();
