import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ShardDetailOpenDirective } from './shard-detail-open.directive';
import { Shard } from '../../shared/shard/shard.model';
import { User } from '../../shared/user/user.model';
import { ModalService } from '../../web/commons/modal/modal-commons/modal.service';
import { ShardService } from '../../shared/shard/shard.service';

describe('ShardDetailOpenDirective:', () => {
    const mockShardId = 123;
    const mockShard = new Shard();
    const mockUser = new User();

    const shardServiceStub = {
        getShardById: () => {
            return Promise.resolve(mockShard);
        }
    };

    const modalServiceStub = {
        openShardDetail: () => {
            return true;
        }
    };

    @Component({
        template: `
            <article [wnShardDetailOpen]="mockShardId" [wnShardDetailUser]="mockUser"></article>
        `
    })
    class TestComponent {
        mockShardId = mockShardId;
        mockUser = mockUser;
    }

    // let directive: ShardDetailOpenDirective;
    let fixture: ComponentFixture<TestComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ShardDetailOpenDirective,
                TestComponent
            ],
            providers: [
                { provide: ModalService, useValue: modalServiceStub },
                { provide: ShardService, useValue: shardServiceStub }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        debugElement = fixture.debugElement.query(By.directive(ShardDetailOpenDirective));
        htmlElement = debugElement.nativeElement;

        fixture.detectChanges(); // initial binding
    });

    // This test should work. It doesn't.
    xit('should listen to the click event and open a shard detail modal', () => {
        const shardService = getTestBed().get(ShardService);
        const spy = spyOn(shardService, 'getShardById');

        htmlElement.click();

        expect(spy).toHaveBeenCalled();
    });
});
