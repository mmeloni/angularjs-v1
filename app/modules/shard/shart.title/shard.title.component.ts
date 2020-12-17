import { Component, Input } from '@angular/core';

@Component({
    selector: 'wn-shard-title',
    styleUrls: [ './shard.title.component.scss' ],
    template: `
        <div class="shard-title shard-tour-title">
            <h1 *ngIf="title">{{title}}</h1>
            <h4 *ngIf="description">{{description}}</h4>
        </div>
    `
})
export class ShardTitleComponent {
    @Input() title: string = '';
    @Input() description: string = '';
}
