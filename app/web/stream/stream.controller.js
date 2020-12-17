(function () {
    'use strict';

    angular.module('wayonara.social').controller('StreamController', StreamController);

    StreamController.$inject = ['$scope', 'ShardService', '$state', '$log', 'UserService', 'shardsResolved', '$rootScope', 'translationResolved', 'TutorialMessageService', 'SocketService'];

    function StreamController($scope, ShardService, $state, $log, UserService, shardsResolved, $rootScope, translationResolved, TutorialMessageService, SocketService) {

        var currentUser = UserService.getUser();
        $scope.user = currentUser;
        $scope.masonry = '';
        $scope.shards = shardsResolved;
        $scope.currentPage = 1;

        $scope.translation = translationResolved;

        if (!UserService.hasOnboardingPlanDone()) {
            var message = [
                '<p>',
                translationResolved.onboardingPlanIntro,
                ' ',
                '<em class="font-weight-bold">',
                translationResolved.onboardingPlanPublicStream,
                '</em>',
                translationResolved.onboardingPlanMiddle,
                ' ',
                '<a class="btn btn-default btn-sm"><span class="wn-icon wn-icon-plan-empty wn-icon-plan-empty-color vertical-align-middle"></span>&#32;',
                translationResolved.plan,
                '</a>',
                ' ',
                translationResolved.onboardingPlanOutro,
                '</p>'
            ].join('');

            TutorialMessageService.showTutorialMessage({ message: message });
        }

        $scope.$on('$destroy', function () {
            $log.debug('Destroying all listeners...');
            angular.element(window).off('scroll.infiniteScrolling.' + $scope.$id);
            TutorialMessageService.hideTutorialMessage();
        });

        //--Add the listener for the infinity scrolling
        angular.element(window).on('scroll.infiniteScrolling.' + $scope.$id, function () {
            var topScrolling = $(this).scrollTop();
            if ($(window).height() + topScrolling === $(document).height()) {
                $scope.getNextPage();
            }
        });

        //--Methods
        $scope.loadStream = function () {
            var api = null;
            if ($state.current.name === 'search') {
                var query = $state.params.q;
                api = ShardService.getShards(query, $scope.currentPage);
            }
            else {
                api = ShardService.getStandardStream($scope.currentPage);
            }

            if ($scope.masonry === '') {
                //$log.debug($scope.masonry);

                api.then(function (response) {
                    $scope.startMasonry();

                    var jsonData = response.data;
                    $log.debug(jsonData);
                    $scope.shards = jsonData.shards;

                    //--Add the listener for the infinity scrolling
                    angular.element(window).on('scroll.infiniteScrolling.' + $scope.$id, function () {
                        var topScrolling = $(this).scrollTop();
                        if ($(window).height() + topScrolling == $(document).height()) {
                            $scope.getNextPage();
                        }
                    });
                });
            }
        };

        $scope.startMasonry = function () {
            var elem = document.querySelector('.shard-o-saic');
            //$log.debug(elem);

            $scope.masonry = new Masonry(elem, {
                itemSelector: '.shard',
                gutter: 22,
                transitionDuration: 0
            });

            $log.debug($scope.masonry);
            $log.debug('Masonry started!');
        };

        $scope.getNextPage = function () {
            var nextPage = $scope.currentPage + 1;
            var api = null;

            $log.debug('-- StreamController - currentPage', $scope.currentPage);
            $log.debug('-- StreamController - nextPage', nextPage);
            $log.debug('-- StreamController - $state.current.name', $state.current.name);

            if ($state.current.name === 'search') {
                var query = $state.params.q;
                api = ShardService.getShards(query, nextPage);
            }
            else {
                api = ShardService.getStandardStream(nextPage);
            }

            api.then(function (response) {
                var jsonData = response.data;
                $log.debug('Content for page ' + nextPage);
                $log.debug(jsonData);
                $log.debug($scope.shards);

                if (jsonData.shards.length > 0) {
                    $scope.shards = $scope.shards.concat(jsonData.shards);
                    $rootScope.$broadcast('WN_EVT_RENDER_GRID', { items: $scope.shards });
                    $scope.currentPage++;
                }
            });
        };

        $rootScope.$on('WN_EVT_SHARDPLANNED', function () {
            if (UserService.hasOnboardingPlanDone()) {
                TutorialMessageService.hideTutorialMessage();
            }
        });
    }
}());
