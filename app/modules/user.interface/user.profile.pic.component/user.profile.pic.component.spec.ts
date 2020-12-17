import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ImagesProvider } from '../../../providers/images.provider';
import { Observable } from 'rxjs/Observable';
import { UserProfilePicComponent } from './user.profile.pic.component';
import { UserService } from '../../../shared/user/user.service';
import { ModalService } from '../../../web/commons/modal/modal-commons/modal.service';
import 'rxjs/add/observable/of';

const mockedImagesService = {
    getUserAvatar: () => Observable.of('string'),
    invalidateUserAvatar: () => Observable.of('string')
};

const mockedUserService = {
    uploadAvatar: () => Promise.resolve()
};

const mockedModalService = {
    openAvatarCrop: (callback) => callback('base_64_file_mock')
};

describe('UserProfilePicComponent:', () => {
    let component: UserProfilePicComponent;
    let fixture: ComponentFixture<UserProfilePicComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                UserProfilePicComponent
            ],
            imports: [ CommonModule ],
            providers: [
                { provide: ImagesProvider, useValue: mockedImagesService },
                { provide: UserService, useValue: mockedUserService },
                { provide: ModalService, useValue: mockedModalService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserProfilePicComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        htmlElement = debugElement.nativeElement;

        component.userNid = 1;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
