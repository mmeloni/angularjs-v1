import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GridItemSize } from '../../lazy.shards.grid/types';
import { ImagesProvider } from '../../../providers/images.provider';

@Component({
    selector: 'wn-shard-background',
    styleUrls: [ './shard.background.component.scss' ],
    templateUrl: './shard.background.component.html'
})
export class ShardBackgroundComponent implements OnInit, OnDestroy {

    /**
     * the 'masterId' input is needed to create the image options and get the right background image
     * @type {number}
     */
    @Input() masterId: number;

    /**
     * the 'size' input is needed to create the right image size,
     * it could be overwritten by the 'currentSize' variable in order to proper resize the background
     * when the window resize
     * @type {GridItemSize}
     */
    @Input() size: GridItemSize;

    /**
     * the 'currentSize' variable represent the actual size of the background image according to the
     * window size.
     * @type {GridItemSize}
     */
    private currentSize: GridItemSize;

    /**
     * 'showImage' is a boolean flag used to fadeIn the background image
     * @type {boolean}
     */
    public showImage: boolean = false;

    /**
     * 'imageLoadingError' is a boolean flag used to show the error icon if the image can't load
     * @type {boolean}
     */
    public imageLoadingError: boolean = false;

    /**
     * 'imageUrl' is the loaded background image
     * @type {string}
     */
    public imageUrl: string = null;

    constructor(private imagesProvider: ImagesProvider) {
    }

    ngOnInit(): void {
        // bind the method to itself so we can use it for add end remove event to the window listener
        this.onResize = this.onResize.bind(this);
        // update background image
        this.updateBackgroundImage();
        // add resize event
        window.addEventListener('resize', this.onResize);
    }

    ngOnDestroy(): void {
        // remove resize event
        window.removeEventListener('resize', this.onResize);
    }

    /**
     * update the background image
     * @param {GridItemSize} format
     */
    private updateBackgroundImage(format?: GridItemSize) {
        // reset the local variables
        this.currentSize = format || this.size;
        this.showImage = false;

        const id = this.masterId.toString();

        this.imagesProvider.getShardItemBackground(id, this.currentSize)
            .subscribe((imageUrl) => this.imageUrl = imageUrl);
    }

    /**
     * show the image
     */
    public onImageLoaded(): void {
        this.showImage = true;
        this.imageLoadingError = false;
    }

    /**
     * hide image and show the loading error icon
     */
    public onImageLoadingError(): void {
        this.showImage = false;
        this.imageLoadingError = true;
    }

    /**
     * the resize handler check if the window size is > 1280, if not
     * force the background image to be single as expected by the grid
     */
    private onResize(): void {
        const { innerWidth } = window;

        if (innerWidth <= 1280) {
            if (this.size !== 'single' && this.currentSize !== 'single') {
                this.currentSize = 'single';
                this.updateBackgroundImage(this.currentSize);
            }
        } else if (this.size !== this.currentSize) {
            this.currentSize = this.size;
            this.updateBackgroundImage(this.size);
        }
    }

}
