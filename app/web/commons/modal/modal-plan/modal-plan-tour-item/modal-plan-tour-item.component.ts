import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigurationService } from '../../../../../shared/config/configuration.service';
import { ImageServiceOptions } from '../../../../../shared/image/image-service-options.model';
import { TourService } from '../../../../../shared/tour/tour.service';
import { TrackingService } from '../../../../../shared/tracking/tracking.service';

@Component({
    providers: [TourService],
    selector: 'wn-modal-plan-tour-item',
    styleUrls: ['./modal-plan-tour-item.component.scss'],
    templateUrl: 'modal-plan-tour-item.component.html'
})
export class ModalPlanTourItemComponent implements OnInit {
    @Input() componentData;
    @Input() refId: number;
    @Input() buttonLabel: string;

    imageOptions: ImageServiceOptions;
    isLoadingButton: boolean;

    constructor(
        private trackingService: TrackingService,
        private tourService: TourService,
        private ngbActiveModal: NgbActiveModal
    ) {
        //
    }

    ngOnInit() {
        this.imageOptions = {
            default: ConfigurationService.defaultImages.tourPreview,
            format: 'square',
            id: this.componentData.id,
            type: 'shard'
        };
    }

    planOnTour(event: Event) {
        event.preventDefault();

        this.trackingService.trigger('planOnTour');

        this.isLoadingButton = true;

        if (this.componentData.shardsId === null) {
            this.componentData.shardsId = [];
        }

        if (this.componentData.shardsId.indexOf(this.refId) === -1) {
            this.componentData.shardsId.push(this.refId);
        }

        this.tourService.updateTour$(this.componentData).first().subscribe((response) => {
            this.isLoadingButton = false;

            this.ngbActiveModal.close({
                imageOptions: this.imageOptions,
                toParams: { tourId: response.id },
                toState: 'tour.edit.plan',
                toTitle: response.title
            });
        });
    }
}
