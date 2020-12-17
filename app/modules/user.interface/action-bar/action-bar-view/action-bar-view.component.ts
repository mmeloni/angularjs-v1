import { Component, Input } from '@angular/core';
import { ActionBarItem } from '../action-bar-item/action-bar-item.model';

@Component({
    selector: 'wn-action-bar-view',
    styleUrls: [ './action-bar-view.component.scss' ],
    templateUrl: './action-bar-view.component.html'
})
export class ActionBarViewComponent {
    @Input() items: ActionBarItem[];
    @Input() actions: any[];
    @Input() transcludeFollowButton?: boolean = false;
}
