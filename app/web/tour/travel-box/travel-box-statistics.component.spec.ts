import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StateService } from 'ui-router-ng2';
import { TravelBoxStatisticsComponent } from './travel-box-statistics.component';
import { TravelBoxStatisticsModule } from './travel-box-statistics.module';
import { ActionBarItem } from '../../../modules/user.interface/action-bar/action-bar-item/action-bar-item.model';
import { StatisticsBarComponent } from '../../../modules/user.interface/action-bar/statistics-bar/statistics-bar.component';

describe('TravelBoxStatisticsComponent:', () => {
    let component: TravelBoxStatisticsComponent;
    let fixture: ComponentFixture<TravelBoxStatisticsComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockHeadingItem: ActionBarItem = {
        iconClasses: 'bar',
        label: 'foo',
        state: 'boh',
        value: 10
    };
    const mockMainItems: ActionBarItem[] = [
        {
            iconClasses: 'baz',
            label: 'foobar',
            state: 'boh',
            value: 10
        }
    ];

    const stateServiceStub = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TravelBoxStatisticsModule
            ],
            providers: [
                { provide: StateService, useValue: stateServiceStub }
            ]
        })
            .overrideComponent(StatisticsBarComponent, {
                set: {
                    template: '<span>item1</span><span>item2</span><span>item3</span>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(TravelBoxStatisticsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('article'));
        htmlElement = debugElement.nativeElement;

        component.headingItem = mockHeadingItem;
        component.mainItems = mockMainItems;

        fixture.detectChanges();
    }));

    it('should work', () => {
        expect(component instanceof TravelBoxStatisticsComponent).toBe(true, 'should create TravelBoxStatisticsComponent');
    });

    it('should be able to render a statistics bar and 2 action bar items', () => {
        const actionBarItemCount = 2;
        const mockAsideItem: ActionBarItem = {
            iconClasses: 'bart',
            label: 'foobaz',
            state: 'boh',
            value: 10
        };
        component.asideItem = mockAsideItem;
        fixture.detectChanges();

        expect(htmlElement.querySelectorAll('wn-statistics-bar').length).toBe(1);
        expect(htmlElement.querySelectorAll('wn-action-bar-item').length).toBe(actionBarItemCount);
    });

    it('should be able to render a statistics bar and 1 action bar item', () => {
        expect(htmlElement.querySelectorAll('wn-statistics-bar').length).toBe(1);
        expect(htmlElement.querySelectorAll('wn-action-bar-item').length).toBe(1);
    });
});
