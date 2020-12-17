import { Component, Input } from '@angular/core';

@Component({
    selector: 'wn-amenity-item',
    styleUrls: ['./amenity-item.component.scss'],
    templateUrl: './amenity-item.component.html'
})
export class AmenityItemComponent {
    @Input() componentData: string[];
    @Input() translations;
}
