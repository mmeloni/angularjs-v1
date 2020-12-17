import { Component, Input } from '@angular/core';

import { ActionBarItem } from '../action-bar-item/action-bar-item.model';

@Component({
    selector: 'wn-statistics-bar',
    templateUrl: 'statistics-bar.component.html'
})
export class StatisticsBarComponent {
    @Input() items: ActionBarItem[];
}
