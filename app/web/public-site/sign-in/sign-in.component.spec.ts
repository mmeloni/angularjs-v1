import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AuthenticationService } from '../../../shared/authentication/authentication.service';
import { SessionService } from '../../../shared/session/session.service';
import { FacebookService } from '../../../shared/social/facebook.service';
import { AuthorInfoComponent } from '../author-info/author-info.component';
import { FacebookAuthenticationComponent } from '../facebook-authentication/facebook-authentication.component';
import { HelperPublicSiteService } from '../helper-public-site.service';
import { SignInComponent } from './sign-in.component';
import { HelperNotificationService } from '../../commons/navbar/notification/helper-notification.service';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';

describe('SignInComponent:', () => {
    let component: SignInComponent;
    let fixture: ComponentFixture<SignInComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const authenticationServiceStub = {};
    const sessionServiceStub = {};
    const facebookServiceStub = {};
    const helperPublicSiteService = {};
    const helperNotificationService = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SignInComponent,
                FacebookAuthenticationComponent,
                AuthorInfoComponent
            ],
            imports: [
                UserInterfaceModule,
                FormsModule
            ],
            providers: [
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: FacebookService, useValue: facebookServiceStub },
                { provide: HelperPublicSiteService, useValue: helperPublicSiteService },
                { provide: HelperNotificationService, useValue: helperNotificationService }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignInComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.all());
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof SignInComponent).toBe(true, 'should create SignInComponent');
    });
});
