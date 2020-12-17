import { Component, Input } from '@angular/core';
import { ActionBarItem } from '../../../modules/user.interface/action-bar/action-bar-item/action-bar-item.model';

@Component({
    selector: 'wn-travel-box-statistics',
    templateUrl: './travel-box-statistics.component.html'
})
export class TravelBoxStatisticsComponent {
    @Input() headingItem: ActionBarItem;
    @Input() mainItems: ActionBarItem[];
    @Input() asideItem?: ActionBarItem;
}
