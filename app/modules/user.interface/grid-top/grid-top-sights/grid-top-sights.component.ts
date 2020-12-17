import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import Attraction from '../grid-top-attraction/attraction.model';
import Hotel from '../grid-top-hotel/hotel.model';
import Place from '../grid-top-place/place.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { HelperShardService } from '../../../../shared/shard/helper-shard.service';

@Component({
    providers: [ ShardService ],
    selector: 'wn-grid-top-sights',
    styleUrls: [ './grid-top-sights.component.scss' ],
    templateUrl: 'grid-top-sights.component.html'
})
export class GridTopSightsComponent implements OnChanges {
    @Input() id: number;
    @Input() subtitle: string;
    @Input() translations: any;

    public items: any[];
    public loader: boolean = true;
    public hiddenComponent = true;

    constructor(private shardService: ShardService,
                private changeDetectorRef: ChangeDetectorRef) {
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
                const allTypeShards = {
                    Place: Place,
                    PlaceAttraction: Attraction,
                    PlaceHotel: Hotel
                };

                this.items = response.shards.map((item) => {
                    // load factory component
                    let data = HelperShardService.initObject(new (allTypeShards as any)[ item.type ]());
                    HelperShardService.populate(data, item);
                    return data;
                });

                this.changeDetectorRef.detectChanges();
                this.hiddenGridIsEmpty();
            });

        }

    }

    private hiddenGridIsEmpty() {
        this.hiddenComponent = (this.items !== undefined && this.loader === true && this.items.length === 0);
    }

}
