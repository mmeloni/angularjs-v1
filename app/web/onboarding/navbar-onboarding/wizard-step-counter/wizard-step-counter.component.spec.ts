import { DebugElement }    from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';

import { WizardStepCounterOptions } from './wizard-step-counter-options.model';
import { WizardStepCounterComponent } from './wizard-step-counter.component';

describe('WizardStepCounterComponent:', () => {
    let component: WizardStepCounterComponent;
    let fixture: ComponentFixture<WizardStepCounterComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;
    let componentOptions: WizardStepCounterOptions;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WizardStepCounterComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WizardStepCounterComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('span'));
        htmlElement = debugElement.nativeElement;

        componentOptions = {
            currentStepNumber: 22,
            textIntro: 'foo',
            textSeparator: 'bar',
            totalSteps: 111
        };

        component.options = componentOptions;
        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof WizardStepCounterComponent).toBe(true, 'should create WizardStepCounterComponent');
    });

    it('should print the total number of steps', () => {
        expect(htmlElement.textContent).toContain(componentOptions.totalSteps.toString()); // textContent is a string
    });

    it('should print the current step number', () => {
        expect(htmlElement.textContent).toContain(componentOptions.currentStepNumber.toString()); // textContent is a string
    });

    it('should print the text option values', () => {
        expect(htmlElement.textContent).toContain(componentOptions.textIntro);
        expect(htmlElement.textContent).toContain(componentOptions.textSeparator);
    });
});
