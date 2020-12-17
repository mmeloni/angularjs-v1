import { DebugElement } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { GridTopSightsComponent } from './grid-top-sights.component';
import { UserInterfaceModule } from '../../user.interface.module';
import { ShardService } from '../../../../shared/shard/shard.service';
import { SessionService } from '../../../../shared/session/session.service';
import { UploadService } from '../../../../shared/upload/upload.service';

@Component({
    selector: `wn-test-host-component`,
    template:
            `
        <wn-grid-top-sights [id]="valueFromHost.id"
                            [subtitle]="valueFromHost.subtitle"></wn-grid-top-sights>`
})
export class TestHostComponent {
    @ViewChild(GridTopSightsComponent) public testComponent: any;
    public valueFromHost: any;
}

describe('GridTopSightsComponent:', () => {
    let component: GridTopSightsComponent;
    let fixture: ComponentFixture<GridTopSightsComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockData = {
        id: '',
        subtitle: 'x'
    };

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

    const uploadServiceStub = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestHostComponent
            ],
            imports: [
                BrowserModule,
                HttpModule,
                UserInterfaceModule
            ],
            providers: [
                { provide: ShardService, useValue: shardServiceStub },
                { provide: SessionService, useValue: shardServiceStub },
                { provide: UploadService, useValue: uploadServiceStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridTopSightsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('.hotel-grid-container'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof GridTopSightsComponent).toBe(true, 'should create GridTopSightsComponent');
    });
});
