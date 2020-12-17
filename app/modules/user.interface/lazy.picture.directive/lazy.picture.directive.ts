import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * This directive applied only to the <img /> tags try to load the image src
 * for a defined number of times before eventually firing an error.
 * Once the image is loaded the onLoaded event is emitted, otherwise the onError event is emitted
 * after a number of loading trials.
 * This number is defined by the 'maxAttempts' class property.
 */
@Directive({
    selector: 'img[wnLazyPic]'
})
export class LazyPictureDirective implements OnInit, OnDestroy {

    /**
     * The onLoaded event is fired once the image has been fully loaded
     * @type {EventEmitter<string>}
     */
    @Output() onLoaded: EventEmitter<string> = new EventEmitter();

    /**
     * The onError event is fired once the image load failed
     * @type {EventEmitter<string>}
     */
    @Output() onError: EventEmitter<string> = new EventEmitter();

    /**
     * number of max attempts before error
     * @type {number}
     */
    static maxAttempts: number = 3;

    /**
     * the current timeout before reload the image source
     * @type {number}
     */
    private delay: number = 1000;

    /**
     * actual loading attempts
     * @type {number}
     */
    private loadingAttempts: number = 0;

    /**
     * original image source
     */
    private originalSrc: string;

    /**
     * a shortcut to the image element
     */
    private img: HTMLImageElement;

    constructor(private element: ElementRef) {
        this.img = element.nativeElement;

        // bind local methods
        this.onImageLoad = this.onImageLoad.bind(this);
        this.onImageError = this.onImageError.bind(this);
    }

    ngOnInit() {
        // add lazy-picture class
        this.img.classList.add('lazy-picture');

        // store original image source
        this.originalSrc = this.img.getAttribute('src');

        // add events
        this.img.addEventListener('load', this.onImageLoad);
        this.img.addEventListener('error', this.onImageError);
    }

    ngOnDestroy() {
        // on destroy remove events
        this.img.removeEventListener('load', this.onImageLoad);
        this.img.removeEventListener('error', this.onImageError);
    }

    /**
     * the image has been fully loaded
     */
    private onImageLoad(): void {
        this.img.classList.add('fully-loaded');
        this.onLoaded.emit(this.originalSrc);
    }

    /**
     * the image has not been loaded, try again or trigger an error
     */
    private onImageError() {
        const { maxAttempts } = LazyPictureDirective;

        if (this.loadingAttempts < maxAttempts) {
            this.reloadImageSource();
        } else {
            this.img.classList.add('loading-error');
            this.onError.emit(this.originalSrc);
        }
    }

    /**
     * try to remove and reattach the image source after an amount of time
     */
    private reloadImageSource() {
        this.loadingAttempts = this.loadingAttempts + 1;
        this.delay = this.loadingAttempts * this.delay;
        this.img.removeAttribute('src');

        setTimeout(() => {
            this.img.setAttribute('src', this.originalSrc);
        }, this.delay);
    }
}
