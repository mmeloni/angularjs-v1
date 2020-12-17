import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { UserPassportModule } from '../user.passport';
import { UserService } from '../../shared/user/user.service';
import { LazyUserPassportListComponent } from './lazy.user.passport.list.component';

@NgModule({
    declarations: [ LazyUserPassportListComponent ],
    exports: [ LazyUserPassportListComponent ],
    entryComponents: [ LazyUserPassportListComponent ],
    imports: [ CommonModule, InfiniteScrollModule, UserPassportModule ],
    providers: [ UserService ]
})
export class LazyUsersListModule {
}
