import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { TrackingService } from '../../../../../shared/tracking/tracking.service';

@Component({
    selector: 'wn-modal-plan-form',
    styleUrls: ['./modal-plan-form.component.scss'],
    templateUrl: 'modal-plan-form.component.html'
})
export class ModalPlanFormComponent implements OnChanges {
    @Input() translations: any;
    @Input() title: string;
    @Input() initialName: string;
    @Input() componentData: string[];
    @Input() isLoadingButton: boolean;

    @Output() cancel = new EventEmitter<void>();
    @Output() submit = new EventEmitter<any>();

    model: any = {
        description: '',
        title: ''
    };

    constructor(
        private trackingService: TrackingService
    ) {
        //
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['initialName'] !== undefined) {
            this.model.title = changes['initialName'].currentValue;
        }
    }

    onSubmit(event: Event) {
        event.preventDefault();

        this.trackingService.trigger('confirmPlan');

        this.submit.next(this.model);
    }

    onCancel(event: Event) {
        event.preventDefault();

        this.trackingService.trigger('cancelPlan');

        this.cancel.next();
    }
}
