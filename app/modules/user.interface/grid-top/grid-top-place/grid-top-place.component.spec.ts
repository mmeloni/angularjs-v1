import { DebugElement } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { UserInterfaceModule } from '../../user.interface.module';
import { GridTopPlaceComponent } from './grid-top-place.component';
import { ShardService } from '../../../../shared/shard/shard.service';
import { SessionService } from '../../../../shared/session/session.service';
import { UploadService } from '../../../../shared/upload/upload.service';

@Component({
    selector: `wn-test-host-component`,
    template:
            `
        <wn-grid-top-place [id]="valueFromHost.id"></wn-grid-top-place>`
})
export class TestHostComponent {
    @ViewChild(GridTopPlaceComponent) public testComponent: any;
    
    public valueFromHost: any;
}

describe('GridTopPlaceComponent:', () => {
    let component: GridTopPlaceComponent;
    let fixture: ComponentFixture<GridTopPlaceComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockData = {
        id: '',
        subtitle: 'x'
    };

    const uploadServiceStub = {};

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
        fixture = TestBed.createComponent(GridTopPlaceComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('.hotel-grid-container'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof GridTopPlaceComponent).toBe(true, 'should create GridTopPlaceComponent');
    });

});
