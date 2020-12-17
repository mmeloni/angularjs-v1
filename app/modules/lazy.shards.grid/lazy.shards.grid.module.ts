import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyShardsGridComponent } from './lazy.shards.grid.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { ShardModule } from '../shard';
import { ShardsProvider } from '../../providers/shards.provider';

@NgModule({
    declarations: [ LazyShardsGridComponent ],
    exports: [ LazyShardsGridComponent ],
    entryComponents: [ LazyShardsGridComponent ],
    imports: [ CommonModule, InfiniteScrollModule, ShardModule ],
    providers: [ ShardsProvider ]
})
export class LazyShardsGridModule {
}
