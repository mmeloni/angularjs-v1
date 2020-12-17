import { DebugElement } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StateService } from 'ui-router-ng2';
import { ButtonComponent } from '../../../button/button.component';
import { IconLabelComponent } from '../../../icon-label-component/icon-label.component';
import { StarRatingComponent } from '../../../star-rating-component/star-rating.component';
import { GridTopHotelItemComponent } from './grid-top-hotel-item.component';

@Component({
    selector: `wn-test-host-component`,
    template:
            `
        <div>
            <wn-grid-top-hotel-item [componentData]="valueFromHost"></wn-grid-top-hotel-item>
        </div>`
})
export class TestHostComponent {
    @ViewChild(GridTopHotelItemComponent) public testComponent: any;

    public valueFromHost: any;
}

// I'm not sure this spec shouldn't be rewritten - William
xdescribe('GridTopHotelItemComponent:', () => {
    let component: GridTopHotelItemComponent;
    let fixture: ComponentFixture<GridTopHotelItemComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    let numIconLabel: number = 3;

    const mockData = {
        imageDetailsCount: 2,
        imageDetailsPrefix: 'xxx',
        imageDetailsSuffix: '.jpg'
    };

    beforeEach(async(() => {

        const stateServiceStub = {
            go: () => {
                return true;
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                TestHostComponent,
                GridTopHotelItemComponent,
                StarRatingComponent,
                ButtonComponent,
                IconLabelComponent
            ],
            providers: [ {
                provide: StateService,
                useValue: stateServiceStub
            } ]
        })
            .compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridTopHotelItemComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('article'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof GridTopHotelItemComponent).toBe(true, 'should create GridTopHotelItemComponent');
    });

    it('should accept a "componentData" input and call this.callFormatToCss', () => {

        let fixture = TestBed.createComponent(TestHostComponent);
        let testHostComponent = fixture.componentInstance;
        testHostComponent.valueFromHost = mockData;

        const spy = spyOn(testHostComponent.testComponent, 'callFormatToCss');
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
    });

    it('should be present h1, wn-star-rating, h2 in div.content', () => {
        expect(htmlElement.querySelectorAll('div.content').length).toBe(1);
        expect(htmlElement.querySelector('div.content').contains(htmlElement.querySelector('h1'))).toBe(true);
        expect(htmlElement.querySelector('div.content').contains(htmlElement.querySelector('wn-star-rating'))).toBe(true);
        expect(htmlElement.querySelector('div.content').contains(htmlElement.querySelector('h2'))).toBe(true);
    });

    it('should be present div.stats, div.type and wn-icon-label', () => {
        expect(htmlElement.querySelectorAll('div.stats').length).toBe(1);
        expect(htmlElement.querySelectorAll('div.type').length).toBe(1);
    });

    xit('should be present div.panel-body, div.hover and wn-button', () => {
        expect(htmlElement.querySelectorAll('div.panel-body').length).toBe(1);
        expect(htmlElement.querySelectorAll('div.hover').length).toBe(1);
    });
});
