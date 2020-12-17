import { Component, Input, OnInit } from '@angular/core';

export type IconSize = 'sm' | '' | 'lg' | 'xl';
export type IconShape = 'square' | 'circle';
export type AnimationType = 'spin' | 'pulse';

@Component({
    selector: 'wn-icon',
    styleUrls: [ 'icon.component.scss' ],
    templateUrl: 'icon.component.html'
})
export class IconComponent implements OnInit {
    @Input() glyph: string;
    @Input() iconSize?: IconSize;
    @Input() iconShape?: IconShape;
    @Input() color?: boolean = false;
    @Input() pin?: IconShape;
    @Input() animation?: AnimationType;
    @Input() cssClasses?: string;

    iconRef: string;
    iconClasses: string[];
    spanClasses: string[];

    ngOnInit() {
        this.iconRef = [ '#', this.glyph ].join('');
        this.iconClasses = [];
        this.spanClasses = [];

        if (this.iconSize !== undefined) {
            this.iconClasses.push(this.iconSize);
        }

        if (this.iconShape !== undefined && this.pin === undefined) {
            this.iconClasses.push(this.iconShape);
        }

        if (this.color === true) {
            const colorClass = [ this.glyph, 'color' ].join('-');
            this.iconClasses.push(colorClass);
        }

        if (this.animation !== undefined) {
            this.iconClasses.push(this.animation);
        }

        if (this.cssClasses !== undefined) {
            this.iconClasses.push(this.cssClasses);
        }

        if (this.pin !== undefined) {
            this.spanClasses = [ 'pin', this.pin ];
        }
    }
}
