import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AmenitiesComponent } from './amenities.component';
import { AmenityItemComponent } from './amenity-item-component/amenity-item.component';

describe('AmenitiesComponent:', () => {
    let component: AmenitiesComponent;
    let fixture: ComponentFixture<AmenitiesComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const max: number = 5;
    const min: number = 0;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AmenitiesComponent, AmenityItemComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AmenitiesComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div.amenities'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof AmenitiesComponent).toBe(true, 'should create AmenitiesComponent');
    });

    it('should work', () => {
        component.componentData = ['ciao'];
        expect(htmlElement.querySelectorAll('wn-amenities-item')).not.toBeNull();
    });

});
