import { Component, Input, OnInit } from '@angular/core';
import { Shard } from '../../shard/types';
import { ImagesProvider } from '../../../providers/images.provider';
import { ConfigurationService } from '../../../shared/config/configuration.service';

@Component({
    selector: 'wn-board-cover',
    styleUrls: [ './board.cover.component.scss' ],
    template: `
        <div class="board-cover"
             [ngClass]="{'image-fully-loaded': showImage, 'loading-error':imageLoadingError }">
            <figure>
                <img class="board-background-image" [src]="imageUrl"
                     [ngClass]="{visible: showImage}" />
                <div *ngIf="showImage" class="board-background-overlay"></div>
            </figure>
            <p class="board-title">
                <wn-icon [glyph]="'board'"></wn-icon>
                {{title}}
            </p>
        </div>
    `
})
export class BoardCoverComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    @Input() shards: Shard[];

    @Input() title: string = '';

    public hasCover: boolean = false;
    public showImage: boolean = false;
    public imageLoadingError: boolean = false;
    public imageUrl: string;

    constructor(private imagesProvider: ImagesProvider) {
    }

    ngOnInit() {
        this.hasCover = this.shards && this.shards.length > 0;

        // take the first shard cover
        if (this.hasCover) {
            const { shardsBitMask } = ConfigurationService;
            const firstShard: Shard = this.shards[ 0 ];
            let shardId: number;

            switch (firstShard.bit) {
                default:
                case shardsBitMask.stage:
                case shardsBitMask.hotel:
                case shardsBitMask.attraction:
                    shardId = firstShard.masterId;
                    break;
                case shardsBitMask.place:
                case shardsBitMask.placeHotel:
                case shardsBitMask.placeAttraction:
                    shardId = firstShard.id;
                    break;
            }

            this.getImageData(shardId);
        }
    }

    getImageData(masterId: number) {
        this.imagesProvider.getShardItemBackground(masterId, 'double').subscribe((url: string) => {
            this.imageUrl = url;
            this.showImage = true;
        });
    }
}
