import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconLabelComponent } from '../icon-label-component/icon-label.component';
import { CategoryIconComponent } from './category-icon.component';

describe('CategoryIconComponent:', () => {
    let component: CategoryIconComponent;
    let fixture: ComponentFixture<CategoryIconComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CategoryIconComponent,
                IconLabelComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CategoryIconComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div.item'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof CategoryIconComponent).toBe(true, 'should create CategoryIconComponent');
    });

    it('should be present wn-icon-label', () => {
        expect(htmlElement.querySelectorAll('wn-icon-label').length).toBe(1);
    });

});
