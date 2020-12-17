import { TestBed, async, getTestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../../shared/event/event.service';
import { Shard } from '../../../../shared/shard/shard.model';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { User } from '../../../../shared/user/user.model';
import { UserService } from '../../../../shared/user/user.service';
import { ToastService } from '../../toast/toast.service';
import { HelperPlanService } from '../modal-plan/helper-plan.service';
import { ModalService } from './modal.service';

describe('ModalService:', () => {
    let service: ModalService;

    const eventServiceStub = {
        broadcast: (event) => {
            return true;
        }
    };

    const i18nServiceStub = {
        getTranslationLabels: () => {
            return { foo: 'bar' };
        }
    };

    const mockCloseReason = 'foo';
    const ngbModalStub = {
        open: (modalPlanComponent, mockSize) => {
            let _resolve: (result?: any) => void;
            const mockResult = new Promise((resolve, reject) => {
                _resolve = resolve;
            });

            return {
                close: (reason) => {
                    _resolve(reason);
                },
                componentInstance: {
                    componentData: {
                        backgroundOptions: {},
                        id: 1,
                        shardIconClasses: '',
                        title: '',
                        user: {}
                    }
                },
                result: mockResult
            };
        }
    };

    const userServiceStub = {
        hasOnboardingPlanDone: () => {
            return false;
        }
    };

    const toastServiceStub = {
        raiseNewShard: (result) => {
            return 'Baz';
        },
        raisePlanned: (result) => {
            return 'Bazraiser';
        }
    };

    const helperPlanServiceStub = {
        completeOnBoarding: () => {
            return true;
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ModalService,
                { provide: EventService, useValue: eventServiceStub },
                { provide: NgbModal, useValue: ngbModalStub },
                { provide: UserService, useValue: userServiceStub },
                { provide: ToastService, useValue: toastServiceStub },
                { provide: HelperPlanService, useValue: helperPlanServiceStub },
                { provide: I18nService, useValue: i18nServiceStub }
            ]
        });

        service = getTestBed().get(ModalService);
    });

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof ModalService).toBe(true);
    });

    it('should have a "openPlan" method to open the plan modal', () => {
        expect(typeof service.openPlan).toBe('function');
    });

    it('should have a "openShardDetail" method to open the shard detail modal', () => {
        expect(typeof service.openShardDetail).toBe('function');
    });

    it('should have a "openShardNew" method to open the "new shard" modal', () => {
        expect(typeof service.openShardNew).toBe('function');
    });

    it('should have a "openShardNewMultiple" method to open a "multi-upload" modal', () => {
        expect(typeof service.openShardNewMultiple).toBe('function');
    });

    describe('The "openPlan" method:', () => {
        it('should return a modal that raises a "shard planned" toast, completes onboarding if needed, and broadcasts the proper event once closed', async(() => {
            const toastService = getTestBed().get(ToastService);
            const eventService = getTestBed().get(EventService);
            const helperPlanService = getTestBed().get(HelperPlanService);

            const spyToastService = spyOn(toastService, 'raisePlanned');
            const spyEventService = spyOn(eventService, 'broadcast');
            const spyHelperPlanService = spyOn(helperPlanService, 'completeOnBoarding');

            const mockShard = new Shard();
            mockShard.bit = 0x00000002;

            const modalRef = service.openPlan(mockShard);

            modalRef.close(mockCloseReason);
            modalRef.result.then((result) => {
                expect(spyToastService).toHaveBeenCalledWith(result);
                expect(spyHelperPlanService).toHaveBeenCalled();
                expect(spyEventService).toHaveBeenCalledWith('WN_EVT_SHARDPLANNED');
            });
        }));
    });

    describe('The "openShardDetail" method:', () => {
        it('should return a modal that DOESN\'T open the plan modal once closed if unrequested', async(() => {
            const spyModalService = spyOn(service, 'openPlan');

            const mockShard = new Shard();
            const mockUser = new User();

            const modalRef = service.openShardDetail(mockShard, mockUser);

            modalRef.close(mockCloseReason);
            modalRef.result.then((result) => {
                expect(spyModalService).not.toHaveBeenCalled();
            });
        }));

        it('should return a modal that opens the plan modal once closed if requested', async(() => {
            const spyModalService = spyOn(service, 'openPlan');

            const mockUser = new User();
            let mockShard = new Shard();
            mockShard.user = mockUser;

            const modalRef = service.openShardDetail(mockShard, mockUser);

            modalRef.close('shardDetail.request.plan');
            modalRef.result.then((result) => {
                expect(spyModalService).toHaveBeenCalledWith(mockShard);
            });
        }));
    });

    describe('The "openShardNew" method:', () => {
        it('should return a modal that raises a "new shard" toast and broadcasts the proper event once closed', async(() => {
            const toastService = getTestBed().get(ToastService);
            const eventService = getTestBed().get(EventService);

            const spyToastService = spyOn(toastService, 'raiseNewShard');
            const spyEventService = spyOn(eventService, 'broadcast');

            const modalRef = service.openShardNew();

            modalRef.close(mockCloseReason);
            modalRef.result.then((result) => {
                expect(spyToastService).toHaveBeenCalledWith(result);
                expect(spyEventService).toHaveBeenCalledWith('WN_EVT_SHARD_CREATED', mockCloseReason);
            });
        }));
    });

    describe('The "openShardNewMultiple" method:', () => {
        it('should return a modal that broadcasts the proper event once closed', async(() => {
            const eventService = getTestBed().get(EventService);
            const spyEventService = spyOn(eventService, 'broadcast');

            const modalRef = service.openShardNewMultiple('', {}, 0);

            modalRef.close();
            modalRef.result.then((result) => {
                expect(spyEventService).toHaveBeenCalledWith('WN_EVT_RENDER_GRID');
            });
        }));
    });
});
