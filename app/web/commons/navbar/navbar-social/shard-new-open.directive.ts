import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { ModalService } from '../../modal/modal-commons/modal.service';

@Directive({
    selector: '[wnShardNewOpen]'
})
export class ShardNewOpenDirective {
    // wnShardNewOpen === isMultiple
    @Input() wnShardNewOpen: boolean = false;
    @Input() wnShardNewOpenMultipleParams?: any;

    constructor(
        private modalService: ModalService,
        private elementRef: ElementRef
    ) {
        elementRef.nativeElement.style.cursor = 'pointer';
    }

    @HostListener('click') onClick() {
        if (this.wnShardNewOpen === true) {
            const params = this.wnShardNewOpenMultipleParams;
            this.modalService.openShardNewMultiple(params.mainStage, params.tour, params.timelineTreeIndex);
        } else {
            this.modalService.openShardNew();
        }
    }
}
