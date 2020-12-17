import { DebugElement } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { UserInterfaceModule } from '../../user.interface.module';
import { GridTopShardComponent } from './grid-top-shard.component';
import { SessionService } from '../../../../shared/session/session.service';
import { ShardService } from '../../../../shared/shard/shard.service';

@Component({
    selector: `wn-test-host-component`,
    template:
            `
        <wn-grid-top-shard [id]="valueFromHost.id"
                           [subtitle]="valueFromHost.subtitle"></wn-grid-top-shard>`
})
export class TestHostComponent {
    @ViewChild(GridTopShardComponent) public testComponent: any;

    public valueFromHost: any;
}

describe('GridTopShardComponent:', () => {
    let component: GridTopShardComponent;
    let fixture: ComponentFixture<GridTopShardComponent>;
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
                TestHostComponent
            ],
            imports: [
                BrowserModule,
                HttpModule,
                UserInterfaceModule
            ],
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
        fixture = TestBed.createComponent(GridTopShardComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('.hotel-grid-container'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof GridTopShardComponent).toBe(true, 'should create GridTopShardComponent');
    });

});
