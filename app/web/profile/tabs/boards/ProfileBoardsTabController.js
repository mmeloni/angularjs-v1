(function(){
	'use strict';

	angular.module('wayonara.social').controller('ProfileBoardsTabController', ProfileBoardsTabController);
	ProfileBoardsTabController.$inject = ['$log', '$scope', 'BoardService', 'target', 'boards','UserService'];

	/**
	 *
	 * @param $log
	 * @param $scope
	 * @param {BoardService} BoardService
	 * @param {User} target
	 * @param {*} boards
	 * @param {UserService} UserService
	 * @constructor
	 */
	function ProfileBoardsTabController($log, $scope, BoardService, target, boards, UserService){
		$scope.actor = UserService.getUser();
		$scope.target = target;
		$scope.boards = boards;
	}
})();