import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

import { ShardService } from '../../../../../shared/shard/shard.service';
import { ShardComment } from './shard-comment.model';

@Injectable()
export class ShardCommentsService implements OnDestroy {
    comments$: Observable<ShardComment[]>;

    private commentsSource: BehaviorSubject<ShardComment[]>;
    private comments: ShardComment[];
    private subscription: Subscription;

    constructor(
        private shardService: ShardService
    ) {
        this.comments = [];

        this.commentsSource = new BehaviorSubject(this.comments);
        this.comments$ = this.commentsSource.asObservable();
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }

    init(comments: ShardComment[]) {
        this.comments = _.cloneDeep(comments);
        this.commentsSource.next(this.comments);
    }

    reset() {
        this.comments = [];
    }

    addComment(currentShardId: number, newComment: ShardComment) {
        const newCommentIndex = this.comments.push(newComment) - 1;
        this.commentsSource.next(this.comments);

        this.subscription = this.shardService.addComment$(currentShardId, newComment.text).subscribe(() => {
            // all good
        }, (error) => {
            _.remove(this.comments, (value, index, array) => {
                return index === newCommentIndex;
            });
            this.commentsSource.next(this.comments);
        });
    }
}
