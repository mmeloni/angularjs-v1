import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { OnboardingStateService } from '../onboarding-state.service';
import { NavbarOnboardingComponent } from './navbar-onboarding.component';
import { WizardStepCounterComponent } from './wizard-step-counter/wizard-step-counter.component';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';

describe('NavbarOnboardingComponent:', () => {
    let component: NavbarOnboardingComponent;
    let fixture: ComponentFixture<NavbarOnboardingComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(async(() => {
        const onboardingStateServiceStub = {
            currentStepIndexChanged$: Observable.of(1)
        };

        TestBed.configureTestingModule({
            declarations: [
                NavbarOnboardingComponent,
                WizardStepCounterComponent
            ],
            imports: [
                UserInterfaceModule
            ],
            providers: [
                { provide: OnboardingStateService, useValue: onboardingStateServiceStub }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarOnboardingComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('nav'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof NavbarOnboardingComponent).toBe(true, 'should create NavbarOnboardingComponent');
    });

    it('should include the branding', () => {
        expect(htmlElement.querySelector('wn-icon[glyph="logo"]')).not.toBeNull();
    });

    it('should contain a step counter component', () => {
        expect(htmlElement.querySelector('wn-wizard-step-counter')).not.toBeNull();
    });
});
