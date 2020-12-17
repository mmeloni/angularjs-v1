import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ImagesProvider } from '../../../providers/images.provider';
import { AvatarShape, AvatarSize } from './types';
import { ModalService } from '../../../web/commons/modal/modal-commons/modal.service';
import { UserService } from '../../../shared/user/user.service';
import { Base64EncodedString } from 'aws-sdk/clients/elastictranscoder';
import { Subscription } from 'rxjs/Subscription';

/**
 * This component is responsible for showing the user's profile picture.
 * I'ts configurable with a series of parameters to get more layouts.
 */

@Component({
    selector: 'wn-user-profile-pic',
    styleUrls: [ 'user.profile.pic.component.scss' ],
    templateUrl: './user.profile.pic.component.html'
})
export class UserProfilePicComponent implements OnInit {
    /**
     * The user's NID, required;
     * @type {string | number}
     */
    @Input() userNid: string | number;

    /**
     * the shape of the picture, can be round or square
     * @type {AvatarShape}
     */
    @Input() shape: AvatarShape = 'round';

    /**
     * the size of the picture, can be large or small
     * @type {AvatarSize}
     */
    @Input() size: AvatarSize = 'small';

    /**
     * enable the profile picture edit mode
     * @type {boolean}
     */
    @Input() edit: boolean = false;

    /**
     * the actual image url
     * @type {string}
     */
    public imageUrl: string;

    /**
     * the image loaded flag
     * @type {boolean}
     */
    public imgLoaded: boolean = false;

    /**
     * the image error flag
     * @type {boolean}
     */
    public imgError: boolean = false;

    constructor(
        private imagesProvider: ImagesProvider,
        private el: ElementRef,
        private modalService: ModalService,
        private userService: UserService) {
    }

    ngOnInit(): void {
        this.fetchImage();
    }

    private fetchImage(delay: number = 0): Subscription {
        const id = this.userNid;

        return this.imagesProvider.getUserAvatar(id).delay(delay).subscribe((imageUrl: string) => {
            this.imageUrl = `${imageUrl}?refresh=${+Date.now()}`;
        });
    }

    public imageLoaded() {
        this.imgLoaded = true;
        this.imgError = false;
    }

    public imageError() {
        this.imgLoaded = false;
        this.imgError = true;
    }

    public showFileDialog() {
        if (this.edit) {
            this.modalService.openAvatarCrop((imageBase64: Base64EncodedString) => {

                this.imgError = false;
                this.imgLoaded = false;

                this.userService.uploadAvatar(imageBase64).then(() => {
                    this.imagesProvider.invalidateUserAvatar(this.userNid).delay(250).subscribe(() => {
                        this.fetchImage().add(() => {
                            // FIXME: turn the User into and Observable to remove this shite reload();
                            location.reload();
                        });
                    });
                });
            });
        }
    }
}
