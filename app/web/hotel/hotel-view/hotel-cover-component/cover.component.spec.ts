import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CoverComponent } from './cover.component';

xdescribe('CoverComponent:', () => {
    let component: CoverComponent;
    let fixture: ComponentFixture<CoverComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    let numPhoto: number;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CoverComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoverComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div.cover-container'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof CoverComponent).toBe(true, 'should create CoverComponent');
    });

    it('typeView should be single', () => {
        component.componentData = {
            imageDetailsCount: 1,
            imageDetailsPrefix: '' ,
            imageDetailsSuffix: ''
        };
        numPhoto = 1;
        fixture.detectChanges();
        expect(component.typeView).toBe('single');
        expect(htmlElement.querySelectorAll('div.photo').length).toBe(numPhoto);
    });

    it('typeView should be multiple', () => {
        component.componentData = ['test photo', 'test photo2', 'test photo3', 'test photo4'];
        numPhoto = component.componentData.length;
        fixture.detectChanges();
        expect(component.typeView).not.toBe('single');
        expect(htmlElement.querySelectorAll('div.photo').length - 1 ).toBe(numPhoto);
    });
});
