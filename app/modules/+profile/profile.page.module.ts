import { NgModule } from '@angular/core';
import { ProfilePageComponent } from './profile.page.component';
import { CommonModule } from '@angular/common';
import { NavbarModule } from '../../web/commons/navbar/navbar.module';
import { UserService } from '../../shared/user/user.service';
import { ProfileToolbarComponent } from './profile.toolbar/profile.toolbar.component';
import { ProfileDynamicContentComponent } from './profile.dynamic.content/profile.dynamic.content.component';
import { LazyShardsGridModule } from '../lazy.shards.grid';
import { UserInterfaceModule } from '../user.interface/user.interface.module';
import { UserPassportModule } from '../user.passport';
import { LazyUsersListModule } from '../lazy.user.passports.list';
import { LazyBoardsGridModule } from '../lazy.boards.grid';

@NgModule({
    declarations: [
        ProfilePageComponent,
        ProfileToolbarComponent,
        ProfileDynamicContentComponent
    ],
    entryComponents: [ ProfilePageComponent ],
    imports: [
        CommonModule,
        NavbarModule,
        UserInterfaceModule,
        LazyShardsGridModule,
        LazyUsersListModule,
        UserPassportModule,
        LazyBoardsGridModule
    ],
    providers: [ UserService ]
})
export class ProfilePageModule {
}
