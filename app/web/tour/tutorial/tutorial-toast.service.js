(function(){
    'use strict';

    angular.module('wayonara.tour').service('TutorialToastService', TutorialToastService);

    TutorialToastService.$inject = ['$log', '$rootScope', '$templateRequest', '$sce', 'ngToast'];
    function TutorialToastService($log, $rootScope, $templateRequest, $sce, ngToast) {
        var toast;

        this.toggleToast = toggleToast;

        function toggleToast(data) {
            $log.debug('#### called TutorialToastService', data);
            // TODO - provide defaults?
            var options = data.options
            var info = data.info;

            var toastScope = $rootScope.$new(true);
            toastScope.info = info;
            $templateRequest(options.templateUrl).then(function(html) {
                if (angular.isDefined(toast)) {
                    ngToast.dismiss(toast);
                }
                toast = ngToast.create({
                    content: $sce.trustAsHtml(html),
                    compileContent: toastScope,
                    className: options.ngToastClassName,
                    dismissOnTimeout: options.dismissOnTimeout || false,
                    dismissOnClick: options.dismissOnClick || false,
                    dismissButton: options.dismissButton || false,
                    dismissButtonHtml: options.dismissButtonHtml || '&times;',
                    onDismiss: options.onDismiss || null
                });
            });
        }

    }
}());
