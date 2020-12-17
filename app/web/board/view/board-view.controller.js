(function() {
    'use strict';

    angular.module('wayonara.tour').controller('BoardViewController', BoardViewController);
    BoardViewController.$inject = ['$scope', '$log', 'UserService', '$state', 'board', 'translationResolved', 'BoardService'];

    function BoardViewController($scope, $log, UserService, $state, board, translationResolved, BoardService){

        $log.debug('Inside BoardViewController with board: ', board);

        $scope.masonry = '';
        $scope.board = board;
        $scope.shards = board.shards;
        $scope.title = board.title;
        $scope.description = board.description;

        //Recupero l'utente connesso
        $scope.user = UserService.getUser();

        //Devo ricavare l'owner della board
        $scope.owner = board.user;

        //Ricavo il numero di places nella board
        $scope.placesCount = board.countPlannedShards;

        //Ricavo il numero di followers della board
        $scope.followersCount = 0;

        $scope.translation = translationResolved;

            $scope.stats = [
                {
                    label: translationResolved.stages,
                    value: $scope.placesCount
                },
                {
                    label: translationResolved.followers,
                    value: $scope.followersCount
                }
            ];

            // new actionbar view
            $scope.actionbar = {}
            $scope.actionbar.items = $scope.stats;
            if($scope.user.nid === $scope.owner.nid) {
                $scope.actionbar.actions = [
                    {
                        label: translationResolved.edit,
                        action: function(){
                            $state.go('board.edit', { boardId: $scope.board.id });
                        },
                        status: 'btn-default'
                    }
                ];
            }

        //--Destroys all listeners
        $scope.$on('$destroy',function(){
            $log.debug('Destroying all listeners...');
            angular.element(window).off('scroll.infiniteScrolling.'+$scope.$id);
            angular.element(window).off('scroll.animateFilters.'+$scope.$id);
        });

        /** Carico la griglia **/
        /**
         * Load the stream for the profile
         */
        $scope.loadStream = function(){

            if($scope.masonry === '') {

                $scope.startMasonry();

                //--Add the listener for the infinity scrolling
                angular.element(window).on('scroll.infiniteScrolling.' + $scope.$id, function(){
                    var topScrolling = $(this).scrollTop();
                    if($(window).height() + topScrolling === $(document).height()){
                        //$scope.getNextPage();
                    }
                });

                //--Add listener for filters animation
                angular.element(window).on('scroll.animateFilters.' + $scope.$id, function(){
                    var topScrolling = $(this).scrollTop();
                    var $filters = angular.element('.filters');

                    var $header = angular.element('.header');
                    if(topScrolling >= ($header.offset().top + $header.height() - 55)){
                        if(!$filters.hasClass('fixed')){
                            $scope.animateFilters(true);
                        }
                    }
                    else{
                        if($filters.hasClass('fixed')){
                            $scope.animateFilters(false);

                        }
                    }
                });
            }
        };

        $scope.startMasonry = function(){
            var elem = document.querySelector('.shard-o-saic');
            $log.debug(elem);

            $scope.masonry = new Masonry(elem, {
                itemSelector: '.shard',
                gutter: 22,
                transitionDuration: 0
            });

            $log.debug($scope.masonry);
            $log.debug('Masonry started!');
        };

        $scope.getNextPage = function(){
            var nextPage = $scope.currentPage+1;
            var api = BoardService.getDiary($scope.target.nid,nextPage);

            api.then(function(response){
                var jsonData = response.data;

                if(jsonData.shards.length>0){
                    $scope.shards = $scope.shards.concat(jsonData.shards);
                    $scope.currentPage++;
                }
            });
        };

        $scope.animateFilters = function(active){
            var $filters = angular.element('.filters');
            var $ownerText = angular.element('.owner-text');
            var $filtersBg = angular.element('.filters-background');
            var $tabs = angular.element('.wn-action-bar .tabs-wrapper');
            var $title = angular.element('.filters .title');
            var $animationTimeline = new TimelineLite();

            if(active){
                $filters.addClass('fixed');
                $filtersBg.removeClass('hidden');
                $ownerText.addClass('inverted');

                $animationTimeline.add(TweenLite.to($tabs, 0.4, {y: 80}), 0);
                $animationTimeline.add(TweenLite.to($title, 0.4, {y:0}), 0);
            }
            else {
                $filters.removeClass('fixed');
                $filtersBg.addClass('hidden');
                $ownerText.removeClass('inverted');

                $animationTimeline.add(TweenLite.to($title, 0.4, {y:-80}), 0);
                $animationTimeline.add(TweenLite.to($tabs, 0.4, {y: 0}), 0);
            }
        };
    }
}());
