import {
    ApplicationRef,
    Component,
    Input,
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Toast, ToastData, ToastRef, ToastrService } from 'ngx-toastr';
import { StateService } from 'ui-router-ng2';

import { TrackingService } from '../../../../shared/tracking/tracking.service';
import { ToastActionableOptions } from './toast-actionable-options.model';

@Component({
    animations: [
        trigger('flyInOut', [
            state('inactive', style({ display: 'none', opacity: 0 })),
            state('active', style({ opacity: 1 })),
            state('removed', style({ opacity: 0 })),
            transition('inactive <=> active', animate('300ms ease-in')),
            transition('active <=> removed', animate('300ms ease-in'))
        ])
    ],
    /* tslint:disable */
    selector: '[wn-toast-actionable]',
    /* tslint:enable */
    styleUrls: [ 'toast-actionable.component.scss' ],
    templateUrl: 'toast-actionable.component.html'
})
export class ToastActionableComponent extends Toast {
    @Input() componentData: ToastActionableOptions;
    @Input() labels: any;

    constructor(
        public data: ToastData,
        protected toastrService: ToastrService,
        protected toastRef: ToastRef<any>,
        protected appRef: ApplicationRef,
        protected sanitizer: DomSanitizer,
        private stateService: StateService,
        private trackingService: TrackingService
    ) {
        super(toastrService, data, toastRef, appRef, sanitizer);
    }

    open(event: Event) {
        switch (this.componentData.toState) {
            case 'board.view':
                this.trackingService.trigger('redirectFromToastToBoard');
                break;
            case 'tour.edit.plan':
                this.trackingService.trigger('redirectFromToastToTour');
                break;
            default:
                break;
        }
        this.stateService.go(this.componentData.toState, this.componentData.toParams);

        event.preventDefault();
    }
}
