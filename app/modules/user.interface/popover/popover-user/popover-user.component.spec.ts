import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { StateService } from 'ui-router-ng2';
import { ActionBarItemComponent } from '../../action-bar/action-bar-item/action-bar-item.component';
import { StatisticsBarComponent } from '../../action-bar/statistics-bar/statistics-bar.component';
import { AvatarComponent } from '../../_deprecated.avatar/avatar.component';
import { ButtonComponent } from '../../button/button.component';
import { FollowButtonComponent } from '../../follow-button-component/follow-button.component';
import { IconComponent } from '../../icon/icon.component';
import { ImgSrcDirective } from '../../image/img-src.directive';
import { PopoverUserComponent } from './popover-user.component';
import { FollowService } from '../../../../shared/follow/follow.service';
import { UserService } from '../../../../shared/user/user.service';

describe('PopoverUserComponent', () => {
    let component: PopoverUserComponent;
    let fixture: ComponentFixture<PopoverUserComponent>;

    const mockUserData = {
        city: {
            name: 'Foo'
        },
        isFollowed: true,
        nid: 1234
    };

    const mockActorData = {
        city: {
            name: 'Bar'
        },
        isFollowed: false,
        nid: 5678
    };

    const mockLabels = {
        attraction: '',
        follow: '',
        followers: '',
        following: '',
        hotel: '',
        likes: '',
        place: '',
        planned: '',
        shards: '',
        unfollow: ''
    };

    const followServiceStub = {};

    const stateServiceStub = {
        go: () => {
            return true;
        }
    };

    const userServiceStub = {
        getUser: () => {
            return mockActorData;
        },
        loadUserFullData$: (nid) => {
            return Observable.of(mockUserData);
        }
    };

    // better to put beforeEach in aync mode because template and css loading from original component is done asynchronous
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ActionBarItemComponent,
                AvatarComponent,
                ButtonComponent,
                FollowButtonComponent,
                IconComponent,
                ImgSrcDirective,
                PopoverUserComponent,
                StatisticsBarComponent
            ],
            providers: [
                { provide: FollowService, useValue: followServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UserService, useValue: userServiceStub }
            ]
        })
            .overrideComponent(AvatarComponent, {
                set: {
                    template: '<span>AvatarComponent</span>'
                }
            })
            .overrideComponent(ActionBarItemComponent, {
                set: {
                    template: '<span>ActionBarItemComponent</span>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(PopoverUserComponent);

        component = fixture.componentInstance;
        component.labels = mockLabels;
    }));

    it('should work', () => {
        expect(component instanceof PopoverUserComponent).toBe(true);
    });

    it('should have a "goToProfilePage" method that redirects to profile page', async(() => {
        expect(typeof component.goToProfilePage).toBe('function');
    }));

    describe('should have ngOnInit method that initialize some values', () => {
        it('should have ngOnInit method', () => {
            expect(typeof component.ngOnInit).toBe('function');
        });

        it('should set statisticsItems with 3 items', async(() => {
            const expectedStatisticItemsLenght = 3;

            component.componentData = mockUserData;
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.statisticsItems.length).toEqual(expectedStatisticItemsLenght);
        }));

        it('should set isTargetUserLoaded to true', async(() => {
            component.componentData = mockUserData;
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.isTargetUserLoaded).toEqual(true);
        }));
    });
});
