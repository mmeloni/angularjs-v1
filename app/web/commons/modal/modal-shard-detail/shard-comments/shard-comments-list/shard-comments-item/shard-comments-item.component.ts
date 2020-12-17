import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { ShardComment } from '../../shard-comment.model';

@Component({
    selector: 'wn-shard-comments-item',
    styleUrls: ['shard-comments-item.component.scss'],
    templateUrl: 'shard-comments-item.component.html'
})

export class ShardCommentsItemComponent implements OnInit {
    @Input() comment: ShardComment;

    commentDateAgo: string;
    commentDate: string;

    ngOnInit() {
        this.commentDateAgo = moment(this.comment['creation_date']).fromNow();
        this.commentDate = moment(this.comment['creation_date']).format('LLL');
    }
}
