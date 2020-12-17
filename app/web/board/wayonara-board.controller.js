(function(){
	'use strict';

	angular.module('wayonara.social')
        .controller('BoardPreviewController', BoardPreviewController);

	BoardPreviewController.$inject = [
        '$scope',
        '$log',
        'UserService',
        'BoardService',
        '$state',
        'TranslationService'
    ];
	/**
	 * BoardPreviewController
	 * @param $scope
	 * @param $log
	 * @param {UserService} UserService
	 * @param {BoardService} BoardService
	 * @param $state
	 * @constructor
	 */
	function BoardPreviewController(
        $scope,
        $log,
        UserService,
        BoardService,
        $state,
        TranslationService
    ) {
		$log.debug('wayonara-board.controller - init...', $scope, $log);
        $scope.translation = TranslationService.getTranslationLabels();

        $scope.menuOptions = [];
        $scope.boardHide = false;

        $scope.removeBoard = function(event) {
			$log.debug('wayonara-board.controller - $scope.removeBoard', event);

			var $boardElement = event.target.closest('[data-main="true"]');

            TweenLite.to($boardElement, 0.4, {
                scale: 1.2,
                opacity: 0,
                onComplete: function() {
                    $scope.boardHide = true;
                }
            });

            BoardService.deleteBoard($scope.ngModel.id)
                .then(function(response) {
                    $boardElement.remove();
                })
                .catch(function(error) {
                    $scope.boardHide = false;
                });
		};

		$scope.viewBoard = function() {
			$state.go('board.view', { boardId: $scope.ngModel.id });
		};

        if($scope.ngModel.user.nid === UserService.getUser().nid) {
            $scope.menuOptions.push({
                action: $scope.removeBoard,
                label: $scope.translation.del,
                description: $scope.translation.deleteThisBoard
            });
        }
    }
}());
