import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'wn-hotel-cover',
    styleUrls: ['./cover.component.scss'],
    templateUrl: 'cover.component.html'
})
export class CoverComponent implements OnChanges {

    @Input() componentData: any;
    public typeView: string = 'multiple';
    public photos: string[] = [];

    ngOnChanges() {
        if (this.componentData !== undefined) {
            const maxPhoto: number = 4;
            const photosList = this.buildPhotos(maxPhoto, this.componentData.imageDetailsCount, this.componentData.imageDetailsPrefix, this.componentData.imageDetailsSuffix);
            if (photosList.length < maxPhoto) {
                this.typeView = 'single';
            }
            this.photos = photosList.slice(0, maxPhoto).map((img) => this.formatToCss(img));
        }
    }

    private buildPhotos(max, count, prefix, suffix): string[] {
        let maxImages = (count < max) ? 1 : max;
        return Array(maxImages).fill(1).map((x, i) => prefix + '' + i + '' + suffix);
    }

    private formatToCss(img) {
        return 'url(' + img + ')';
    }

}
