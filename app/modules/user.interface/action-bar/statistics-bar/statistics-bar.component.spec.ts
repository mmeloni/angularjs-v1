import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StateService } from 'ui-router-ng2';

import { ActionBarItemComponent } from '../action-bar-item/action-bar-item.component';
import { ActionBarItem } from '../action-bar-item/action-bar-item.model';
import { StatisticsBarComponent } from './statistics-bar.component';

describe('StatisticsBarComponent:', () => {
    let component: StatisticsBarComponent;
    let fixture: ComponentFixture<StatisticsBarComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const stateServiceStub = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ActionBarItemComponent,
                StatisticsBarComponent
            ],
            providers: [
                { provide: StateService, useValue: stateServiceStub }
            ]
        }).overrideComponent(ActionBarItemComponent, {
            set: {
                template: '<span>item</span>'
            }
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsBarComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('ul'));
        htmlElement = debugElement.nativeElement;
    }));

    it('should work', () => {
        expect(component instanceof StatisticsBarComponent).toBe(true, 'should create StatisticsBarComponent');
    });

    it('should print the input items', () => {
        const mockItems: ActionBarItem[] = [
            {
                iconClasses: 'bar',
                label: 'foo',
                state: 'boh',
                value: 10
            },
            {
                iconClasses: 'bar',
                label: 'foo',
                state: 'boh',
                value: 10
            },
            {
                iconClasses: 'bar',
                label: 'foo',
                state: 'boh',
                value: 10
            }
        ];
        component.items = mockItems;
        fixture.detectChanges();

        expect(htmlElement.querySelectorAll('wn-action-bar-item').length).toBe(mockItems.length);
    });
});
