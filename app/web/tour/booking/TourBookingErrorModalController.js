(function(){
	'use strict';

	angular.module('wayonara.social').controller('TourBookingErrorModalController', TourBookingErrorModalController);

	TourBookingErrorModalController.$inject = ['$scope', '$uibModalInstance', '$log', 'timeLine', 'bookingQuoteErrorsAPIResult', '$state', '$stateParams', 'TourBookingService', 'TranslationService'];
	function TourBookingErrorModalController($scope, $uibModalInstance,	$log, timeLine,	bookingQuoteErrorsAPIResult, $state, $stateParams, TourBookingService, TranslationService){
            var translation = TranslationService.getTranslationLabels();
			$scope.translation = translation;
			$scope.title = translation.weAreSorry + "!";
			$scope.subtitle = translation.transportsUnavailable;

		$scope.viewDetails = function(timeLineVectorId){
			//Se devo modificare le date del vettore che sto visualizzando chiudo semplicemente il modal altrimenti cambio pagina
			if(timeLineVectorId === parseInt($stateParams.index)){
				$scope.cancel();
			}
			else{
				$scope.cancel();
				$state.go('tour.edit.selected',{'index': timeLineVectorId});
			}
		};

		$scope.getErrors = function(){
			try {
				var errors = JSON.parse(bookingQuoteErrorsAPIResult.message);
				var travelVectors = TourBookingService.createVectorObjects(timeLine);

				$scope.bookingQuoteErrorToRenderizeVectors = TourBookingService.bookingQuoteErrorToRender(errors, travelVectors);
				return $scope.bookingQuoteErrorToRenderizeVectors;
			}
			catch(err) {
				$log.error("TourBookingErrorModalController - an error occurred:", err);
				$uibModalInstance.dismiss('cancel');
				$state.go('error');
			}
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		//--Load the errors
		$scope.getErrors();
	}
})();
