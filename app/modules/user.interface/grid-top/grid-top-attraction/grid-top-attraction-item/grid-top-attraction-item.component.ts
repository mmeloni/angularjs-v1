import { Component, Input, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'ui-router-ng2';
import { ImageServiceOptions } from '../../../../../shared/image/image-service-options.model';
import { ConfigurationService } from '../../../../../shared/config/configuration.service';
import { ModalPlanComponent } from '../../../../../web/commons/modal/modal-plan/modal-plan.component';

@Component({
    selector: 'wn-grid-top-attraction-item',
    styleUrls: [ './grid-top-attraction-item.component.scss' ],
    templateUrl: 'grid-top-attraction-item.component.html'
})
export class GridTopAttractionItemComponent implements OnChanges {
    @Input() componentData: any;
    @Input() translations: any;

    attractionBackgroundOptions: ImageServiceOptions;

    constructor(private stateService: StateService,
                private ngbModal: NgbModal) {
        this.plan = this.plan.bind(this);
    }

    ngOnChanges() {
        this.attractionBackgroundOptions = {
            default: ConfigurationService.defaultImages.shard,
            format: 'square',
            id: this.componentData.id,
            type: 'shard'
        };
    }

    goToPlace(placeId: number) {
        this.stateService.go('attraction', { placeId: placeId }); // TODO cambiare newplace in place
    }

    plan() {
        const modalRef = this.ngbModal.open(ModalPlanComponent, { size: 'lg' });
        modalRef.componentInstance.componentData = {
            backgroundOptions: this.attractionBackgroundOptions,
            id: this.componentData.id,
            shardIconClasses: 'wn-icon wn-icon-attraction wn-icon-attraction-color',
            title: this.componentData.title,
            user: null
        };
    }
}
