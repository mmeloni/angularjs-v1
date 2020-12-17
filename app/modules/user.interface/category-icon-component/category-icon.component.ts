import { findKey } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../shared/config/configuration.service';

@Component({
    selector: 'wn-category-icon',
    templateUrl: './category-icon.component.html'
})
export class CategoryIconComponent implements OnInit {
    @Input() type: string;
    @Input() cssClasses: string;
    typeIcon: string;

    ngOnInit() {
        const types = ConfigurationService.shardsBitMask;
        this.typeIcon = findKey(types, (type) => type === this.type);

        if (this.typeIcon === 'placeAttraction') {
            this.typeIcon = 'attraction';
        }
    }

}
