import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'wn-star-rating',
    styleUrls: [ './star-rating.component.scss' ],
    templateUrl: './star-rating.component.html'
})
export class StarRatingComponent implements OnChanges {
    @Input() ratingValue: string;
    public totalStars;

    ngOnChanges() {
        const max: number = 5;
        const min: number = 0;
        const radix: number = 10;

        let stars: number = parseInt(this.ratingValue || '0', radix);

        if (stars < min || stars > max || this.ratingValue.length > 1) {
            stars = min;
        }
        this.totalStars = new Array(stars);
    }
}
