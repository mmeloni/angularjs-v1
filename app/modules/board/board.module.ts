import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { ImagesProvider } from '../../providers/images.provider';
import { BoardCoverComponent } from './board.cover/board.cover.component';
import { UserInterfaceModule } from '../user.interface/user.interface.module';
import { BoardContentComponent } from './board.content/board.content.component';
import { BoardShardTileComponent } from './board.shard.tile/board.shard.tile.component';

@NgModule({
    declarations: [
        BoardComponent,
        BoardCoverComponent,
        BoardContentComponent,
        BoardShardTileComponent
    ],
    exports: [ BoardComponent ],
    entryComponents: [ BoardComponent ],
    imports: [ UserInterfaceModule, CommonModule ],
    providers: [ ImagesProvider ]
})
export class BoardModule {
}
