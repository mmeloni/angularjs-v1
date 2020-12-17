(function() {
    'use strict';

    angular.module('wayonara.tour').controller('TourViewController', TourViewController);

    TourViewController.$inject = ['$scope', '$log', 'UserService', '$state', 'tourResolved', 'translationResolved', 'TourService', 'ShardService', 'constants', '_'];
    function TourViewController($scope, $log, UserService, $state, tourResolved, translationResolved, TourService, ShardService, constants, _) {

        var vm = this;

        canAccessTour(tourResolved);

        var currentUser = UserService.getUser();

        vm.tour = tourResolved;
        vm.tourId = tourResolved.id;
        vm.tourCover = constants._AWS_CDN.shardImgPath + '_cover_tour_' + tourResolved.id + '.jpeg';

        if (tourResolved.timeline === null) {
            vm.tour.timeline = [];
        }

        vm.participants = removeNoWayonaraUsers(tourResolved.participants);
        vm.showLeave = leavePermission(tourResolved);

       vm.translation = translationResolved;

       if (tourResolved.title === 'tour_title_empty') {
         vm.tour.title = translationResolved.tour_title_empty;
       }

       if (tourResolved.description === 'tour_description_empty') {
         vm.tour.description = translationResolved.tour_description_empty;
       }

        vm.leaveTour = function(tourId) {
            var tour = vm.tour;
            var participant = TourService.getActualUserAsParticipant(tour, currentUser);
            var internalParticipantModel = { nid: participant.nid, label: participant.label, isPax: true, bitMaskPermission: participant.bitMaskPermission, id: null };
            TourService.deleteInternalTourParticipant({ tourId: tourId, internalParticipant: internalParticipantModel});
        };

        vm.clickHandler = function(node, tree) {
            var anchorId = '#tourViewSection-' + node.index;
            $('html, body').animate({
                scrollTop: $(anchorId).offset().top
            }, 1000);
        };

        /***********************************************************************
         * Listeners
         */

        $scope.$on('$destroy', function() {
           angular.element(window).off('scroll.fixedTimeline' + $scope.$id);
        });

        var timelineTopOffset = 0;
        var timelineHeight = 0;
        angular.element(window).on('scroll.fixedTimeline' + $scope.$id, function() {
           var topScrolling = $(this).scrollTop();
           var $timelineSection = $('#tourTimelineSection');

           timelineTopOffset = (timelineTopOffset > 0) ? timelineTopOffset: $timelineSection.offset().top;
           timelineHeight = (timelineHeight > 0) ? timelineHeight: $timelineSection.height();

           if (topScrolling >= (timelineTopOffset + timelineHeight - 55)) {

               if (!$timelineSection.hasClass('fixed')) {
                   animateTimeline(true);
               }

           } else {

               if ($timelineSection.hasClass('fixed')) {
                   animateTimeline(false);
               }

           }
        });

        /***********************************************************************
         * Helpers
         */

        function leavePermission(tour) {
            if (tour.user.nid === currentUser.nid) {
                return false;
            } else {
                return (tour.bitMaskPermission >= constants._TOUR_ROLES_BIT_MASK[0].value);
            }
        };

        function animateTimeline(active) {
           var $timelineSection = $('#tourTimelineSection');

           if (active) {
             $timelineSection.addClass('fixed');
           }
           else {
             $timelineSection.removeClass('fixed');
           }
        };

        function removeNoWayonaraUsers(participants) {
            var filteredParticipants = [];
            if (angular.isDefined(participants)) {
                filteredParticipants = _.filter(participants, function(p) {
                    return p.nid !== null
                })
            }

            return filteredParticipants;
        }

        /** Check if the current user can access the resolved tour **/
        function canAccessTour(tour) {
            if (tour.status !== 2) {
                if (tour.bitMaskPermission === constants._TOUR_ROLES_BIT_MASK[0].value || tour.bitMaskPermission === constants._TOUR_ROLES_BIT_MASK[1].value || tour.bitMaskPermission === constants._TOUR_ROLES_BIT_MASK[2].value ) {
                    $log.debug('Current user can access the tour', currentUser, tour);
                } else {
                    $state.go('home');
                }
            }
        }

    }
}());
