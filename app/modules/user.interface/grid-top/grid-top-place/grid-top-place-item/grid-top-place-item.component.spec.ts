import { DebugElement } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'ui-router-ng2';
import { UserInterfaceModule } from '../../../user.interface.module';
import { GridTopPlaceItemComponent } from './grid-top-place-item.component';
import { UploadService } from '../../../../../shared/upload/upload.service';

@Component({
    selector: `wn-test-host-component`,
    template:
            `
        <div>
            <wn-grid-top-place-item [componentData]="valueFromHost"></wn-grid-top-place-item>
        </div>`
})
export class TestHostComponent {
    @ViewChild(GridTopPlaceItemComponent) public testComponent: any;
    public valueFromHost: any;
}

describe('GridTopPlaceItemComponent:', () => {
    let component: GridTopPlaceItemComponent;
    let fixture: ComponentFixture<GridTopPlaceItemComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockData = {
        geoplaceId: 2
    };

    beforeEach(async(() => {

        const uploadServiceStub = {
            go: () => {
                return true;
            }
        };

        const stateServiceStub = {
            go: () => {
                return true;
            }
        };

        const ngbModalStub = {
            open: () => {
                return {
                    componentInstance: {}
                };
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                TestHostComponent
            ],
            imports: [
                UserInterfaceModule
            ],
            providers: [
                { provide: UploadService, useValue: uploadServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: NgbModal, useValue: ngbModalStub }
            ]
        })
            .compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridTopPlaceItemComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('article'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof GridTopPlaceItemComponent).toBe(true, 'should create GridTopPlaceItemComponent');
    });

    xit('should accept a "componentData" input', () => {

        let fixture = TestBed.createComponent(TestHostComponent);
        let testHostComponent = fixture.componentInstance;
        testHostComponent.valueFromHost = mockData;
    });

    it('should be present h1, h2 in div.content', () => {
        expect(htmlElement.querySelectorAll('div.content').length).toBe(1);
        expect(htmlElement.querySelector('div.content').contains(htmlElement.querySelector('h1'))).toBe(true);
        expect(htmlElement.querySelector('div.content').contains(htmlElement.querySelector('h2'))).toBe(true);
    });

    it('should be present div.stats, div.type and wn-icon-label', () => {
        expect(htmlElement.querySelectorAll('div.stats').length).toBe(1);
        expect(htmlElement.querySelectorAll('div.type').length).toBe(1);
    });

    it('should be present div.panel-body, div.hover and wn-button', () => {
        expect(htmlElement.querySelectorAll('div.panel-body').length).toBe(1);
        expect(htmlElement.querySelectorAll('div.hover').length).toBe(1);
    });
});
