import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ModalService } from '../../modal/modal-commons/modal.service';
import { ShardNewOpenDirective } from './shard-new-open.directive';

describe('ShardNewOpenDirective:', () => {
    const modalServiceStub = {
        openShardNew: () => {
            return true;
        },
        openShardNewMultiple: () => {
            return true;
        }
    };

    const mockNewOpenMultipleParams = {
        mainStage: {},
        timelineTreeIndex: 0,
        tour: {}
    };

    @Component({
        template: `
            <button
                [wnShardNewOpen]="isMultiple"
                [wnShardNewOpenMultipleParams]="newOpenMultipleParams"
            >Add a Shard
            </button>
        `
    })
    class TestComponent {
        isMultiple = false;
        newOpenMultipleParams = undefined;
    }

    let fixture: ComponentFixture<TestComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ShardNewOpenDirective,
                TestComponent
            ],
            providers: [
                { provide: ModalService, useValue: modalServiceStub }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        debugElement = fixture.debugElement.query(By.directive(ShardNewOpenDirective));
        htmlElement = debugElement.nativeElement;

        fixture.detectChanges(); // initial binding
    });

    it('should listen to the click event and open a "add shard" modal', () => {
        const modalService = getTestBed().get(ModalService);
        const spy = spyOn(modalService, 'openShardNew');

        htmlElement.click();

        expect(spy).toHaveBeenCalled();
    });

    it('should be able to optionally open the "multiple" variant of a "add shard" modal', () => {
        const modalService = getTestBed().get(ModalService);
        const spy = spyOn(modalService, 'openShardNewMultiple');

        fixture.componentInstance.isMultiple = true;
        fixture.componentInstance.newOpenMultipleParams = mockNewOpenMultipleParams;
        fixture.detectChanges();

        htmlElement.click();

        expect(spy).toHaveBeenCalledWith(mockNewOpenMultipleParams.mainStage, mockNewOpenMultipleParams.tour, mockNewOpenMultipleParams.timelineTreeIndex);
    });
});
