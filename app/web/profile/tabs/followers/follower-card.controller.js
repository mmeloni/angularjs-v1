/**
 * Created by paolomastinu on 15/04/16.
 */

(function() {
    'use strict';

    angular.module('wayonara.social').controller('FollowerCardController', FollowerCardController);

    FollowerCardController.$inject = [
        '$state',
        '$scope',
        'UserService',
        '$log',
        'TranslationService',
        'FollowService'
    ];
    function FollowerCardController(
        $state,
        $scope,
        UserService,
        $log,
        TranslationService,
        FollowService
    ) {
        $scope.buttonToshow = null;
        $scope.dropDownActions = [];
        $scope.translation = TranslationService.getTranslationLabels();

        $scope.translation = TranslationService.getTranslationLabels();

        $scope.actor = UserService.getUser();
        $log.debug('-- FollowerCardController - $scope.actor',$scope.actor);

        // NOTE SIMO: temporary fix until grid is refactored
        $scope.targetForImage = {
            nid: $scope.ngModel.user.nid
        };

        $log.debug('-- FollowerCardController - $scope.targetForImage',$scope.targetForImage);
        $log.debug('-- FollowerCardController -  $scope.ngModel.user', $scope.ngModel.user);
        $log.debug('-- FollowerCardController - $scope.target',$scope.target);

        UserService.loadUserFullData($scope.ngModel.user.nid).then(function(response) {
            $scope.target = response;
            $log.debug('-- FollowerCardController - $scope.target',$scope.target);

            if($scope.target.nid !== $scope.actor.nid) {
                if($scope.target.isFollowed === true) {
                    $scope.buttonToshow = { class:'primary', action:'unfollow', params: $scope.target.nid, label: $scope.translation.following };
                }
                if($scope.target.isFollowed === false) {
                    $scope.buttonToshow = { class:'wn-btn-neutral', action:'follow', params: $scope.target.nid, label: $scope.translation.follow };
                }
                if($scope.target.isBlocked === true) {
                    var dropDownActionTo = { class:'', action:'unblock', params: $scope.target.nid, label: $scope.translation.unblock };
                    $scope.dropDownActions.push(dropDownActionTo);
                }
                if($scope.target.isBlocked === false) {
                    var dropDownActionTo = { class:'', action:'block', params: $scope.target.nid, label: $scope.translation.block };
                    $scope.dropDownActions.push(dropDownActionTo);
                }
            }
        });

        $scope.follow = function(targetNid) {
            FollowService.follow(targetNid).then(
                function(response){
                    $scope.buttonToshow = { class:'primary', action:'unfollow', params: $scope.target.nid, label: $scope.translation.following };
                }
            );
        };

        $scope.unfollow = function(targetNid) {
            FollowService.unfollow(targetNid).then(
                function(response){
                    $scope.buttonToshow = { class:'wn-btn-neutral', action:'follow', params: $scope.target.nid, label: $scope.translation.follow };
                }
            );
        };

        $scope.block = function(userToBlockNid) {
            UserService.blockUser(userToBlockNid).then(
                function(response) {
                    $log.debug('Ok utente bloccato', response);
                }
            );
        };

        $scope.unblock = function(userToUnBlockNid) {
            UserService.unblockUser(userToUnBlockNid).then(
                function(response) {
                    $log.debug('Ok utente sbloccato', response);
                }
            );
        };

        $scope.editProfile = function() {
            $state.go('profileEdit');
        };

        $scope.viewProfile = function() {
            // $state.go('profile.view', { userId: $scope.target.nid });
            $state.go('profileById', { userNid: user.nid });
        };
    }
}());
