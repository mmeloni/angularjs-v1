import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { State, StateService } from 'ui-router-ng2';

@Component({
    selector: 'wn-action-bar-item',
    styleUrls: ['./action-bar-item.component.scss'],
    templateUrl: './action-bar-item.component.html'
})
export class ActionBarItemComponent implements OnChanges {
    @Input() label: string;
    @Input() hasIcon?: boolean = false;
    @Input() iconClasses?: string = '';
    @Input() value: string;
    @Input() state?: State = null;
    @Input() cssClasses?: string;

    constructor(
        private stateService: StateService
    ) {
        //
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['iconClasses'] !== undefined) {
            // TODO: replace with proper logger. But this is important so I'm leaving it here until then.
            console.warn('ActionBarItemComponent - [iconClasses] is deprecated. Transclude the proper wn-icon component and set hasIcon to true instead.');
        }
    }

    goToState(event: Event) {
        event.preventDefault();

        if (this.state !== null) {
            this.stateService.go(this.state.name, this.state.params);
        }
    }
}
