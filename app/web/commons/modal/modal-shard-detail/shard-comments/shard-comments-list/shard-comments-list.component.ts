import { Component, Input } from '@angular/core';

import { ShardComment } from '../shard-comment.model';

@Component({
    selector: 'wn-shard-comments-list',
    styleUrls: ['shard-comments-list.component.scss'],
    templateUrl: 'shard-comments-list.component.html'
})

export class ShardCommentsListComponent {
    @Input() comments: ShardComment[];
}
