import { DebugElement }    from '@angular/core';
import { ComponentFixture, TestBed, async, getTestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Shard } from '../../../../shared/shard/shard.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { TourService } from '../../../../shared/tour/tour.service';
import { UserService } from '../../../../shared/user/user.service';
import { FileUploadPreviewListComponent } from '../../file-upload/file-upload-preview/file-upload-preview-list/file-upload-preview-list.component';
import { FileUploadModule } from '../../file-upload/file-upload.module';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { ModalCommonsModule } from '../modal-commons/modal-commons.module';
import { ModalShardNewMultipleComponent } from './modal-shard-new-multiple.component';
import { UserInterfaceModule } from '../../../../modules/user.interface/user.interface.module';

describe('ModalShardNewMultipleComponent:', () => {
    let component: ModalShardNewMultipleComponent;
    let fixture: ComponentFixture<ModalShardNewMultipleComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockUserData = { nid: 1234 };

    const ngbActiveModalStub = {
        close: () => {
            return Promise.resolve(true);
        },
        dismiss: () => { return true; }
    };

    const shardServiceStub = {
        createShards: (shardArray) => {
            return Promise.resolve({ shards: [new Shard()] });
        },
        uploadPhoto: (file, uploadFileName) => {
            return new Promise<any>((resolve, reject) => {
                return resolve(true);
            });
        }
    };

    const userServiceStub = {
        getUser: () => {
            return mockUserData;
        }
    };

    const tourServiceStub = {
        updateTour$: (tour: any) => { return Observable.of('foo'); }
    };

    // NOTE: PhantomJS does not support File constructor: http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript#comment66997550_31663645
    let mockFile: any = new Blob();
    mockFile.name = 'foo';
    mockFile.type = 'image/jpeg';
    const mockFileArray: File[] = [mockFile as File, mockFile as File];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModalShardNewMultipleComponent
            ],
            imports: [
                ModalCommonsModule,
                FileUploadModule,
                FormsModule,
                UserInterfaceModule,
                NgbModule
            ],
            providers: [
                { provide: NgbActiveModal, useValue: ngbActiveModalStub },
                { provide: ShardService, useValue: shardServiceStub },
                { provide: UserService, useValue: userServiceStub },
                { provide: TourService, useValue: tourServiceStub }
            ]
        })
        .overrideComponent(FileUploadPreviewListComponent, {
            set: {
                template: '<span>preview</span>'
            }
        })
        .compileComponents();

        fixture = TestBed.createComponent(ModalShardNewMultipleComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        htmlElement = debugElement.nativeElement;

        component.labels = {
            newShardMultiple: {
                helpText: 'baz',
                shardIt: 'foo',
                upload: {
                  inProgress: 'foo bar'
                }
            }
        };

        component.mainStage = {
            model: {
                nearestPoiId: 1
            }
        };

        component.tour = {
            timeline: [{
                shardsCollection: [new Shard()]
            }]
        };

        component.timelineTreeIndex = 0;

        fixture.detectChanges();
    }));

    it('should work', () => {
        expect(component instanceof ModalShardNewMultipleComponent).toBe(true);
    });

    it('should get files to upload from a service observable subscription', async(() => {
        expect(component.arePicturesChosen).toBe(false);

        // It didn't work using a stub service as usual
        const fileUploadService = debugElement.injector.get(FileUploadService);
        fileUploadService.addToFilesToUpload(mockFileArray[0]);
        fileUploadService.addToFilesToUpload(mockFileArray[1]);

        expect(component.model.files).toEqual(mockFileArray);
        expect(component.arePicturesChosen).toBe(true);
    }));

    it('should keep the upload button disabled if the files are > 10', async(() => {
        // It didn't work using a stub service as usual
        const fileUploadService = debugElement.injector.get(FileUploadService);

        fileUploadService.addToFilesToUpload(mockFileArray[0]);
        fileUploadService.addToFilesToUpload(mockFileArray[1]);
        fileUploadService.addToFilesToUpload(mockFileArray[0]);
        fileUploadService.addToFilesToUpload(mockFileArray[1]);
        fileUploadService.addToFilesToUpload(mockFileArray[0]);
        fileUploadService.addToFilesToUpload(mockFileArray[1]);
        fileUploadService.addToFilesToUpload(mockFileArray[0]);
        fileUploadService.addToFilesToUpload(mockFileArray[1]);
        fileUploadService.addToFilesToUpload(mockFileArray[0]);
        fileUploadService.addToFilesToUpload(mockFileArray[1]);
        expect(component.arePicturesChosen).toBe(true);

        fileUploadService.addToFilesToUpload(mockFileArray[1]);
        expect(component.arePicturesChosen).toBe(false);
    }));

    it('should have a "removeFile" method to remove a file from the files array by index', () => {
        expect(typeof component.removeFile).toBe('function');

        // Though this should work with a stub service, just keeping using the same approach as above to get the service
        const fileUploadService = debugElement.injector.get(FileUploadService);
        const spy = spyOn(fileUploadService, 'removeFileByIndex');

        component.removeFile(0);
        expect(spy).toHaveBeenCalledWith(0);
    });

    it('should have a "dismiss" method to close the modal', () => {
        expect(typeof component.dismiss).toBe('function');

        const ngbActiveModalService = getTestBed().get(NgbActiveModal);
        const spy = spyOn(ngbActiveModalService, 'dismiss');
        const dismissButton = debugElement.query(By.css(('wn-modal-button-dismiss span'))).nativeElement;

        dismissButton.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should have a "onSubmit" method to perform the actual upload and Shard creation', async(() => {
        expect(typeof component.onSubmit).toBe('function');

        const submitButton = debugElement.queryAll(By.css('wn-button'))[1].nativeElement;
        const ngbActiveModalService = getTestBed().get(NgbActiveModal);
        const spy = spyOn(ngbActiveModalService, 'close');

        component.model.files = mockFileArray;
        fixture.detectChanges();

        submitButton.click();

        fixture.whenStable().then(() => {
            expect(component.isLoadingSubmitButton).toBe(false);
            expect(spy).toHaveBeenCalled();
        });
    }));
});
