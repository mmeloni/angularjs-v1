import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S3 } from 'aws-sdk';
import { StateService } from 'ui-router-ng2';

import { LikesProvider } from '../../../../providers/likes.provider/likes.provider';
import { Shard } from '../../../../shared/shard/shard.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { UploadService } from '../../../../shared/upload/upload.service';
import { User } from '../../../../shared/user/user.model';
import { ModalCommonsModule } from '../modal-commons/modal-commons.module';
import { LinkedPlaceInfoComponent } from './linked-place-info/linked-place-info.component';
import { ModalShardDetailComponent } from './modal-shard-detail.component';
import { ShardComment } from './shard-comments/shard-comment.model';
import { ShardCommentsComponent } from './shard-comments/shard-comments.component';
import { ShardCommentsModule } from './shard-comments/shard-comments.module';
import { StatisticsBarComponent } from '../../../../modules/user.interface/action-bar/statistics-bar/statistics-bar.component';
import { AvatarComponent } from '../../../../modules/user.interface/_deprecated.avatar/avatar.component';
import { UserInterfaceModule } from '../../../../modules/user.interface/user.interface.module';
import { ImageComponent } from '../../../../modules/user.interface/image/image.component';

describe('ModalShardDetailComponent:', () => {
    let component: ModalShardDetailComponent;
    let fixture: ComponentFixture<ModalShardDetailComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    let mockShard: Shard;
    let mockUser: User;

    const ngbActiveModalStub = {
        close: () => {
            return true;
        },
        dismiss: () => {
            return true;
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

    const stateServiceStub = {
        go: () => {
            return true;
        }
    };

    const uploadServiceStub = {
        getObjectFromAWS$: () => {
            const response: S3.GetObjectOutput = {};
            return Observable.of(response);
        }
    };

    const likeServiceStub = {
        toggleLike: (targetId: number): Promise<boolean> => {
            return Promise.resolve(true);
        }
    };

    const shardServiceStub = {
        getComments$: (shardId: number, page: number) => {
            return Observable.of([ new ShardComment() ]);
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModalShardDetailComponent,
                LinkedPlaceInfoComponent
            ],
            imports: [
                ShardCommentsModule,
                UserInterfaceModule,
                ModalCommonsModule
            ],
            providers: [
                { provide: NgbActiveModal, useValue: ngbActiveModalStub },
                { provide: I18nService, useValue: i18nServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UploadService, useValue: uploadServiceStub },
                { provide: LikesProvider, useValue: likeServiceStub },
                { provide: ShardService, useValue: shardServiceStub }
            ]
        })
            .overrideComponent(StatisticsBarComponent, {
                set: {
                    template: '<span>StatisticsBarComponent</span>'
                }
            })
            .overrideComponent(ShardCommentsComponent, {
                set: {
                    template: '<span>ShardCommentsComponent</span>'
                }
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

        fixture = TestBed.createComponent(ModalShardDetailComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        htmlElement = debugElement.nativeElement;

        mockShard = new Shard();
        mockShard.boards = [ { id: 1, title: 'foo' } ];
        mockShard.inputUrl = new URL('http://foo.bar');

        mockUser = new User();
        mockUser.nid = 1;
        mockShard.user = mockUser;

        component.shard = mockShard;
        component.currentUser = mockUser;
        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof ModalShardDetailComponent).toBe(true);
    });

    it('should have a "plan" method to close the modal requesting a plan action', () => {
        expect(typeof component.plan).toBe('function');

        const spyService = spyOn(getTestBed().get(NgbActiveModal), 'close');
        component.plan(new Event('foo'));
        expect(spyService).toHaveBeenCalledWith('shardDetail.request.plan');
    });

    it('should have a "goToShardSource" method to go to the URL source of an imported Shard', () => {
        expect(typeof component.goToShardSource).toBe('function');

        const spyMethod = spyOn(component, 'goToShardSource').and.callThrough();
        const spyWindowOpen = spyOn(window, 'open');

        const shardSourceAnchor = htmlElement.querySelector('a[data-shard-source]') as HTMLAnchorElement;
        shardSourceAnchor.click();
        expect(spyWindowOpen).toHaveBeenCalledWith(mockShard.inputUrl.toString());
        expect(spyMethod).toHaveBeenCalled();

        const shardSourceButton = htmlElement.querySelector('[data-shard-source] button') as HTMLButtonElement;
        shardSourceButton.click();
        expect(spyWindowOpen).toHaveBeenCalledWith(mockShard.inputUrl.toString());
        expect(spyMethod).toHaveBeenCalled();
    });

    it('should have a "goToBoard" method to go to the board page where the Shard has been saved', () => {
        expect(typeof component.goToBoard).toBe('function');

        const spyMethod = spyOn(component, 'goToBoard').and.callThrough();
        const spyService = spyOn(getTestBed().get(StateService), 'go');

        const boardTitleAnchor = htmlElement.querySelector('[data-board-title]') as HTMLAnchorElement;
        boardTitleAnchor.click();

        expect(spyMethod).toHaveBeenCalled();
        expect(spyService).toHaveBeenCalledWith('board.view', { boardId: mockShard.boards[ 0 ].id });
    });

    it('should have a "goToUserProfile" method to go to the profile of the user who saved the Shard into a board', () => {
        expect(typeof component.goToUserProfile).toBe('function');

        const spyMethod = spyOn(component, 'goToUserProfile').and.callThrough();
        const spyService = spyOn(getTestBed().get(StateService), 'go');

        const boardOwnerAnchor = htmlElement.querySelector('[data-board-owner]') as HTMLAnchorElement;
        boardOwnerAnchor.click();

        expect(spyMethod).toHaveBeenCalled();
        expect(spyService).toHaveBeenCalledWith('profileById', { userNid: mockUser.nid });
    });
});
