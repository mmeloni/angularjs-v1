(function() {
    'use strict';

    angular.module('wayonara.tour').controller('BoardEditController', BoardEditController);

    BoardEditController.$inject = ['$scope', '$log', 'UserService', 'board', 'translationResolved', 'BoardService', '$state'];
    function BoardEditController($scope, $log, UserService, board, translationResolved, BoardService, $state){

        $log.debug('Inside BoardEditController with board: ', board);

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
                    label: $scope.translation.stages,
                    value: $scope.placesCount,
                    iconClasses: 'wn-icon wn-icon-place wn-icon-place-color'
                },
                {
                    label: $scope.translation.followers,
                    value: $scope.followersCount
                }
            ];

            // new actionbar view
            $scope.actionbar = {}
            $scope.actionbar.items = $scope.stats;
            if($scope.user.nid === $scope.owner.nid) {
                $scope.actionbar.actions = [
                    {
                        label: $scope.translation.cancel,
                        action: function(){
                            $state.go('board.view', {boardId: $scope.board.id});
                        },
                        status: 'btn-default'
                    }
                ];
            }

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
                        //--TODO add pagination
	                    //$scope.getNextPage();
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

        /** Carico la griglia **/
        $scope.editBoardTitle = function(value){
            if(value == null){
                value = translationResolved.editTitle;
            }

            board.title = value;
            $scope.title = board.title;
            $log.debug('editBoardTitle Board: ', board);

            BoardService.updateBoard(board).then(
                function(response) {
                    $log.debug('Board title modified', response);
                }
            );
        };

        $scope.editBoardDescription = function(value){
            if(value == null){
                value = translationResolved.editDescription;
            }
            board.description = value;
            $scope.description = board.description;

            BoardService.updateBoard(board).then(
                function(response) {
                    $log.debug('Board Description modified', response);
                }
            );
        };

    }
}());
