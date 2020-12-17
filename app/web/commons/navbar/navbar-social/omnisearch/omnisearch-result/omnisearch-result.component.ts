import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'wn-omnisearch-result',
    templateUrl: 'omnisearch-result.component.html'
})
export class OmnisearchResultComponent implements OnInit {
    @Input() componentData: any;

    iconClasses: string[];

    constructor() {
        //
    }

    ngOnInit() {
        const tagType = this.componentData.tagType;
        this.iconClasses = [
            'wn-icon',
            `wn-icon-${tagType}`,
            `wn-icon-${tagType}-color`,
            'wn-icon-lg',
            'wn-icon-pin',
            'wn-icon-circle',
            'display-inline-block',
            'margin-right-grid'
        ];
    }
}
