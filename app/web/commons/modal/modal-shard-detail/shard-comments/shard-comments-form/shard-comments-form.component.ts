import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ShardComment } from '../shard-comment.model';

@Component({
    selector: 'wn-shard-comments-form',
    styleUrls: ['shard-comments-form.component.scss'],
    templateUrl: 'shard-comments-form.component.html'
})

export class ShardCommentsFormComponent implements OnChanges {
    @Input() userId: number;
    @Input() labels: any;
    @Input() comment: ShardComment;

    @Output() newComment = new EventEmitter<ShardComment>();

    model: any;

    constructor() {
        //
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['comment'] !== undefined) {
            this.model = {
                comment: changes['comment'].currentValue.text
            };
        }
    }

    onSubmit(event: Event) {
        event.preventDefault();

        let newComment = new ShardComment();
        newComment.text = this.model.comment;

        this.newComment.next(newComment);
    }
}
