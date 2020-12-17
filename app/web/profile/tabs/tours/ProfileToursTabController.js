(function(){
    'use strict';

    angular.module('wayonara.social').controller('ProfileToursTabController', ProfileToursTabController);

    ProfileToursTabController.$inject = ['$scope', 'target', 'UserService', 'ShardService', '$log', 'translationResolved', 'TourService', 'toursResolved'];
    function ProfileToursTabController($scope, target, UserService, ShardService, $log, translationResolved, TourService, toursResolved) {
        $scope.actor = UserService.getUser();
        $scope.target = target;
        $scope.tours = toursResolved;

        $scope.masonry = '';
        $scope.currentPage = 1;

        $scope.translation = translationResolved;

        //--Destroys all listeners
        $scope.$on('$destroy',function(){
            $log.debug("Destroying all listeners...");
            angular.element(window).off('scroll.infiniteScrolling.'+$scope.$id);
        });

        /**
         * Load the stream for the profile  (Ci serve il target perchè è l'utente che stiamo visualizzando che potrebbe essere diverto da quello connesso)
         */
        $scope.loadStream = function(){

            var api = TourService.getUserTours($scope.target.nid, $scope.currentPage);

            if($scope.masonry === '') {
                //$log.debug($scope.masonry);

                api.then(function(response){
                    $scope.startMasonry();

                    var jsonData = response.data;

                    $scope.tours = jsonData.shards;

                    //--Add the listener for the infinity scrolling
                    angular.element(window).on('scroll.infiniteScrolling.' + $scope.$id, function(){
                        var topScrolling = $(this).scrollTop();
                        if($(window).height() + topScrolling === $(document).height()){
                            $scope.getNextPage();
                        }
                    });

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
            $log.debug("Masonry started!");
        };

        $scope.getNextPage = function(){
            var nextPage = $scope.currentPage+1;
            var api = ShardService.getDiary(nextPage);

            api.then(function(response){
                var jsonData = response.data;
                $log.debug("Content for page " + nextPage);
                $log.debug(jsonData);
                $log.debug($scope.tours);

                if(jsonData.shards.length>0){
                    $scope.tours = $scope.tours.concat(jsonData.shards);
                    $scope.currentPage++;
                }
            });
        };

    }
})();
