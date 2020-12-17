import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MapsComponent } from './maps.component';

describe('MapsComponent:', () => {
    let component: MapsComponent;
    let fixture: ComponentFixture<MapsComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MapsComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div'));
        htmlElement = debugElement.nativeElement;

        component.coordinates = '1,4';
        component.icon = 'foo';

        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof MapsComponent).toBe(true, 'should create MapsComponent');
    });

    it('should have a "centerMap" method to center a map view', () => {
        expect(typeof component.centerMap).toBe('function');

        const spySetCenter = spyOn(component.Map.getView(), 'setCenter');
        component.centerMap(1, 0);
        expect(spySetCenter).toHaveBeenCalledTimes(1);
    });

    it('should have a "addPoint" method to add a point on a map view', () => {
        expect(typeof component.addPoint).toBe('function');

        const spyAddLayer = spyOn(component.Map, 'addLayer');
        const vectorLayer = component.setPoint(1, 0);
        component.addPoint(vectorLayer);
        expect(spyAddLayer).toHaveBeenCalledTimes(1);
    });

});
