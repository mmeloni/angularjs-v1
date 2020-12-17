import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { S3 } from 'aws-sdk';
import { ImageComponent } from './image.component';
import { ImgSrcDirective } from './img-src.directive';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { UploadService } from '../../../shared/upload/upload.service';
import { ImageService } from '../../../shared/image/image.service';

describe('ImageComponent:', () => {
    let component: ImageComponent;
    let fixture: ComponentFixture<ImageComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;
    let mockOptions: ImageServiceOptions;

    beforeEach(() => {
        const uploadServiceStub = {
            getObjectFromAWS$: () => {
                const response: S3.GetObjectOutput = {};
                return Observable.of(response);
            }
        };

        const imageServiceStub = {
            getImageFromAWS$: () => {
                // NOTE: PhantomJS does not support File constructor: http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript#comment66997550_31663645
                const mockBlob = new Blob();
                return Observable.of(mockBlob as File);
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                ImageComponent,
                ImgSrcDirective
            ],
            providers: [
                { provide: ImageService, useValue: imageServiceStub },
                { provide: UploadService, useValue: uploadServiceStub }
            ]
        })
            .overrideDirective(ImgSrcDirective, {
                set: {
                    providers: [
                        { provide: ImageService, useValue: imageServiceStub }
                    ]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(ImageComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('img'));
        htmlElement = debugElement.nativeElement;

        // "new" because we want defaults, not just type checking
        mockOptions = new ImageServiceOptions();
        mockOptions.id = 1;
        component.componentData = mockOptions;
        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof ImageComponent).toBe(true);
    });

    it('should accept a "cssClasses" input to set custom CSS classes', () => {
        const mockCssClasses = 'foo bar baz';
        component.cssClasses = mockCssClasses;
        fixture.detectChanges();

        expect(htmlElement.getAttribute('class')).toEqual(mockCssClasses);
    });
});
