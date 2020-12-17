import { Component, Input, OnChanges } from '@angular/core';
import Attraction from './attraction.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { HelperShardService } from '../../../../shared/shard/helper-shard.service';

@Component({
    providers: [ ShardService ],
    selector: 'wn-grid-top-attraction',
    styleUrls: [ './grid-top-attraction.component.scss' ],
    templateUrl: 'grid-top-attraction.component.html'
})
export class GridTopAttractionComponent implements OnChanges {
    @Input() id: number;
    @Input() translations: any;

    public items: Attraction[];
    public loader: boolean = true;
    public hiddenComponent = true;

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
                    let data = HelperShardService.initObject(new Attraction()) as Attraction;
                    HelperShardService.populate(data, item);
                    return data;
                });

                this.hiddenGridIsEmpty();
            });

        }
    }

    private hiddenGridIsEmpty() {
        this.hiddenComponent = (this.items !== undefined && this.loader === true && this.items.length === 0);
    }
}
