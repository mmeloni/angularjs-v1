import { Component, Input } from '@angular/core';

@Component({
    selector: 'wn-amenities',
    styleUrls: ['./amenities.component.scss'],
    templateUrl: 'amenities.component.html'
})
export class AmenitiesComponent {
    @Input() componentData: any[];
    @Input() labels: any;
}
