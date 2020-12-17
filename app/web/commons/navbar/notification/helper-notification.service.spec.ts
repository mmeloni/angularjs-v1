import { TestBed, async, getTestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { SocketService } from '../../../../shared/socket/socket.service';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { UserService } from '../../../../shared/user/user.service';
import { HelperNotificationService } from './helper-notification.service';
import socketMessages from '../../../utilities/socket.messages';

// Needs a mocked socket-server, I guess :-/
xdescribe('HelperNotificationService:', () => {
    let service: HelperNotificationService;
    let socketService: SocketService;
    let spyNewNotfication: jasmine.Spy;
    const mockUserNid = { nid: 1234 };

    const socketServiceStub = {
        socket: {
            emit: (event: string) => {
                return true;
            },
            on: (event: string, data: any) => {
                return true;
            }
        }
    };

    const userServiceStub = {
        getUser: () => {
            return mockUserNid;
        }
    };

    const i18nServiceStub = {
        getCurrentLocale: () => {
            return 'FOO';
        },
        getTranslationLabels: () => {
            return { foo: 'bar' };
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HelperNotificationService,
                { provide: SocketService, useValue: socketServiceStub },
                { provide: UserService, useValue: userServiceStub },
                { provide: I18nService, useValue: i18nServiceStub }
            ]
        });

        socketService = getTestBed().get(SocketService);
        spyNewNotfication = spyOn(socketService.socket, 'on');

        service = getTestBed().get(HelperNotificationService);
    });

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof HelperNotificationService).toBe(true);
    });

    it('should update the notifications array on "newNotification"', () => {
        expect(spyNewNotfication).toHaveBeenCalled();
    });

    it('should have a "init" method to start getting notifications', () => {
        const spy = spyOn(socketService.socket, 'emit');
        service.init();

        expect(spy).toHaveBeenCalledWith(socketMessages.NAVBAR_READY, mockUserNid);
    });

    it('should expose an Observable of notifications', () => {
        expect(service.notifications$ instanceof Observable).toBe(true);
    });

    it('should have a "markNotificationAsRead" to mark a notification as read', () => {
        expect(typeof service.markNotificationAsRead).toBe('function');

        const mockNotificationId = '1234';
        const spy = spyOn(socketService.socket, 'emit');
        service.markNotificationAsRead(mockNotificationId);

        expect(spy).toHaveBeenCalledWith(socketMessages.NOTIFICATION_READ, { id: mockNotificationId });
    });
});
