import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImgSrcDirective } from '../image/img-src.directive';
import { AvatarComponent } from './avatar.component';
import { UploadService } from '../../../shared/upload/upload.service';

describe('AvatarComponent:', () => {
    let component: AvatarComponent;
    let fixture: ComponentFixture<AvatarComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(async(() => {
        const uploadServiceStub = {};

        TestBed.configureTestingModule({
            declarations: [
                AvatarComponent,
                ImgSrcDirective
            ],
            providers: [
                { provide: UploadService, useValue: uploadServiceStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('img'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof AvatarComponent).toBe(true, 'should create AvatarComponent');
    });
});
