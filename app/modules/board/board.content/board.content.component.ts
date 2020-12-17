import { Component, Input, OnInit } from '@angular/core';
import { ContentSize } from '../types';
import { Shards } from '../../shard/types';

@Component({
    selector: 'wn-board-content',
    styleUrls: [ './board.content.component.scss' ],
    templateUrl: './board.content.component.html'
})
export class BoardContentComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    @Input() shards: Shards;

    public contentType: ContentSize = ContentSize.none;
    public contentTypes = ContentSize;
    public firs4Shards: Shards;

    ngOnInit() {
        this.firs4Shards = this.shards.slice(0, 4);

        switch (this.shards.length) {
            case 0:
                this.contentType = ContentSize.none;
                break;
            case 1:
                this.contentType = ContentSize.single;
                break;
            case 2:
                this.contentType = ContentSize.double;
                break;
            case 3:
                this.contentType = ContentSize.triple;
                break;
            default:
                this.contentType = ContentSize.fourOrMore;
                break;
        }
    }
}
