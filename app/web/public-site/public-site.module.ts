import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UIRouterModule } from 'ui-router-ng2';

import { AuthorInfoComponent } from './author-info/author-info.component';
import { FacebookAuthenticationComponent } from './facebook-authentication/facebook-authentication.component';
import { HelperPublicSiteService } from './helper-public-site.service';
import { CookiePolicyComponent } from './home-public/cookie-policy/cookie-policy.component';
import { HomePublicComponent } from './home-public/home-public.component';
import { TestimonialComponent } from './home-public/testimonial/testimonial.component';
import { PasswordRecoveryCodeCheckViewComponent } from './password-recovery/password-recovery-code-check-view/password-recovery-code-check-view.component';
import { PasswordRecoveryNewPasswordViewComponent } from './password-recovery/password-recovery-new-password-view/password-recovery-new-password-view.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserInterfaceModule } from '../../modules/user.interface/user.interface.module';
import { TopBannerModule } from '../top-banner/top-banner.module';

@NgModule({
    declarations: [
        HomePublicComponent,
        TestimonialComponent,
        SignInComponent,
        SignUpComponent,
        FacebookAuthenticationComponent,
        CookiePolicyComponent,
        AuthorInfoComponent,
        PasswordRecoveryComponent,
        PasswordRecoveryCodeCheckViewComponent,
        PasswordRecoveryNewPasswordViewComponent
    ],
    entryComponents: [
        HomePublicComponent,
        SignInComponent,
        SignUpComponent,
        PasswordRecoveryComponent,
        PasswordRecoveryCodeCheckViewComponent,
        PasswordRecoveryNewPasswordViewComponent
    ],
    imports: [
        CommonModule,
        UserInterfaceModule,
        NgbModule,
        UIRouterModule,
        FormsModule,
        TopBannerModule
    ],
    providers: [
        HelperPublicSiteService
    ]
})
export class PublicSiteModule { }
