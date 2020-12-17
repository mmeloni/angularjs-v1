import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ImagesProvider } from '../../../providers/images.provider';
import { Observable } from 'rxjs/Observable';
import { UserProfileCoverComponent } from './user.profile.cover.component';

import 'rxjs/add/observable/of';
import { UserService } from '../../../shared/user/user.service';

const mockedImagesService = {
    getUserCover: () => Observable.of('string')
};

const mockedUserService = {
    uploadCover: () => Promise.resolve('url')
};

describe('UserProfileCoverComponent:', () => {
    let component: UserProfileCoverComponent;
    let fixture: ComponentFixture<UserProfileCoverComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                UserProfileCoverComponent
            ],
            imports: [ CommonModule ],
            providers: [
                { provide: ImagesProvider, useValue: mockedImagesService },
                { provide: UserService, useValue: mockedUserService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserProfileCoverComponent);
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
