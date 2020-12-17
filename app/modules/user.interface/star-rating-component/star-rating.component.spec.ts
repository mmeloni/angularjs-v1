import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StarRatingComponent } from './star-rating.component';

describe('StarRatingComponent:', () => {
    let component: StarRatingComponent;
    let fixture: ComponentFixture<StarRatingComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const max: number = 5;
    const min: number = 0;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StarRatingComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StarRatingComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div.stars'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof StarRatingComponent).toBe(true, 'should create StarRatingComponent');
    });

    it('should not show any star', () => {
        component.ratingValue = '';
        expect(htmlElement.querySelectorAll('img')).not.toBeNull();
        expect(htmlElement.querySelectorAll('img').length).toBe(min);
    });

    xit('should not show 5 stars', () => {
        component.ratingValue = '5';
        fixture.detectChanges();
        expect(htmlElement.querySelectorAll('img').length).toBe(max);
    });

    it('should not show any star', () => {
        component.ratingValue = '-1';
        fixture.detectChanges();
        expect(htmlElement.querySelectorAll('img').length).toBe(min);
    });

    it('should not show any star', () => {
        component.ratingValue = '0.1';
        fixture.detectChanges();
        expect(htmlElement.querySelectorAll('img').length).toBe(min);
    });

    it('should not show any star', () => {
        component.ratingValue = 'ciao';
        fixture.detectChanges();
        expect(htmlElement.querySelectorAll('img').length).toBe(min);
    });

    it('should not show any star', () => {
        component.ratingValue = '10';
        fixture.detectChanges();
        expect(htmlElement.querySelectorAll('img').length).toBe(min);
    });
});
