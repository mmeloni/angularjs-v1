import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ImageService } from '../../../shared/image/image.service';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { ConfigurationService } from '../../../shared/config/configuration.service';

@Directive({
    providers: [ ImageService ], // provide here so there's a new instance for every component instance
    selector: '[wnImgSrc]'
})
export class ImgSrcDirective implements OnChanges, OnDestroy, OnInit {
    @Input() wnImgSrc: ImageServiceOptions;
    @Input() wnImgSrcPolling?: boolean = false;

    @Output() wnImgSrcIsPolling? = new EventEmitter<boolean>();

    private subscriptionOnInit: Subscription;
    private imageElement: HTMLImageElement;
    private previousLastModifiedDate: number;
    private previousFileSize: number;

    constructor(private element: ElementRef,
                private imageService: ImageService) {
        this.imageElement = this.element.nativeElement;
        this.previousFileSize = 0;
        this.previousLastModifiedDate = new Date().getTime();
    }

    ngOnInit() {
        this.subscriptionOnInit = this.imageService.getImageFromAWS$(this.wnImgSrc).subscribe((imageFile: File) => {
            this.previousLastModifiedDate = new Date(imageFile.lastModifiedDate).getTime();
            this.previousFileSize = imageFile.size;
            let imageUrl = '';

            if (imageFile.size === 0) {
                imageUrl = this.wnImgSrc.default || ConfigurationService.defaultImages.shard;
            } else {
                imageUrl = URL.createObjectURL(imageFile);
            }
            this.updateImgSrc(imageUrl);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes[ 'wnImgSrcPolling' ] !== undefined && changes[ 'wnImgSrcPolling' ].currentValue === true) {
            this.wnImgSrcIsPolling.next(true);

            let currentLastModifiedDate: number;
            let currentFileSize: number;
            Observable.interval(ConfigurationService.durations.pollingInterval)
                .flatMap(() => {
                    return this.imageService.getImageFromAWS$(this.wnImgSrc);
                })
                .skipWhile((imageFile: File, index) => {
                    currentLastModifiedDate = new Date(imageFile.lastModifiedDate).getTime();
                    currentFileSize = imageFile.size;

                    return (currentFileSize === this.previousFileSize) && (index <= ConfigurationService.durations.pollingMaxTries);
                })
                .first()
                .finally(() => {
                    this.wnImgSrcIsPolling.next(false);
                })
                .subscribe((imageFile: File) => {
                    this.previousLastModifiedDate = currentLastModifiedDate;
                    this.previousFileSize = currentFileSize;
                    this.updateImgSrc(URL.createObjectURL(imageFile));
                });
        }
    }

    ngOnDestroy() {
        if (this.subscriptionOnInit !== undefined) {
            this.subscriptionOnInit.unsubscribe();
        }
    }

    @HostListener('load') onload() {
        URL.revokeObjectURL(this.imageElement.getAttribute('src'));
    }

    private updateImgSrc(url: string) {
        this.imageElement.src = url;
    }
}
