import { Component, Input, OnInit } from '@angular/core';
import { Shard } from '../../shard/types';
import { ImagesProvider } from '../../../providers/images.provider';
import getShardIconName from '../../shard/utils/getShardIconName';

@Component({
    selector: 'wn-board-shard-tile',
    styleUrls: [ './board.shard.tile.component.scss' ],
    templateUrl: './board.shard.tile.component.html'
})
export class BoardShardTileComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    @Input() shard: Shard;

    public imageUrl: string;
    public imageFullyLoaded: boolean = false;
    public imageLoadingError: boolean = false;
    public iconGlyph: string;

    constructor(private imagesProvider: ImagesProvider) {
    }

    ngOnInit() {
        const id: number = this.shard.masterId || this.shard.id;
        this.iconGlyph = getShardIconName(this.shard.bit);

        this.imagesProvider.getShardItemBackground(id).subscribe((url: string) => {
            this.imageUrl = url;
        });
    }
}
