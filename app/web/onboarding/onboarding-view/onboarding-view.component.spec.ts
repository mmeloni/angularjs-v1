import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { StateService } from 'ui-router-ng2';

import { FacebookService } from '../../../shared/social/facebook.service';
import { UserService } from '../../../shared/user/user.service';
import { NavbarOnboardingComponent } from '../navbar-onboarding/navbar-onboarding.component';
import { OnboardingStateService } from '../onboarding-state.service';
import { OnboardingSetupComponent } from './onboarding-setup/onboarding-setup.component';
import { OnboardingViewComponent } from './onboarding-view.component';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';

describe('OnboardingViewComponent:', () => {
    let component: OnboardingViewComponent;
    let fixture: ComponentFixture<OnboardingViewComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(async(() => {
        const facebookServiceStub = {
            init: () => {
                return true;
            },
            inviteFriends: () => {
                return true;
            }
        };

        const onboardingStateServiceStub = {
            currentStepIndexChanged$: Observable.of(1),
            currentStepUpdated$: Observable.of({
                imgUrl: 'foo',
                index: 0,
                next: {
                    text: 'bar'
                },
                text: 'baz',
                title: 'foobar'
            }),
            init: () => {
                return true;
            },
            itemsToFollowLeft$: Observable.of(1),
            resetCurrentStep: () => {
                return true;
            },
            resetItemsToFollowLeft: () => {
                return true;
            }
        };

        const stateServiceStub = {
            go: () => {
                return true;
            }
        };

        const userServiceStub = {};

        TestBed.configureTestingModule({
            declarations: [
                NavbarOnboardingComponent,
                OnboardingSetupComponent,
                OnboardingViewComponent
            ],
            imports: [
                UserInterfaceModule
            ],
            providers: [
                { provide: OnboardingStateService, useValue: onboardingStateServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: FacebookService, useValue: facebookServiceStub },
                { provide: UserService, useValue: userServiceStub }
            ]
        })
            .overrideComponent(NavbarOnboardingComponent, {
                set: {
                    template: '<nav>nav</nav>'
                }
            })
            .overrideComponent(OnboardingSetupComponent, {
                set: {
                    template: '<div>setup</div>'
                }
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingViewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div'));
        htmlElement = debugElement.nativeElement;

        const mockStepStrings = {
            itemsLeft: {
                place: 'foo',
                user: 'bar'
            },
            steps: [ { title: 'foo' } ]
        };
        component.translationResolved = {
            onboarding: {
                setup: mockStepStrings,
                welcome: mockStepStrings
            }
        };
    });

    it('should work', () => {
        expect(component instanceof OnboardingViewComponent).toBe(true, 'should create OnboardingViewComponent');
    });

    it('should contain a navbar component', () => {
        expect(htmlElement.querySelector('wn-navbar-onboarding')).not.toBeNull();
    });

    describe('When "viewMode" equals "welcome":', () => {
        beforeEach(() => {
            component.viewMode = 'welcome';
            fixture.detectChanges();
        });

        it('should include a <img>', () => {
            expect(htmlElement.querySelector('img')).not.toBeNull();
        });

        it('should NOT include a onboarding-setup component', () => {
            expect(htmlElement.querySelector('wn-onboarding-setup')).toBeNull();
        });
    });

    describe('When "viewMode" equals "setup":', () => {
        beforeEach(() => {
            component.viewMode = 'setup';
            component.placesResolved = [ { place: 'place' } ];
            component.usersResolved = [ { user: 'user' } ];

            fixture.detectChanges();
        });

        it('should include a onboarding-setup component', () => {
            expect(htmlElement.querySelector('wn-onboarding-setup')).not.toBeNull();
        });

        // TODO: learn how to use the Observable stateService stub
        // it('should empty the "itemsToFollow" array on the last step', () => {
        //     const lastStepIndex = 2;
        //     component.currentStep.index = 0;
        //     fixture.detectChanges();

        //     expect(component.itemsToFollow).not.toEqual([]);

        //     component.currentStep.index = lastStepIndex;
        //     fixture.detectChanges();
        //     expect(component.itemsToFollow).toEqual([]);
        // });
    });
});
