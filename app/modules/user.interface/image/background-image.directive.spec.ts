import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { S3 } from 'aws-sdk';
import { BackgroundImageDirective } from './background-image.directive';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { ImageService } from '../../../shared/image/image.service';
import { UploadService } from '../../../shared/upload/upload.service';

describe('BackgroundImageDirective:', () => {
    @Component({
        template: `
            <div [wnBackgroundImage]="imageOptions" (imageNotFound)="callback()">Foo</div>
        `
    })
    class TestComponent {
        imageOptions: ImageServiceOptions;

        callback() {
            // callback
        }
    }

    let fixture: ComponentFixture<TestComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    let imageOptions: ImageServiceOptions;

    let spy: jasmine.Spy;

    const imageServiceStub = {
        getImageFromAWS$: () => {
            // NOTE: PhantomJS does not support File constructor: http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript#comment66997550_31663645
            const mockBlob = new Blob([ 'foo bar' ]);
            return Observable.of(mockBlob as File);
        }
    };

    // can be used either only in specific describe block (and passed as service to override directive)
    const imageServiceStubSize0 = {
        getImageFromAWS$: () => {
            // NOTE: PhantomJS does not support File constructor: http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript#comment66997550_31663645
            const mockBlob = new Blob([]);
            return Observable.of(mockBlob as File);
        }
    };

    const uploadServiceStub = {
        getObjectFromAWS$: () => {
            const response: S3.GetObjectOutput = {};
            return Observable.of(response);
        }
    };

    // This spec file has two top-level `describe` blocks (when found / when not found) because I wasn't able to make it work otherwise.
    // Please don't copy-paste this for every directive spec file.
    describe('When the target image is found', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [ BackgroundImageDirective, TestComponent ],
                providers: [
                    { provide: UploadService, useValue: uploadServiceStub }
                ]
            }).overrideDirective(BackgroundImageDirective, {
                set: {
                    providers: [
                        { provide: ImageService, useValue: imageServiceStub }
                    ]
                }
            }).compileComponents();

            imageOptions = {
                default: 'foo',
                format: 'bar',
                id: 1,
                type: 'baz'
            };

            fixture = TestBed.createComponent(TestComponent);
            fixture.componentInstance.imageOptions = imageOptions;
            debugElement = fixture.debugElement.query(By.directive(BackgroundImageDirective));
            htmlElement = debugElement.nativeElement;

            fixture.detectChanges();
        }));

        it('should set the "background-image" inline style property to a proper AWS url', async(() => {
            imageServiceStub.getImageFromAWS$()
                .first()
                .subscribe((result) => {
                    expect(result.size).not.toEqual(0);
                    expect(htmlElement.style.backgroundImage).toContain('blob');
                });
        }));
    });

    describe('When the target image is not found', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [ BackgroundImageDirective, TestComponent ],
                providers: [
                    { provide: UploadService, useValue: uploadServiceStub }
                ]
            })
                .overrideDirective(BackgroundImageDirective, {
                    set: {
                        providers: [
                            { provide: ImageService, useValue: imageServiceStubSize0 }
                        ]
                    }
                })
                .compileComponents();

            imageOptions = {
                default: 'foo',
                format: 'bar',
                id: 0,
                type: 'baz'
            };

            fixture = TestBed.createComponent(TestComponent);
            fixture.componentInstance.imageOptions = imageOptions;
            debugElement = fixture.debugElement.query(By.directive(BackgroundImageDirective));
            htmlElement = debugElement.nativeElement;

            spy = spyOn(fixture.componentInstance, 'callback');

            fixture.detectChanges();
        }));

        it('should emit an "imageNotFound" event', () => {
            fixture.componentInstance.imageOptions = imageOptions;
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
        });
    });
});
