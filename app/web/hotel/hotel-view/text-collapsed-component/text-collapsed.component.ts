import { Component, Input, OnChanges, OnInit, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'wn-text-collapsed',
    styleUrls: ['./text-collapsed.component.scss'],
    templateUrl: './text-collapsed.component.html'
})
export class TextCollapsedComponent implements OnInit, OnChanges {

    @Input() text: string;
    @Input() limit: number;
    @Input() translation: any; // x read more read less

    textTruncated: string = '';
    textCompleted: string = '';
    isLong: boolean = false;
    showAll: boolean = false;

    private limitDefault = 290;
    private limitWord;

    constructor(private _sanitizer: DomSanitizer) {
        //
    }

    ngOnInit() {
        this.limitWord = (!this.limit) ? this.limitDefault : this.limit;
    }

    ngOnChanges() {
        this.textTruncated = this._sanitizer.sanitize(SecurityContext.HTML, this.truncate(this.text, this.limitWord, true));
    }

    eventShowAll(e) {
        e.preventDefault();
        this.showAll = !this.showAll;
    }

    private truncate(text, n, useWordBoundary) {
        let isTooLong = text.length > n,
            s_ = isTooLong ? text.substr(0, n - 1) : text;
        s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
        this.isLong = isTooLong;
        return isTooLong ? s_ + ' &hellip;' : s_;
    }
}
