import { DebugElement }    from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';

import { AmenityItemComponent } from './amenity-item.component';

describe('AmenityItemComponent:', () => {
    let component: AmenityItemComponent;
    let fixture: ComponentFixture<AmenityItemComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;
    let numItem: number;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AmenityItemComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AmenityItemComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div.amenities-item'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof AmenityItemComponent).toBe(true, 'should create AmenitiesItemComponent');
    });

    it('should work', () => {
        numItem = 1;
        component.componentData = ['test amenities'];
        expect(htmlElement.querySelectorAll('img')).not.toBeNull()
        expect(component.componentData.length).toBe(numItem);
    });

    it('should work', () => {
        numItem = 3;
        component.componentData = ['test amenities1', 'test amenities2', 'test amenities3'];
        expect(htmlElement.querySelectorAll('img')).not.toBeNull();
        expect(component.componentData.length).toBe(numItem);
    });

});
