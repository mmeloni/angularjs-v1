import { Component, Input, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'ui-router-ng2';
import { ConfigurationService } from '../../../../../shared/config/configuration.service';
import { ImageServiceOptions } from '../../../../../shared/image/image-service-options.model';
import { ModalPlanComponent } from '../../../../../web/commons/modal/modal-plan/modal-plan.component';

@Component({
    selector: 'wn-grid-top-place-item',
    styleUrls: [ './grid-top-place-item.component.scss' ],
    templateUrl: 'grid-top-place-item.component.html'
})
export class GridTopPlaceItemComponent implements OnChanges {
    @Input() componentData: any;
    @Input() translations: any;

    placeBackgroundOptions: ImageServiceOptions;

    constructor(private stateService: StateService,
                private ngbModal: NgbModal) {
        this.plan = this.plan.bind(this);
    }

    ngOnChanges() {
        this.placeBackgroundOptions = {
            default: ConfigurationService.defaultImages.shard,
            format: 'square',
            id: this.componentData.id,
            type: 'shard'
        };
    }

    goToPlace(placeId: number) {
        this.stateService.go('place', { placeId: placeId }); // TODO cambiare newplace in place
    }

    plan() {
        const modalRef = this.ngbModal.open(ModalPlanComponent, { size: 'lg' });
        modalRef.componentInstance.componentData = {
            backgroundOptions: this.placeBackgroundOptions,
            id: this.componentData.id,
            shardIconClasses: 'wn-icon wn-icon-place wn-icon-place-color',
            title: this.componentData.title,
            user: null
        };
    }
}
