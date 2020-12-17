/**
 * Dialog Service.
 * @author Maurizio Vacca
 */

(function(){
	'use strict';

	angular.module('wayonara.social').service('DialogService', DialogService);
	DialogService.$inject = ['$mdDialog'];

	function DialogService($mdDialog) {
		this.show = function(options){
			$mdDialog.show(options);
		};

		this.cancel = function(){
			$mdDialog.cancel();
		};

		this.confirm = function(){
			$mdDialog.hide();
		};
	}
})();