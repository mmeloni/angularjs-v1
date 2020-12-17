import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'wn-icon-label',
    styleUrls: [ './icon-label.component.scss' ],
    templateUrl: './icon-label.component.html'
})
export class IconLabelComponent implements OnChanges, OnInit {
    @Input() label?: string;
    @Input() hasIcon?: boolean = false;
    @Input() iconClasses: string;
    @Input() labelClasses?: string;
    @Input() cssClasses?: string = 'text-uppercase';

    ngOnInit() {
        this.labelClasses = [ 'item-label', this.labelClasses ].join(' ');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes[ 'iconClasses' ] !== undefined) {
            // TODO: replace with proper logger. But this is important so I'm leaving it here until then.
            console.warn('IconLabelComponent - [iconClasses] is deprecated. Transclude the proper <wn-icon> component and set hasIcon to true instead.');
        }
    }
}
