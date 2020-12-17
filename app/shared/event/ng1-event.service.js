/**
 * Event Service.
 * @author Simone Pitzianti
 *
 * usage example:
 *
 * import { Inject, Injectable } from '@angular/core';
 *
 * @Injectable()
 * export class MadKatzService {
 *     constructor(@Inject('Ng1EventService') private ng1EventService) {
 *         // some constructor logic
 *     }
 *
 *     meowMethod() {
 *         this.ng1EventService.broadcast('Hey Therrrrr, I iz ur fabulus ivent and I iz going to be brrrrrroadcated evrrrrrywherrre');
 *     }
 */

(function() {
    'use strict';

    angular.module('wayonara.shared').service('Ng1EventService', Ng1EventService);
    Ng1EventService.$inject = [
        '$log',
        '$rootScope'
    ];
    function Ng1EventService(
        $log,
        $rootScope
    ) {

        this.broadcast = broadcast;

        function broadcast(event, data) {
            $log.debug('-- Ng1EventService.broadcast - event, data', event, data);
            $rootScope.$broadcast(event, data);
        };
    }
}());
