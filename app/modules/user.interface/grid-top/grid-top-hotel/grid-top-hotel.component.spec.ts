import { DebugElement } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonComponent } from '../../button/button.component';
import { CategoryIconComponent } from '../../category-icon-component/category-icon.component';
import { IconLabelComponent } from '../../icon-label-component/icon-label.component';
import { StarRatingComponent } from '../../star-rating-component/star-rating.component';
import { GridTopHotelItemComponent } from './grid-top-hotel-item/grid-top-hotel-item.component';
import { GridTopHotelComponent } from './grid-top-hotel.component';
import { ShardService } from '../../../../shared/shard/shard.service';
import { SessionService } from '../../../../shared/session/session.service';

@Component({
    selector: `wn-test-host-component`,
    template:
            `
        <wn-grid-top-hotel [id]="valueFromHost.id"
                           [subtitle]="valueFromHost.subtitle"></wn-grid-top-hotel>`
})
export class TestHostComponent {
    @ViewChild(GridTopHotelComponent)
    public testComponent: any;

    public valueFromHost: any;
}

// I'm not sure this spec shouldn't be rewritten - William
xdescribe('GridTopHotelComponent:', () => {
    let component: GridTopHotelComponent;
    let fixture: ComponentFixture<GridTopHotelComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockData = {
        id: '',
        subtitle: 'x'
    };

    beforeEach(async(() => {

        const shardServiceStub = {
            getShardStreamByOptions: () => {
                return true;
            }
        };

        const sessionServiceStub = {
            getToken: () => {
                return true;
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                TestHostComponent,
                GridTopHotelComponent,
                GridTopHotelItemComponent,
                StarRatingComponent,
                IconLabelComponent,
                ButtonComponent,
                CategoryIconComponent
            ],
            imports: [ BrowserModule, HttpModule ],
            providers: [ {
                provide: ShardService,
                useValue: shardServiceStub
            },
                {
                    provide: SessionService,
                    useValue: shardServiceStub
                } ]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridTopHotelComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('.hotel-grid-container'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof GridTopHotelComponent).toBe(true, 'should create GridTopHotelComponent');
    });

});
