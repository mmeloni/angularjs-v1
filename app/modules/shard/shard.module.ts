import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShardComponent } from './shard.component';
import { ShardBackgroundComponent } from './shard.background/shard.background.component';
import { ShardUserAvatarComponent } from './shard.user.avatar/shard.user.avatar.component';
import { ShardToolbarComponent } from './shard.toolbar/shard.toolbar.component';
import { ShardPlaceDetailsComponent } from './shard.place.details/shard.place.details.component';
import { ShardPlansNumberComponent } from './shard.plans.count/shard.plans.count.component';
import { ShardTitleComponent } from './shart.title/shard.title.component';
import { UserService } from '../../shared/user/user.service';
import { ShardsProvider } from '../../providers/shards.provider';
import { ImageService } from '../../shared/image/image.service';
import { LikesProvider } from '../../providers/likes.provider';
import { ModalService } from '../../web/commons/modal/modal-commons/modal.service';
import { UserInterfaceModule } from '../user.interface/user.interface.module';

@NgModule({
    declarations: [
        ShardComponent, // the single shard component
        ShardBackgroundComponent, // the single shard's background
        ShardUserAvatarComponent, // the single shard's user _deprecated.avatar component
        ShardToolbarComponent, // the single shard's top toolbar
        ShardPlaceDetailsComponent, // the single shard's footer place details
        ShardPlansNumberComponent, // the single shard's plans count detail
        ShardTitleComponent // the single shard title and description component
    ],
    exports: [ ShardComponent ],
    entryComponents: [ ShardComponent ],
    imports: [ CommonModule, UserInterfaceModule ],
    providers: [ UserService, ShardsProvider, ImageService, LikesProvider, ModalService ]
})
export class ShardModule {
}
