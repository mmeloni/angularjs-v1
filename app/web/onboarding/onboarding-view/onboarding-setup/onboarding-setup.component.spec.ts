import { DebugElement }    from '@angular/core';
import { ComponentFixture, TestBed, async, getTestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { FacebookService } from '../../../../shared/social/facebook.service';
import { OnboardingStateService } from '../../onboarding-state.service';
import { OnboardingCardPlaceComponent } from './onboarding-card-place/onboarding-card-place.component';
import { OnboardingCardUserComponent } from './onboarding-card-user/onboarding-card-user.component';
import { OnboardingSetupComponent } from './onboarding-setup.component';

describe('OnboardingSetupComponent:', () => {
    let component: OnboardingSetupComponent;
    let fixture: ComponentFixture<OnboardingSetupComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(() => {
        const facebookServiceStub = {
            init: () => {
                return true;
            },
            inviteFriends: () => { return true; }
        };
        const onboardingStateServiceStub = {
            currentStepIndexChanged$: Observable.of(1)
        };

        TestBed.configureTestingModule({
            declarations: [
                OnboardingSetupComponent,
                OnboardingCardPlaceComponent,
                OnboardingCardUserComponent
            ],
            providers: [
                { provide: FacebookService, useValue: facebookServiceStub },
                { provide: OnboardingStateService, useValue: onboardingStateServiceStub }
            ]
        })
        .overrideComponent(OnboardingCardPlaceComponent, {
            set: {
                template: '<div>card place</div>'
            }
        })
        .overrideComponent(OnboardingCardUserComponent, {
            set: {
                template: '<div>card user</div>'
            }
        })
        .compileComponents();

        fixture = TestBed.createComponent(OnboardingSetupComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof OnboardingSetupComponent).toBe(true, 'should create OnboardingSetupComponent');
    });

    it('should init the Facebook SDK onInit', () => {
        const fbService = getTestBed().get(FacebookService);
        const spy = spyOn(fbService, 'init');
        component.translation = {
            follow: '',
            unfollow: ''
        };
        component.ngOnInit();

        expect(spy).toHaveBeenCalled();
    });

    it('should have a "inviteFriends" method to invite Facebook friends', () => {
        expect(typeof component.inviteFriends).toBe('function');

        const fbService = getTestBed().get(FacebookService);
        const spy = spyOn(fbService, 'inviteFriends');
        component.inviteFriends();

        expect(spy).toHaveBeenCalled();
    });
});
