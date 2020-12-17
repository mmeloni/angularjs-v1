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
    selector: '[wnBackgroundImage]'
})
export class BackgroundImageDirective implements OnChanges, OnDestroy, OnInit {
    @Input() wnBackgroundImage: ImageServiceOptions;
    @Input() wnBackgroundImagePolling?: boolean = false;

    @Output() imageNotFound = new EventEmitter<void>();
    @Output() wnBackgroundImageIsPolling? = new EventEmitter<boolean>();

    private subscription: Subscription;
    private imageElement: HTMLImageElement;
    private previousLastModifiedDate: number;
    private previousFileSize: number;

    constructor(private element: ElementRef,
                private imageService: ImageService) {
        this.imageElement = this.element.nativeElement;
        this.previousFileSize = 0;
        this.previousLastModifiedDate = new Date().getTime();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes[ 'wnBackgroundImagePolling' ] !== undefined && changes[ 'wnBackgroundImagePolling' ].currentValue === true) {
            this.wnBackgroundImageIsPolling.next(true);

            let currentLastModifiedDate: number;
            let currentFileSize: number;
            Observable.interval(ConfigurationService.durations.pollingInterval)
                .flatMap(() => {
                    return this.imageService.getImageFromAWS$(this.wnBackgroundImage);
                })
                .skipWhile((imageFile: File, index) => {
                    let needsToContinuePolling = false;
                    currentLastModifiedDate = new Date(imageFile.lastModifiedDate).getTime();
                    currentFileSize = imageFile.size;

                    needsToContinuePolling = (currentFileSize === this.previousFileSize) && (index <= ConfigurationService.durations.pollingMaxTries);

                    return needsToContinuePolling;
                })
                .first()
                .finally(() => {
                    this.wnBackgroundImageIsPolling.next(false);
                })
                .subscribe((imageFile: File) => {
                    if (imageFile.size === 0) {
                        this.imageNotFound.next();
                    } else {
                        this.previousLastModifiedDate = currentLastModifiedDate;
                        this.previousFileSize = currentFileSize;
                        this.updateBackgroundImage(URL.createObjectURL(imageFile));
                    }
                });
        }
    }

    ngOnInit() {
        if (this.wnBackgroundImage !== undefined) {
            this.subscription = this.imageService.getImageFromAWS$(this.wnBackgroundImage).subscribe((imageFile: File) => {
                this.previousLastModifiedDate = new Date(imageFile.lastModifiedDate).getTime();
                this.previousFileSize = imageFile.size;
                let imageUrl = '';
                if (imageFile.size === 0) {
                    this.imageNotFound.next();
                } else {
                    imageUrl = URL.createObjectURL(imageFile);
                }
                this.updateBackgroundImage(imageUrl);
            });
        }
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('load') onload() {
        URL.revokeObjectURL(this.imageElement.getAttribute('src'));
    }

    private updateBackgroundImage(url: string) {
        this.imageElement.style.backgroundImage = `url(${url})`;
    }
}
