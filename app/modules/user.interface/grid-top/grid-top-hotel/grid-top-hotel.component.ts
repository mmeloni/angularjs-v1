import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import Hotel from './hotel.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { HelperShardService } from '../../../../shared/shard/helper-shard.service';

@Component({
    selector: 'wn-grid-top-hotel',
    styleUrls: [ './grid-top-hotel.component.scss' ],
    templateUrl: 'grid-top-hotel.component.html'
})
export class GridTopHotelComponent implements OnChanges {
    @Input() id: number;
    @Input() subtitle: string;
    @Input() translations: any;

    public items: Hotel[];
    public loader: boolean = true;
    public hiddenComponent = true;

    constructor(private shardService: ShardService, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnChanges() {
        if (this.id !== undefined) {

            const params = {
                bit: ConfigurationService.shardsBitMask.placeHotel,
                geoplaceId: this.id,
                page: 1,
                pageSize: 3,
                sortModeBm: ConfigurationService.sortBitMask.SCORE
            };

            this.shardService.getShardStreamByOptions(params).then((response) => {
                this.loader = false;
                this.items = response.shards.map((item) => {
                    let data = HelperShardService.initObject(new Hotel()) as Hotel;
                    HelperShardService.populate(data, item);
                    return data;
                });

                this.hiddenGridIsEmpty();
                this.changeDetectorRef.detectChanges();
            });

        }
    }

    private hiddenGridIsEmpty() {
        this.hiddenComponent = (this.items !== undefined && this.loader === true && this.items.length === 0);
    }
}
