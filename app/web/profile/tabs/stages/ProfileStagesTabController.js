(function(){
    'use strict';

    angular.module('wayonara.social').controller('ProfileStagesTabController', ProfileStagesTabController);

    ProfileStagesTabController.$inject = ['$scope', 'target', 'UserService',
        'ShardService', '$log', 'translationResolved',
        'shards', '$rootScope'];
    function ProfileStagesTabController($scope, target, UserService,
                                        ShardService, $log, translationResolved,
                                        shards, $rootScope) {
        var vm = this;
        vm.actor = UserService.getUser();
        vm.target = target;

        vm.masonry = '';
        vm.shards = shards;
        vm.currentPage = 1;

        vm.translation = translationResolved;

        /** INTERCETTO EVENTUALI EVENTI DI CREAZIONE SHARD **/
        $scope.$on('WN_EVT_SHARD_CREATED', function(event, data) {
            $log.debug('#### Shard Created: ', event, data);
            //Add the shard just create on shard array top
            vm.shards.unshift(data);
            $rootScope.$broadcast('WN_EVT_RENDER_GRID');
        });
        /** INTERCETTO EVENTUALI EVENTI DI CREAZIONE SHARD **/

        //--Destroys all listeners
        $scope.$on('$destroy',function(){
            $log.debug('Destroying all listeners...');
            angular.element(window).off('scroll.infiniteScrolling.' + vm.$id);
        });

        //--Add the listener for the infinity scrolling
        angular.element(window).on('scroll.infiniteScrolling.' + vm.$id, function(){
            var topScrolling = $(this).scrollTop();
            if($(window).height() + topScrolling === $(document).height()){
                vm.getNextPage();
            }
        });

        /**
         * Load the stream for the profile
         */
        vm.loadStream = function(){
            var api = ShardService.getDiary(vm.target.nid,vm.currentPage);

            if(vm.masonry === '') {

                api.then(function(response){
                    vm.startMasonry();

                    var jsonData = response.data;
                    $log.debug(jsonData);
                    vm.shards = jsonData.shards;

                    //--Add the listener for the infinity scrolling
                    angular.element(window).on('scroll.infiniteScrolling.' + vm.$id, function(){
                        var topScrolling = $(this).scrollTop();
                        if($(window).height() + topScrolling === $(document).height()){
                            vm.getNextPage();
                        }
                    });

                });
            }
        };

        vm.startMasonry = function(){
            var elem = document.querySelector('.shard-o-saic');
            $log.debug(elem);

            vm.masonry = new Masonry(elem, {
                itemSelector: '.shard',
                gutter: 22,
                transitionDuration: 0
            });

            $log.debug(vm.masonry);
            $log.debug('Masonry started!');
        };

        vm.getNextPage = function(){
            var nextPage = vm.currentPage+1;
            var api = ShardService.getDiary(vm.target.nid,nextPage);

            api.then(function(response){
                var jsonData = response.data;

                if(jsonData.shards.length > 0){
                    vm.shards = vm.shards.concat(jsonData.shards);
                    $rootScope.$broadcast('WN_EVT_RENDER_GRID',{ items: vm.shards });
                    vm.currentPage++;
                }
            });
        };
    }
})();
