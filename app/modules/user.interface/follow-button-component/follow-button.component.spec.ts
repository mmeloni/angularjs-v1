import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserInterfaceModule } from '../user.interface.module';
import { FollowButtonComponent } from './follow-button.component';
import { FollowService } from '../../../shared/follow/follow.service';

describe('FollowButtonComponent:', () => {
    let component: FollowButtonComponent;
    let fixture: ComponentFixture<FollowButtonComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(async(() => {

        const followServiceStub = {
            follow: () => {
                return Promise.resolve(true);
            },
            toggleFollow: (targetId: number, isTargetFollowed: boolean): Promise<boolean> => {
                return Promise.resolve(!isTargetFollowed);
            },
            unfollow: () => {
                return Promise.resolve(true);
            }
        };

        TestBed.configureTestingModule({
            imports: [
                UserInterfaceModule
            ],
            providers: [
                { provide: FollowService, useValue: followServiceStub }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FollowButtonComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('button'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof FollowButtonComponent).toBe(true, 'should create FollowButtonComponent');
    });

});
