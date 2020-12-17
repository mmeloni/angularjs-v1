import { Component, Input } from '@angular/core';

@Component({
    selector: 'wn-modal-plan-suggested',
    styleUrls: ['./modal-plan-suggested.component.scss'],
    templateUrl: './modal-plan-suggested.component.html'
})
export class ModalPlanSuggestedComponent {
    @Input() title: string;
    @Input() componentData: string[];
    @Input() eventClick: Function;

    setTitleToNew(event, label) {
        this.eventClick(event, label);
    }

}
