import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LikesProvider } from '../../../providers/likes.provider';
import { ILikeStatus, Shard, ShardType } from '../types';
import { ModalService } from '../../../web/commons/modal/modal-commons/modal.service';

@Component({
    selector: 'wn-shard-toolbar',
    styleUrls: [ './shard.toolbar.component.scss' ],
    templateUrl: './shard.toolbar.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ShardToolbarComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;
    public labels: any;

    @Input() shard: Shard;
    @Input() liked: boolean;

    public hearthBeat: boolean = false;
    public showPlanButton: boolean = true;
    public isDraft: boolean = false;

    constructor(private likesProvider: LikesProvider, private modalsProvider: ModalService) {
    }

    ngOnInit() {
        this.hearthBeat = this.liked;

        this.showPlanButton = this.shard.bit !== ShardType.tour;

        /* FIXME: please, find a better way to translate the application and remove this property */
        this.labels = {
            plan: this.translations.plan
        };

        if (this.shard.status && this.shard.status === 1) {
            this.isDraft = true;
        }
    }

    // FIXME: this could became a single LikeButtonComponent
    public likeHandler(): void {
        const { id } = this.shard;

        this.likesProvider.toggleLike(id).subscribe(({ status }: ILikeStatus) => {
            this.liked = status;

            this.hearthBeat = status;
        });
    }

    public planHandler(): void {
        this.modalsProvider.openPlan(this.shard);
    }
}
