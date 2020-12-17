import { DebugElement } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { GridTopAttractionComponent } from './grid-top-attraction.component';
import { ShardService } from '../../../../shared/shard/shard.service';
import { SessionService } from '../../../../shared/session/session.service';
import { UploadService } from '../../../../shared/upload/upload.service';
import { UserInterfaceModule } from '../../user.interface.module';

@Component({
    selector: `wn-test-host-component`,
    template:
            `
        <wn-grid-top-attraction [id]="valueFromHost.id"></wn-grid-top-attraction>`
})
export class TestHostComponent {
    @ViewChild(GridTopAttractionComponent)
    public testComponent: any;

    public valueFromHost: any;
}

describe('GridTopAttractionComponent:', () => {
    let component: GridTopAttractionComponent;
    let fixture: ComponentFixture<GridTopAttractionComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const shardServiceStub = {
        getShardStreamByOptions: () => {
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
        fixture = TestBed.createComponent(GridTopAttractionComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('.hotel-grid-container'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof GridTopAttractionComponent).toBe(true, 'should create GridTopAttractionComponent');
    });

});
