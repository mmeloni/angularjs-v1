import { NgModule } from '@angular/core';
import { UserPassportComponent } from './user.passport.component';
import { CommonModule } from '@angular/common';
import { UserInterfaceModule } from '../user.interface/user.interface.module';
import { FollowService } from '../../shared/follow/follow.service';
import { ImagesProvider } from '../../providers/images.provider';
import { UserService } from '../../shared/user/user.service';

@NgModule({
    declarations: [ UserPassportComponent ],
    exports: [ UserPassportComponent ],
    imports: [ CommonModule, UserInterfaceModule ],
    entryComponents: [ UserPassportComponent ],
    providers: [ ImagesProvider, FollowService, UserService ]
})
export class UserPassportModule {
}
