import { Component, Input, OnChanges } from '@angular/core';
import Place from './place.model';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { ShardService } from '../../../../shared/shard/shard.service';
import { HelperShardService } from '../../../../shared/shard/helper-shard.service';

@Component({
    providers: [ ShardService ],
    selector: 'wn-grid-top-place',
    styleUrls: [ './grid-top-place.component.scss' ],
    templateUrl: 'grid-top-place.component.html'
})
export class GridTopPlaceComponent implements OnChanges {
    @Input() id: number;
    @Input() translations: any;

    public items: Place[];
    public loader: boolean = true;

    constructor(private shardService: ShardService) {
        //
    }

    ngOnChanges() {
        if (this.id !== undefined) {

            const params = {
                bit: ConfigurationService.shardsBitMask.place | ConfigurationService.shardsBitMask.placeAttraction | ConfigurationService.shardsBitMask.placeHotel,
                geoplaceId: this.id,
                page: 1,
                pageSize: 3,
                sortModeBm: ConfigurationService.sortBitMask.SCORE
            };

            this.shardService.getShardStreamByOptions(params).then((response) => {
                this.loader = false;
                this.items = response.shards.map((item) => {
                    let data = HelperShardService.initObject(new Place()) as Place;
                    HelperShardService.populate(data, item);
                    return data;
                });
            });

        }
    }
}
