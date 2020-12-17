import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IconSize } from '../icon/icon.component';

export type ButtonType = 'button' | 'submit';

@Component({
    selector: 'wn-button',
    styleUrls: ['./button.component.scss'],
    templateUrl: './button.component.html'
})
export class ButtonComponent implements OnChanges, OnInit {
    @Input() buttonType: ButtonType = 'button';
    @Input() label: string;
    @Input() iconClasses: string; // deprecated
    @Input() cssClasses?: string;
    @Input() size: string;
    @Input() disabled: boolean = false;
    @Input() isLoading: boolean = false;
    @Input() isLoadingReplace: boolean = false;
    @Input() status?: string; // deprecated
    @Input() action?: any; // deprecated
    @Input() loader: string; // deprecated

    loadingIconSize: IconSize = '';
    showMainIcon: boolean = true;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['status'] !== undefined) {
            // TODO: replace with proper logger. But this is important so I'm leaving it here until then.
            console.warn('ButtonComponent - [status] is deprecated. Use the new [cssClasses] instead.');
            this.cssClasses = ['btn', this.status].join(' ');
        }

        if (changes['loader'] !== undefined) {
            // TODO: replace with proper logger. But this is important so I'm leaving it here until then.
            console.warn('ButtonComponent - [loader] is deprecated. Use the new [loading] instead.');
            switch (this.loader) {
                case 'false':
                case '':
                case undefined:
                case null:
                    this.isLoading = false;
                    break;
                default:
                    this.isLoading = true;
            }
        }

        if (changes['iconClasses'] !== undefined) {
            // TODO: replace with proper logger. But this is important so I'm leaving it here until then.
            console.warn('ButtonComponent - [iconClasses] is deprecated. Transclude the new <wn-icon> component instead.');
        }

        if (changes['isLoading'] !== undefined && changes['isLoading'].currentValue === true && this.isLoadingReplace === true) {
            this.label = null;
            this.showMainIcon = false;
        } else if (changes['isLoading'] !== undefined && changes['isLoading'].currentValue === false) {
            this.showMainIcon = true;
        }
    }

    ngOnInit() {
        if (this.cssClasses !== undefined) {
            this.loadingIconSize = this.getLoadingIconSizeByButtonSize(this.cssClasses); // This should be getting `this.buttonSize`, and button size shouldn't be related to the Bootstrap;
        }
    }

    onClick(event: Event) {
        if (this.isLoading === true) { // prevent re-fireing the upstream click event if currently loading
            event.stopPropagation();
        } else if (this.action !== undefined) { // preserve deprecated [action] Input
            // TODO: replace with proper logger. But this is important so I'm leaving it here until then.
            console.warn('ButtonComponent - [action] is deprecated. Use a simple (click) instead.');
            event.stopPropagation();
            const target = event.target || event.srcElement || event.currentTarget;
            this.action();
        }
    }

    private getLoadingIconSizeByButtonSize(cssClasses: string): IconSize {
        let loadingIconSize: IconSize = '';
        if (cssClasses.indexOf('btn-xs') !== -1 || cssClasses.indexOf('btn-sm') !== -1) {
            loadingIconSize = 'sm';
        } else if (cssClasses.indexOf('btn-lg') !== -1) {
            loadingIconSize = 'lg';
        }

        return loadingIconSize;
    }

}
