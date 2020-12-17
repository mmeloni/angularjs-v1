import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConfigurationService } from '../../../../../shared/config/configuration.service';
import { ImageServiceOptions } from '../../../../../shared/image/image-service-options.model';

@Component({
    selector: 'wn-modal-plan-board-item',
    styleUrls: ['./modal-plan-board-item.component.scss'],
    templateUrl: 'modal-plan-board-item.component.html'
})
export class ModalPlanBoardItemComponent implements OnInit {
    @Input() componentData;
    @Input() buttonLabel: string;
    @Input() isLoadingButton: boolean;

    @Output() plan = new EventEmitter<ImageServiceOptions>();

    imageOptions: ImageServiceOptions;

    constructor() {
        //
    }

    ngOnInit() {
        if (this.componentData.shards.length > 0 ) {
            this.imageOptions = {
                default: ConfigurationService.defaultImages.boardPreview,
                format: 'square',
                id: this.componentData.shards[0].id,
                type: 'shard'
            };
        }
    }

    planOnBoard() {
        this.plan.next(this.imageOptions);
    }
}
