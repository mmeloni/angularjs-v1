import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AuthModule } from '../../auth.module';
import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { UploadService } from '../upload/upload.service';
import { User } from './user.model';
import { UserService } from './user.service';

describe('UserService:', () => {
    let mockBackend: MockBackend;
    let service: UserService;

    const mockNid = 0;
    const mockTargetNid = 1;
    const mockRecoveryUserNeedle = 'obi@wan.com';
    const mockRecoveryCode = '3d0ct3rc3s';
    const mockNewPassword = 'M4yTh3F0rc3B3W1thY0u,Fr0d0B4gg1nz';
    const mockUserData = new User();
    const mockBase64FileString = 'n9scv89aweotr';
    const mockSignedUri = 'http://lordofthestars.com';
    const mockPage = 1;
    const mockElementsPerPage = 10;
    const mockResponseData = new User();

    beforeEach(async(() => {
        const sessionServiceStub = {
            getToken: () => { return 'token'; },
            getUser: () => { return mockUserData; },
            setUser: (user: User) => { return mockUserData; }
        };

        const uploadServiceStub = {
            uploadContent: (file, type, name) => {
                return Promise.resolve(mockSignedUri);
            }
        };

        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                AuthModule
            ],
            providers: [
                UserService,
                UploadService,
                MockBackend,
                BaseRequestOptions,
                {
                    deps: [MockBackend, BaseRequestOptions],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                {
                    provide: SessionService,
                    useValue: sessionServiceStub
                },
                {
                    provide: UploadService,
                    useValue: uploadServiceStub
                }
            ]
        });

        mockBackend = getTestBed().get(MockBackend);

        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                        body: mockResponseData
                    }
                )
            ));
        });

        // It's important to get the service after the mockBackend is established,
        // so that its constructor can use the mocked Http.
        service = getTestBed().get(UserService);
    }));

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof UserService).toBe(true);
    });

    it('should have a "createUser" method to register user', async(() => {
        expect(typeof service.createUser$).toBe('function');

        service
            .createUser$(mockUserData)
            .first()
            .subscribe((response) => {
                expect(response).toEqual(mockResponseData);
            });
    }));

    it('should have a "loadUserFullData" method to load user data plus social statistics', async(() => {
        expect(typeof service.loadUserFullData).toBe('function');

        service.loadUserFullData(mockNid).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "loadUserBaseData" method to load user data without social statistics', async(() => {
        expect(typeof service.loadUserBaseData).toBe('function');

        service.loadUserBaseData(mockNid).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "updateUserData" method to update user info', async(() => {
        expect(typeof service.updateUserData).toBe('function');

        service.updateUserData(mockUserData).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "recoverPassword" method to send email to reset password', async(() => {
        expect(typeof service.recoverPassword$).toBe('function');

        service
            .recoverPassword$(mockRecoveryUserNeedle)
            .first()
            .subscribe((response) => {
                expect(response).toEqual(mockResponseData);
            });
    }));

    it('should have a "changePassword" method to check secret code for reset password', async(() => {
        expect(typeof service.changePassword$).toBe('function');

        service
            .changePassword$(mockNid, mockRecoveryCode, mockNewPassword)
            .first()
            .subscribe((response) => {
                expect(response).toEqual(mockResponseData);
            });
    }));

    it('should have a "uploadAvatar" method to perform upload _deprecated.avatar image', async(() => {
        expect(typeof service.uploadAvatar).toBe('function');

        service.uploadAvatar(mockBase64FileString).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "uploadCover" method to perform upload cover image', async(() => {
        expect(typeof service.uploadCover).toBe('function');

        const mockBlob = new Blob();
        // NOTE: PhantomJS does not support File constructor: http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript#comment66997550_31663645
        service.uploadCover(mockBlob as File, mockNid).then((response) => {
            expect(response).toEqual(mockSignedUri);
        });
    }));

    it('should have a "blockUser" method to block target user', async(() => {
        expect(typeof service.blockUser).toBe('function');

        service.blockUser(mockTargetNid).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "unblockUser" method to unblock target user', async(() => {
        expect(typeof service.unblockUser).toBe('function');

        service.unblockUser(mockTargetNid).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getUserFollowing" method to get following grid of user', async(() => {
        expect(typeof service.getUserFollowing).toBe('function');

        service.getUserFollowing(mockNid, mockPage, mockElementsPerPage).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getUserFollowers" method to get followers grid of user', async(() => {
        expect(typeof service.getUserFollowers).toBe('function');

        service.getUserFollowers(mockNid, mockPage, mockElementsPerPage).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getPopularProfiles" method to get the most popular profiles', async(() => {
        expect(typeof service.getPopularProfiles).toBe('function');

        service.getPopularProfiles().then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getUser" method to get current logged user', () => {
        expect(typeof service.getUser).toBe('function');
        expect(service.getUser()).toEqual(mockUserData);
    });

    it('should have a "setUser" method to set user in session', () => {
        expect(typeof service.setUser).toBe('function');

        const sessionService = getTestBed().get(SessionService);
        const spy = spyOn(sessionService, 'setUser');
        service.setUser(mockUserData);
        expect(spy).toHaveBeenCalled();
    });

    it('should have a "deserialize" method to deserialize user objet', () => {
        expect(typeof service.deserialize).toBe('function');
        expect(service.deserialize({ onboardingTour: 0 })).toEqual(mockUserData);
    });

    it('should have a "hasOnboardingPlanDone" method to check if user has completed onboarding', () => {
        expect(typeof service.hasOnboardingPlanDone).toBe('function');
        expect(service.hasOnboardingPlanDone()).toEqual(false);
    });

    it('should have a "setOnboardingPlanDone" method to set user that has completed onboarding', () => {
        expect(typeof service.setOnboardingPlanDone).toBe('function');
        expect(service.setOnboardingPlanDone()).toEqual(mockUserData);
    });
});
