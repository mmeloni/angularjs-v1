import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'wn-shard-plans-count',
    styleUrls: [ './shard.plans.count.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="shard-plans-count" *ngIf="count > 0">
            <wn-icon [glyph]="'plan-outline'"></wn-icon>
            <p>{{count}}</p>
        </div>
    `
})
export class ShardPlansNumberComponent {
    /**
     * the 'count' import represent the number of plans made by this shard.
     * @type {number}
     */
    @Input() count: number;
}
