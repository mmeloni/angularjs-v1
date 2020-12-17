(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnImage', WayonaraImage);
    WayonaraImage.$inject = ['$log', 'constants', '_'];

    /**
    * ImageDirective: retrieves img from aws in correct format by prefix
    *
    * format prefix available:
    * _single_shard_    [329x480]
    * _double_shard_    [680x480]
    * _triple_shard_    [1031x480]
    * _quad_shard_      [1382x480]
    * _cover_           [1920x814]
    * _cover_tour_      [1920x694]
    * _cover_popover_   [325x90]
    * _square_          [512x512]
    * _avatar_          [512x512]
    * full_shard        [1920x1080] or [1080x1920] depending by original image layout
    * _tour_view_       [693x980]
    *
    * @param $log
    *
    * @returns {Object}
    */
    function WayonaraImage() {
        return {
            restrict: 'E',
            templateUrl: 'web/utilities/image.html',
            replace: true,
            scope: {},
            bindToController: {
                imgSrc: '@',
                imgFormat: '=',
                shard: '=',
                user: '=',
                place: '=',
                bookingPreview: '=',
                customImgWidth: '=',
                customImgHeight: '=',
                errSrc: '@',
                polling: '=',
                cssClasses: '@',
                isPollingImageSrcCallback: '&'
            },
            controllerAs: 'vmImage',
            controller: function($log, constants, _) {
                var vm = this;

                populateIdAndTypeByObject();

                $log.debug('-- WayonaraImage - polling', vm.polling);
                // to work properly in hybrid environment ng2 component inputs needs to be binded to scope variable passed through ng1 directive template
                vm.wnCssclasses = this.cssClasses;
                $log.debug('-- WayonaraImage - wnCssclasses', vm.wnCssclasses);

                // to work properly in hybrid environment ng2 component inputs needs to be binded to scope variable passed through ng1 directive template
                vm.wnImageOptions = {
                    default: this.errSrc,
                    format: getFormat(),
                    id: this.objectId,
                    type: this.objectType
                };

                function getFormat() {
                    var formats = constants._AWS_CDN.imgFormats;
                    return _.findKey(formats, function(format) {
                        return format === vm.imgFormat;
                    });
                };

                function populateIdAndTypeByObject() {
                    if (vm.shard !== undefined) {
                        $log.debug("--- wnImage shard", vm.shard, vm.imgFormat);
                        vm.objectId = vm.shard.masterId;
                        vm.objectType = 'shard';
                    }

                    if (vm.user !== undefined && vm.user !== null) {
                        $log.debug("--- wnImage user", vm.user, vm.imgFormat);
                        vm.objectId = vm.user.nid;
                        vm.objectType = 'user';
                    }

                    if (vm.place !== undefined) {
                        $log.debug("--- wnImage place", vm.place, vm.imgFormat);
                        // autocomplete compatibility: cannot be id because we have translations and data in ng-repeat must be unique
                        vm.objectId = (vm.place.linkedPlaceId) ? vm.place.linkedPlaceId : vm.place.id;
                        vm.objectType = 'place';
                    }

                    if (vm.bookingPreview !== undefined) {
                        $log.debug("--- wnImage bookingPreview", vm.bookingPreview, vm.imgFormat);
                        vm.objectId = vm.bookingPreview.tourId;
                        vm.objectType = 'shard';
                    }
                };
            },
        };
    }
})();
