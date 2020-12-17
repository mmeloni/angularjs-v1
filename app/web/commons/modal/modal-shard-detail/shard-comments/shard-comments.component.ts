import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ShardService } from '../../../../../shared/shard/shard.service';
import { User } from '../../../../../shared/user/user.model';
import { ShardComment } from './shard-comment.model';
import { ShardCommentsService } from './shard-comments.service';

@Component({
    selector: 'wn-shard-comments',
    templateUrl: 'shard-comments.component.html'
})

export class ShardCommentsComponent implements OnDestroy, OnInit {
    @Input() shardId: number;
    @Input() comments: any[];
    @Input() currentUser: User;
    @Input() labels: any;

    currentComment = new ShardComment();
    comments$: ShardComment[];

    constructor(
        private shardCommentsService: ShardCommentsService,
        private shardService: ShardService
    ) {
        this.shardCommentsService.reset();
    }

    ngOnInit() {
        this.shardService.getComments$(this.shardId, 1)
                         .first()
                         .switchMap((comments: ShardComment[]) => {
                            this.shardCommentsService.init(comments);
                            return this.shardCommentsService.comments$;
                         })
                         .subscribe((comments: ShardComment[]) => {
                             this.comments$ = comments;
                         });
    }

    addComment(newComment: ShardComment) {
        newComment.user = this.currentUser;

        this.shardCommentsService.addComment(this.shardId, newComment);
        this.currentComment = new ShardComment(); // reset the input
    }

    ngOnDestroy() {
        this.shardCommentsService.reset();
    }
}
