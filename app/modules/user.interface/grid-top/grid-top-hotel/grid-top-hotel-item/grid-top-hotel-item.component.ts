import { Component, Input, OnChanges } from '@angular/core';
import { StateService } from 'ui-router-ng2';

@Component({
    selector: 'wn-grid-top-hotel-item',
    styleUrls: [ './grid-top-hotel-item.component.scss' ],
    templateUrl: 'grid-top-hotel-item.component.html'
})
export class GridTopHotelItemComponent implements OnChanges {
    @Input() componentData: any;
    @Input() translations: any;

    constructor(private stateService: StateService) {
        //
    }

    ngOnChanges() {
        const firstImage = this.buildPhotos(1, this.componentData.imageDetailsCount, this.componentData.imageDetailsPrefix, this.componentData.imageDetailsSuffix)[ 0 ];
        this.componentData.backgroundImage = this.callFormatToCss(firstImage);
    }

    private callFormatToCss(img) {
        return `url('${img}')`;
    }

    goToHotel(hotelId: number) {
        this.stateService.go('hotel', { hotelId: hotelId });
    }

    private buildPhotos(max, count, prefix, suffix): string[] {
        let maxImages = (count < max) ? 1 : max;
        return Array(maxImages).fill(1).map((x, i) => prefix + '' + i + '' + suffix);
    }

}
