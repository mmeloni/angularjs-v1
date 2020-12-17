import { Injectable } from '@angular/core';

declare const hj: any;
declare const webpackGlobalVars: any;

@Injectable()
export class TrackingService {
    tracker: any;

    constructor() {
        if (webpackGlobalVars.env === 'prod') {
            this.tracker = hj;
        } else {
            this.tracker = (trigger, data) => {
                console.warn('Hotjar not in production environment, with trigger and data:', trigger, data);
            };
        }
    }

    /**
     * trigger the tracking method
     * @param {String} trackingService the name of the invoked service
     */
    trigger(trackingService: String): void {
        this.tracker('trigger', trackingService);
    }

    /**
     * trigger the page visit event.
     * @param {String} page the name of the visited page. The passed value should match the value exposed on the HJ panel <i>without</i> <code>/</code>
     */
    view(page: String): void {
        this.tracker('vpv', '/' + page);
    }
}

export let trackingServiceInjectables: any[] = [{
    provide: TrackingService,
    useClass: TrackingService
}];
