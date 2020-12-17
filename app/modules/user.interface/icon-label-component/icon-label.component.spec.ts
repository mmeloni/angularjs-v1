import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IconLabelComponent } from './icon-label.component';

describe('IconLabelComponent:', () => {
    let component: IconLabelComponent;
    let fixture: ComponentFixture<IconLabelComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockIconClasses = 'foo';
    const mockLabel = 'bar';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IconLabelComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IconLabelComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        htmlElement = debugElement.nativeElement;

        component.iconClasses = mockIconClasses;
        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof IconLabelComponent).toBe(true, 'should create IconLabelComponent');
    });

    it('should have an icon but not a label', () => {
        const spanElementsCount = 2;

        expect(htmlElement.querySelectorAll(`span.${mockIconClasses}`).length).toBe(1);
        expect(htmlElement.querySelectorAll('span').length).toBe(spanElementsCount);
        expect(htmlElement.textContent.trim()).toEqual(''); // no text except for whitespace
    });

    it('should be able to also show a label', () => {
        component.label = mockLabel;
        fixture.detectChanges();

        expect(htmlElement.textContent).toContain(mockLabel);
    });
});
