import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'wn-modal-button-dismiss',
    styleUrls: [ './modal-button-dismiss.component.scss' ],
    templateUrl: 'modal-button-dismiss.component.html'
})
export class ModalButtonDismissComponent {

    constructor(private ngbActiveModal: NgbActiveModal) {
    }

    dismiss() {
        this.ngbActiveModal.dismiss();
    }
}
