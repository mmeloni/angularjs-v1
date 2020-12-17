import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { ImagesProvider } from '../../../providers/images.provider';
import { UserService } from '../../../shared/user/user.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * This component is responsible for showing the user's cover image,
 * it can also be used to upload a new one
 */

@Component({
    selector: 'wn-user-profile-cover',
    styleUrls: [ 'user.profile.cover.component.scss' ],
    templateUrl: './user.profile.cover.component.html'
})
export class UserProfileCoverComponent implements OnInit, OnDestroy, AfterViewInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    /**
     * ------------------------------------------------------------------------
     * Input variables:
     * ------------------------------------------------------------------------
     */

    /**
     * The user's unique nid, required.
     */
    @Input() userNid: number;

    /**
     * if true a parallax effect will be applied to the image once fully loaded
     * @type {boolean}
     */
    @Input() parallax: boolean = false;

    /**
     * if true it allows user's to change their profile image
     * @type {boolean}
     */
    @Input() edit: boolean = false;

    /**
     * ------------------------------------------------------------------------
     * Output variables:
     * ------------------------------------------------------------------------
     */

    /**
     * will fire an event once the cover is fully loaded
     * @type {EventEmitter<any>}
     */
    @Output() onCoverLoad: EventEmitter<string> = new EventEmitter();

    /**
     * will fire an event once the cover has been updated, only available in edit mode
     * @type {EventEmitter<any>}
     */
    @Output() onCoverUpdated: EventEmitter<string> = new EventEmitter();

    /**
     * the actual image url
     * @type {string}
     */
    public imageUrl: string;

    /**
     * a flat that's true if the image is fully loaded
     * @type {boolean}
     */
    public imageLoaded: boolean = false;

    /**
     * This flag tells the template to remove the <img> tag.
     * This trick force the browser to reload the image completely once the tag will be created again
     * @type {boolean}
     */
    public removeImageTag: boolean = false;

    /**
     * if true, it means that the user is uploading a new image
     * @type {boolean}
     */
    public isUploadingNewImg: boolean = false;

    /**
     * will be true if the image can't load
     * @type {boolean}
     */
    public imageLoadingErr: boolean = false;

    /**
     * local image tag shortcut
     */
    private imageTag: HTMLImageElement;

    /**
     * the class constructor
     * @param {ImagesProvider} imagesProvider
     * @param {ElementRef} el
     * @param {UserService} userService
     */
    constructor(
        private imagesProvider: ImagesProvider,
        private el: ElementRef,
        private userService: UserService) {
        // method binding
        this.parallaxScrollingHandler = this.parallaxScrollingHandler.bind(this);
    }

    /**
     * once the component has been initialized fetch the image from AWS
     */
    ngOnInit(): void {
        this.fetchImage();
    }

    /**
     * if parallax add the parallax handler to the window's scroll event
     */
    ngAfterViewInit(): void {
        const img: HTMLImageElement = this.el.nativeElement.querySelector('img');
        if (img) {
            this.imageTag = img;
        }

        if (this.parallax && img) {
            img.addEventListener('load', () => {
                window.addEventListener('scroll', this.parallaxScrollingHandler);
            });
        }
    }

    /**
     * if the parallax effect has been added, remove the scrolling listener
     */
    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.parallaxScrollingHandler);
    }

    /**
     * just click on the hidden input
     */
    public showFileDialog(): void {
        if (!this.isUploadingNewImg && this.edit) {
            const input = this.el.nativeElement.querySelector('input');
            input.click();
        }
    }

    /**
     * called by the wnLazyPic directive's onLoaded method once the image is fully loaded
     */
    public imageIsFullyLoaded(): void {
        this.imageLoadingErr = false;
        this.imageLoaded = true;
        this.removeImageTag = false;
    }

    /**
     * called by the wnLazyPic directive's onError method once the image is fully loaded
     */
    public imageLoadingError(): void {
        this.imageLoadingErr = true;
        this.imageLoaded = false;
        this.removeImageTag = true;
    }

    /**
     * fetch the image data using the ImagesProvider, a delay can be applied for animation purposes
     * @param {number} delay
     */
    private fetchImage(delay: number = 0): Subscription {
        const id: number = this.userNid;

        return this.imagesProvider.getUserCover(id)
            .delay(delay)
            .subscribe((imageUrl: string) => {
                this.imageUrl = `${imageUrl}?refresh=${+Date.now()}`;
                this.isUploadingNewImg = false;
                this.removeImageTag = false;
                this.onCoverLoad.emit(imageUrl);
            });
    }

    /**
     * handle the file upload
     * @param {Event} $event
     */
    public handleFileUpload($event: Event): void {
        const target: HTMLInputElement = ($event.target || $event.srcElement) as HTMLInputElement;
        const { files } = target;
        const file = files[ 0 ];

        this.imageUrl = null;
        this.imageLoaded = false;
        this.isUploadingNewImg = true;
        this.removeImageTag = true;

        this.userService.uploadCover(file, this.userNid).then(() => {
            this.imagesProvider.invalidateUserCover(this.userNid).subscribe(() => {
                this.fetchImage(500)
                    .add(() => {
                        this.onCoverUpdated.emit(this.imageUrl);
                        // FIXME: turn the User into and Observable to remove this shite reload();
                        location.reload();
                    });
            });
        }).catch(() => {
            this.isUploadingNewImg = false;
            this.imageLoaded = false;
            this.imageLoadingErr = true;
        });
    }

    /**
     * the actual scrolling method
     */
    private parallaxScrollingHandler(): void {
        const image: HTMLElement = this.imageTag;
        const doc = document.documentElement;
        const body = document.body;
        const scrollTop = 'scrollTop';
        const percentage = (doc[ scrollTop ] || body[ scrollTop ]) / ((3000) - doc.clientHeight) * 100;

        image.style.transform = `translateZ(0) translateY(${percentage}%)`;
    }
}
