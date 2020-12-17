/**
 * Created by Paolo Mastinu (The King)
 * on 04/04/16.
 */

(function() {
    'use strict';

    angular.module('wayonara.social').controller('ToastRemoveShardFromBoardController', ToastRemoveShardFromBoardController);

    ToastRemoveShardFromBoardController.$inject = ['$scope', '$log', '$state', '$mdToast', 'message', "board", "shard", "boardRequest", "BoardService", "UserService", 'TranslationService'];
    function ToastRemoveShardFromBoardController($scope, $log, $state, $mdToast, message, board, shard, boardRequest, BoardService, UserService, TranslationService) {
        $scope.translation = TranslationService.getTranslationLabels();

        $scope.user = UserService.getUser();
        $scope.message = message;
        $scope.board = board;
        $scope.shard = shard;
        $scope.boardRequest = boardRequest;

        $scope.deleteShardAndBoard = function(boardRequest) {
            BoardService.deleteShardFromBoard(boardRequest).then(
                function(response){
                    if(response.data === 0){
                        $mdToast.hide();
                        //È stata cancellata anche la board
                        // $state.go('profile.view', {"userId": $scope.user.nid});
                        $state.go('profileById', { userNid: user.nid });
                    }
                }
            );
        };

        $scope.cancel = function(){
            $mdToast.hide();
        }
    }
}());
