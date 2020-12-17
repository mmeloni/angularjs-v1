import { NgModule } from '@angular/core';
import { NavbarModule } from '../../web/commons/navbar/navbar.module';
import { StreamPageComponent } from './stream.page.component';
import { UserService } from '../../shared/user/user.service';
import { CommonModule } from '@angular/common';
import { ShardModule } from '../shard';
import { LazyShardsGridModule } from '../lazy.shards.grid';
import { UserInterfaceModule } from '../user.interface/user.interface.module';

@NgModule({
    declarations: [ StreamPageComponent ],
    entryComponents: [ StreamPageComponent ],
    imports: [ CommonModule, NavbarModule, UserInterfaceModule, ShardModule, LazyShardsGridModule ],
    providers: [ UserService ]
})
export class StreamPageModule {
}
