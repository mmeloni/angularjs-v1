import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import Shard from './shard.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { HelperShardService } from '../../../../shared/shard/helper-shard.service';

@Component({
    selector: 'wn-grid-top-shard',
    styleUrls: ['./grid-top-shard.component.scss'],
    templateUrl: 'grid-top-shard.component.html'
})
export class GridTopShardComponent implements OnChanges {
    @Input() id: number;
    @Input() subtitle: string;
    @Input() translations: any;

    public items: Shard[];
    public loader: boolean = true;
    public hiddenComponent = true;

    constructor(private shardService: ShardService, private changeDetectorRef: ChangeDetectorRef) {
        //
    }

    ngOnChanges() {
        if (this.id !== undefined ) {

            const params = {
                bit: ConfigurationService.shardsBitMask.stage | ConfigurationService.shardsBitMask.hotel | ConfigurationService.shardsBitMask.attraction,
                page: 1,
                pageSize: 3,
                placeId: this.id,
                sortModeBm: ConfigurationService.sortBitMask.SCORE
            };

            this.shardService.getShardStreamByOptions(params).then((response) => {
                this.loader = false;
                this.items = response.shards.map( (item) => {
                    let data = HelperShardService.initObject(new Shard()) as Shard;
                    HelperShardService.populate(data, item);
                    return data;
                });

                this.hiddenGridIsEmpty();
                this.changeDetectorRef.detectChanges();

            });
        }
    }

    private hiddenGridIsEmpty() {
        this.hiddenComponent = (this.items !== undefined && this.items.length === 0);
    }

}
