import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent:', () => {
    let component: IconComponent;
    let fixture: ComponentFixture<IconComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockGlyphName = 'foo';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                IconComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IconComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        htmlElement = debugElement.nativeElement;

        component.glyph = mockGlyphName;

        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof IconComponent).toBe(true);
    });

    it('should print a proper svg element when given a glyph', () => {
        const elements = htmlElement.querySelectorAll('svg use');

        expect(elements.length).toBe(1);
    });

    it('should be able to print sized variants', () => {
        component.iconSize = 'sm';
        component.ngOnInit();
        fixture.detectChanges();

        let elementsSm = htmlElement.querySelectorAll('svg.sm');
        expect(elementsSm.length).toBe(1);

        component.iconSize = 'lg';
        component.ngOnInit();
        fixture.detectChanges();

        elementsSm = htmlElement.querySelectorAll('svg.sm');
        const elementsLg = htmlElement.querySelectorAll('svg.lg');
        expect(elementsSm.length).toBe(0);
        expect(elementsLg.length).toBe(1);
    });

    it('should be able to print squared and circled variants', () => {
        component.iconShape = 'square';
        component.ngOnInit();
        fixture.detectChanges();

        let elementsSquare = htmlElement.querySelectorAll('svg.square');
        let elementsCircle = htmlElement.querySelectorAll('svg.circle');
        expect(elementsSquare.length).toBe(1);
        expect(elementsCircle.length).toBe(0);

        component.iconShape = 'circle';
        component.ngOnInit();
        fixture.detectChanges();

        elementsSquare = htmlElement.querySelectorAll('svg.square');
        elementsCircle = htmlElement.querySelectorAll('svg.circle');
        expect(elementsSquare.length).toBe(0);
        expect(elementsCircle.length).toBe(1);
    });

    it('should be able to print colored variants', () => {
        let elementsColor = htmlElement.querySelectorAll('svg.' + mockGlyphName + '-color');
        expect(elementsColor.length).toBe(0);

        component.color = true;
        component.ngOnInit();
        fixture.detectChanges();

        elementsColor = htmlElement.querySelectorAll('svg.' + mockGlyphName + '-color');
        expect(elementsColor.length).toBe(1);

    });

    it('should be able to print pin variants', () => {
        let elementsPin = htmlElement.querySelectorAll('span.pin');
        expect(elementsPin.length).toBe(0);

        component.pin = 'square';
        component.ngOnInit();
        fixture.detectChanges();

        elementsPin = htmlElement.querySelectorAll('span.pin.square');
        const elementsSquare = htmlElement.querySelectorAll('svg.square');
        const elementsCircle = htmlElement.querySelectorAll('svg.circle');
        expect(elementsPin.length).toBe(1);
        expect(elementsSquare.length).toBe(0);
        expect(elementsCircle.length).toBe(0);
    });

    it('should print pin variants over shape ones when both are requested', () => {
        component.pin = 'circle';
        component.iconShape = 'circle';
        component.ngOnInit()
        fixture.detectChanges();

        const elementsPin = htmlElement.querySelectorAll('span.pin.circle');
        const elementsCircle = htmlElement.querySelectorAll('svg.circle');

        expect(elementsPin.length).toBe(1);
        expect(elementsCircle.length).toBe(0);
    });

    it('should be able to animate icons', () => {
        component.animation = 'spin';
        component.ngOnInit();
        fixture.detectChanges();

        let elementsAnimate = htmlElement.querySelectorAll('svg.spin');
        expect(elementsAnimate.length).toBe(1);

        component.animation = 'pulse';
        component.ngOnInit();
        fixture.detectChanges();

        elementsAnimate = htmlElement.querySelectorAll('svg.pulse');
        expect(elementsAnimate.length).toBe(1);
    });
});
