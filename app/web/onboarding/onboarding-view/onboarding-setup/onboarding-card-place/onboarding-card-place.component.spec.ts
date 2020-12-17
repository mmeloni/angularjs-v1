import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StateService } from 'ui-router-ng2';

import { FollowService } from '../../../../../shared/follow/follow.service';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { OnboardingCardPlaceComponent } from './onboarding-card-place.component';
import { OnboardingCardPlace } from './onboarding-card-place.model';
import { UserInterfaceModule } from '../../../../../modules/user.interface/user.interface.module';

describe('OnboardingCardPlaceComponent:', () => {
    let component: OnboardingCardPlaceComponent;
    let fixture: ComponentFixture<OnboardingCardPlaceComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;
    let mockPlace: OnboardingCardPlace;
    let mockButtonOptions = {
        cssClasses: 'foo',
        text: 'bar'
    };

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

    const stateServiceStub = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OnboardingCardPlaceComponent
            ],
            imports: [
                UserInterfaceModule
            ],
            providers: [
                { provide: FollowService, useValue: followServiceStub },
                { provide: OnboardingStateService, useValue: onboardingStateServiceStub },
                { provide: StateService, useValue: stateServiceStub }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OnboardingCardPlaceComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('article'));
        htmlElement = debugElement.nativeElement;

        mockPlace = {
            countFollower: 10,
            countLike: 30,
            countPlan: 20,
            iconClasses: 'bar',
            id: 112233,
            isFollowed: false,
            title: 'foo'
        };

        component.place = mockPlace;
        component.translation = {
            follow: '',
            unfollow: ''
        };
        fixture.detectChanges();
    }));

    it('should work', () => {
        expect(component instanceof OnboardingCardPlaceComponent).toBe(true, 'should create OnboardingCardPlaceComponent');
    });

    it('should accept and display the info of the Place', () => {
        expect(htmlElement.textContent).toContain(mockPlace.title);
        expect(htmlElement.textContent).toContain(mockPlace.countLike.toString());
        expect(htmlElement.textContent).toContain(mockPlace.countFollower.toString());
        // expect(htmlElement.textContent).toContain(mockPlace.countPlan); // https://app.asana.com/0/74409597884824/264490762436218
    });
});
