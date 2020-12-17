import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'wn-cookie-policy',
    templateUrl: 'cookie-policy.component.html'
})

export class CookiePolicyComponent {
    @Input() labels: any;

    @Output() isAccepted = new EventEmitter<any>();

    constructor() {
        //
    }

    accept(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.isAccepted.next(null);
    }
}
