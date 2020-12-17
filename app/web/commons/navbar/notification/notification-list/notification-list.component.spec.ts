import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { S3 } from 'aws-sdk';
import { StateService } from 'ui-router-ng2';

import { Shard } from '../../../../../shared/shard/shard.model';
import { ShardService } from '../../../../../shared/shard/shard.service';
import { UploadService } from '../../../../../shared/upload/upload.service';
import { User } from '../../../../../shared/user/user.model';
import { UserService } from '../../../../../shared/user/user.service';
import { ModalService } from '../../../modal/modal-commons/modal.service';
import { Notification, NotificationType } from '../notification.model';
import { NotificationListComponent } from './notification-list.component';
import { UserInterfaceModule } from '../../../../../modules/user.interface/user.interface.module';
import { AvatarComponent } from '../../../../../modules/user.interface/_deprecated.avatar/avatar.component';
import { ImageComponent } from '../../../../../modules/user.interface/image/image.component';

describe('NotificationListComponent:', () => {
    let component: NotificationListComponent;
    let fixture: ComponentFixture<NotificationListComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    let mockNotification: Notification;

    beforeEach(() => {
        const modalServiceStub = {
            openShardDetail: (shard, user) => {
                return new Shard();
            }
        };

        const shardServiceStub = {
            getShardById: (shardId) => {
                return new Shard();
            }
        };

        const stateServiceStub = {
            go: () => {
                return true;
            }
        };

        const userServiceStub = {
            getUser: () => {
                return new User();
            }
        };

        const uploadServiceStub = {
            getObjectFromAWS$: () => {
                const response: S3.GetObjectOutput = {};
                return Observable.of(response);
            }
        };

        mockNotification = {
            _id: '123abc',
            bit: 1,
            creatorNid: 1234,
            creatorUsername: 'Andrea',
            eventIcon: 'foo',
            eventImageOptions: {
                default: 'foo',
                format: 'bar',
                id: 1,
                type: 'baz'
            },
            icon: 'foo',
            masterId: 1234,
            prefix: { name: '' },
            read: false,
            shardId: 456,
            text: 'likes your picture'
        };

        TestBed.configureTestingModule({
            declarations: [
                NotificationListComponent
            ],
            imports: [
                UserInterfaceModule
            ],
            providers: [
                {
                    provide: ModalService, useValue: modalServiceStub
                },
                {
                    provide: ShardService, useValue: shardServiceStub
                },
                {
                    provide: StateService, useValue: stateServiceStub
                },
                {
                    provide: UserService, useValue: userServiceStub
                },
                {
                    provide: UploadService, useValue: uploadServiceStub
                }
            ]
        })
            .overrideComponent(AvatarComponent, {
                set: {
                    template: '<span>AvatarComponent</span>'
                }
            })
            .overrideComponent(ImageComponent, {
                set: {
                    template: '<span>ImageComponent</span>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(NotificationListComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('article'));
        htmlElement = debugElement.nativeElement;

        component.labels = { title: 'Notifications' };
    });

    it('should work', () => {
        expect(component instanceof NotificationListComponent).toBe(true, 'should create NotificationListComponent');
    });

    it('should display notification data', () => {
        component.notifications = [ mockNotification ];

        fixture.detectChanges();

        expect(htmlElement.textContent).toContain('Notifications');
        expect(htmlElement.textContent).toContain(mockNotification.creatorUsername);
        expect(htmlElement.textContent).toContain(mockNotification.text);
    });

    it('should have a "goToByNotification" defining what happens when activating a notification', () => {
        expect(typeof component.goToByNotification).toBe('function');
    });

    describe('The "goToByNotification" method:', () => {
        let spyGoToProfilePage: jasmine.Spy;
        let spyGoToShardDetail: jasmine.Spy;

        beforeEach(() => {
            spyGoToProfilePage = spyOn(component, 'goToProfilePage');
            spyGoToShardDetail = spyOn(component, 'goToShardDetail');
        })

        it('should go to the profile page if the notification comes from a follow', () => {
            mockNotification.bit = NotificationType.Follow;
            component.goToByNotification(new Event('foo'), mockNotification);

            expect(spyGoToShardDetail).not.toHaveBeenCalled();
            expect(spyGoToProfilePage).toHaveBeenCalled();
        });

        it('should go to the shard detail page if the notification comes from a comment', () => {
            mockNotification.bit = NotificationType.Comment;
            component.goToByNotification(new Event('foo'), mockNotification);

            expect(spyGoToShardDetail).toHaveBeenCalled();
            expect(spyGoToProfilePage).not.toHaveBeenCalled();
        });

        it('should go to the shard detail page if the notification comes from a like', () => {
            mockNotification.bit = NotificationType.Like;
            component.goToByNotification(new Event('foo'), mockNotification);

            expect(spyGoToShardDetail).toHaveBeenCalled();
            expect(spyGoToProfilePage).not.toHaveBeenCalled();
        });

        it('should go to the shard detail page if the notification comes from a tour invitation', () => {
            mockNotification.bit = NotificationType.Tour;
            component.goToByNotification(new Event('foo'), mockNotification);

            expect(spyGoToShardDetail).toHaveBeenCalled();
            expect(spyGoToProfilePage).not.toHaveBeenCalled();
        });

        it('should do nothing if the notification comes from something unexpected', () => {
            mockNotification.bit = 0;
            component.goToByNotification(new Event('foo'), mockNotification);

            expect(spyGoToShardDetail).not.toHaveBeenCalled();
            expect(spyGoToProfilePage).not.toHaveBeenCalled();
        });
    });
});
