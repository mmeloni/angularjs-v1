import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { S3 } from 'aws-sdk';
import { ImgSrcDirective } from './img-src.directive';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { UploadService } from '../../../shared/upload/upload.service';
import { ImageService } from '../../../shared/image/image.service';

describe('ImgSrcDirective:', () => {
    const imageOptions: ImageServiceOptions = {
        default: 'foo',
        format: 'bar',
        id: 1,
        type: 'baz'
    };

    @Component({
        template: `
            <img [wnImgSrc]="imageOptions" />
        `
    })
    class TestComponent {
        imageOptions = imageOptions;
    }

    // let directive: ImgSrcDirective;
    let fixture: ComponentFixture<TestComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;
    // let mockOptions: ImageServiceOptions;

    const uploadServiceStub = {
        getObjectFromAWS$: () => {
            const response: S3.GetObjectOutput = {};
            return Observable.of(response);
        }
    };

    const imageServiceStub = {
        getImageFromAWS$: () => {
            // NOTE: PhantomJS does not support File constructor: http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript#comment66997550_31663645
            const mockBlob = new Blob([ 'foo bar' ]);
            return Observable.of(mockBlob as File);
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ImgSrcDirective, TestComponent ],
            providers: [
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

        fixture = TestBed.createComponent(TestComponent);
        // directive = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.directive(ImgSrcDirective));
        htmlElement = debugElement.nativeElement;

        fixture.detectChanges(); // initial binding
    });

    it('should set the "src" attribute to a proper local File url', () => {
        const blobUrlRegexp = new RegExp(/^blob\:http\:\/\//);
        expect(htmlElement.getAttribute('src')).toMatch(blobUrlRegexp);
    });
});
