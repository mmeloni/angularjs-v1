(function () {
    'use strict';

    angular.module('wayonara.social').controller('ProfileFollowingTabController', ProfileFollowingTabController);
    ProfileFollowingTabController.$inject = [
        '$scope',
        '$rootScope',
        'UserService',
        '$log',
        'followingsResolved',
        'loggedUserResolved'
    ];

    function ProfileFollowingTabController($scope,
                                           $rootScope,
                                           UserService,
                                           $log,
                                           followingsResolved,
                                           loggedUserResolved) {
        $scope.actor = loggedUserResolved;
        $log.debug('-- ProfileFollowingTabController - $scope.actor', $scope.actor);
        $log.debug('-- ProfileFollowingTabController - $scope.target', $scope.target);
        $scope.followings = followingsResolved;
        $log.debug('-- ProfileFollowingTabController - $scope.followings - initial', $scope.followings);
        $scope.currentPage = 1;

        //--Destroys all listeners
        $scope.$on('$destroy', function () {
            $log.debug('Destroying all listeners...');
            angular.element(window).off('scroll.infiniteScrolling.' + $scope.$id);
        });

        //--Add the listener for the infinity scrolling
        angular.element(window).on('scroll.infiniteScrolling.' + $scope.$id, function () {
            var topScrolling = $(this).scrollTop();
            if ($(window).height() + topScrolling === $(document).height()) {
                $scope.getNextPage();
            }
        });

        $scope.getNextPage = function () {
            $scope.currentPage = $scope.currentPage + 1;
            UserService.getUserFollowing($scope.actor.nid, $scope.currentPage, 20).then(
                function (response) {
                    $scope.followings = $scope.followings.concat(response);
                    $rootScope.$broadcast('WN_EVT_RENDER_GRID', { items: $scope.followings });
                    $log.debug('-- ProfileFollowingTabController - $scope.followings - getNextPage', $scope.followings);
                }
            );
        };

    }
}());
