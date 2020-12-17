import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { S3 } from 'aws-sdk';

import { FollowService } from '../../../../../shared/follow/follow.service';
import { ImageService } from '../../../../../shared/image/image.service';
import { UploadService } from '../../../../../shared/upload/upload.service';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { OnboardingCardUserComponent } from './onboarding-card-user.component';
import { OnboardingCardUser } from './onboarding-card-user.model';
import { UserInterfaceModule } from '../../../../../modules/user.interface/user.interface.module';
import { AvatarComponent } from '../../../../../modules/user.interface/_deprecated.avatar/avatar.component';
import { BackgroundImageDirective } from '../../../../../modules/user.interface/image/background-image.directive';

describe('OnboardingCardUserComponent:', () => {
    let component: OnboardingCardUserComponent;
    let fixture: ComponentFixture<OnboardingCardUserComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;
    let mockUser: OnboardingCardUser;
    let mockButtonOptions = {
        cssClasses: 'foo',
        text: 'bar'
    };

    beforeEach(() => {
        const followServiceStub = {
            follow: () => {
                return Promise.resolve(true);
            },
            toggleFollow: (targetId: number, isTargetFollowed: boolean): Promise<boolean> => {
                return Promise.resolve(!isTargetFollowed);
            },
            unfollow: () => {
                return Promise.resolve(true);
            }
        };

        const onboardingStateServiceStub = {
            updateItemsToFollowLeft: () => {
                return true;
            }
        };

        const imageServiceStub = {
            getImageFromAWS$: () => {
                // NOTE: PhantomJS does not support File constructor: http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript#comment66997550_31663645
                const mockBlob = new Blob([ 'foo bar' ]);
                return Observable.of(mockBlob as File);
            }
        };

        const uploadServiceStub = {
            getObjectFromAWS$: () => {
                const response: S3.GetObjectOutput = {};
                return Observable.of(response);
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                OnboardingCardUserComponent
            ],
            imports: [
                UserInterfaceModule
            ],
            providers: [
                { provide: FollowService, useValue: followServiceStub },
                { provide: UploadService, useValue: uploadServiceStub },
                { provide: OnboardingStateService, useValue: onboardingStateServiceStub }
            ]
        })
            .overrideComponent(AvatarComponent, {
                set: {
                    template: '<div>_deprecated.avatar</div>'
                }
            })
            .overrideDirective(BackgroundImageDirective, {
                set: {
                    providers: [
                        { provide: ImageService, useValue: imageServiceStub }
                    ]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(OnboardingCardUserComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('article'));
        htmlElement = debugElement.nativeElement;

        mockUser = {
            fullName: 'Foo de Bar',
            id: 112233,
            isFollowed: false,
            username: 'foobarest'
        };

        component.user = mockUser;
        component.translation = {
            follow: '',
            unfollow: ''
        };
        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof OnboardingCardUserComponent).toBe(true, 'should create OnboardingCardUserComponent');
    });

    it('should accept and display the info of the Place', () => {
        expect(htmlElement.textContent).toContain(mockUser.fullName);
        expect(htmlElement.textContent).toContain(mockUser.username);
    });
});
