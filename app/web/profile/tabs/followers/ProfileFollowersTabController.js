(function(){
    'use strict';

    angular.module('wayonara.social').controller('ProfileFollowersTabController', ProfileFollowersTabController);
    ProfileFollowersTabController.$inject = [
        '$scope',
        '$rootScope',
        'UserService',
        '$log',
        'followersResolved',
        'loggedUserResolved'
    ];

    function ProfileFollowersTabController(
        $scope,
        $rootScope,
        UserService,
        $log,
        followersResolved,
        loggedUserResolved
    ) {
        $scope.actor = loggedUserResolved;
        $log.debug('-- ProfileFollowersTabController - $scope.actor', $scope.actor);
        $log.debug('-- ProfileFollowersTabController - $scope.target', $scope.target);
        $scope.followers = followersResolved;
        $log.debug('-- ProfileFollowersTabController - $scope.followers - initial', $scope.followers);
        $scope.currentPage = 1;

        //--Destroys all listeners
        $scope.$on('$destroy',function(){
            $log.debug("Destroying all listeners...");
            angular.element(window).off('scroll.infiniteScrolling.'+$scope.$id);
        });

        //--Add the listener for the infinity scrolling
        angular.element(window).on('scroll.infiniteScrolling.' + $scope.$id, function(){
            var topScrolling = $(this).scrollTop();
            if($(window).height() + topScrolling === $(document).height()){
                $scope.getNextPage();
            }
        });

        $scope.getNextPage = function(){
            $scope.currentPage = $scope.currentPage + 1;
            UserService.getUserFollowers($scope.actor.nid, $scope.currentPage, 20).then(
                function(response){
                    $scope.followers = $scope.followers.concat(response);
                    $rootScope.$broadcast('WN_EVT_RENDER_GRID',{ items: $scope.followers });
                    $log.debug('-- ProfileFollowersTabController - $scope.followers - getNextPage', $scope.followings);
                }
            );
        };
    }
})();
