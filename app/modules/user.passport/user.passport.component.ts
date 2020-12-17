/**
 * The following component shows a quick recap of a single user's information,
 * can be used both inside a grid or as a standalone component.
 * To not be confused with the user profile page.
 *
 */
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { User } from '../../shared/user/user.model';
import { UserService } from '../../shared/user/user.service';
import { FollowService } from '../../shared/follow/follow.service';
import { ImagesProvider } from '../../providers/images.provider';
import { StateService } from 'ui-router-ng2';

@Component({
    selector: 'wn-profile-passport',
    styleUrls: [ 'user.passport.component.scss' ],
    templateUrl: 'user.passport.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UserPassportComponent implements OnInit, OnDestroy {
    /* FIXME: please, find a better way to translate the application and remove this disgusting property */
    @Input() translations;

    /**
     * ------------------------------------------------------------------------
     * Input variables:
     * ------------------------------------------------------------------------
     */

    /**
     * The user data to be shown
     */
    @Input() user: User;

    /**
     * If true, the component can affix to the top of the page during page scrolling;
     * @type {boolean}
     */
    @Input() affix: boolean = false;

    /**
     * If true, the component enable the edit mode to the avatar sub-component
     */
    @Input() edit: boolean = false;

    /**
     * if true show the follow button at the end of the passport
     * @type {boolean}
     */
    @Input() showFollowButton: boolean = false;

    /**
     * set to true if the current logged user is following this passport's user
     * @type {boolean}
     */
    @Input() following: boolean = false;

    /**
     * set to true if the current logged user is followed by this passport's user
     * @type {boolean}
     */
    @Input() followed: boolean = false;

    /**
     * ------------------------------------------------------------------------
     * Output events:
     * ------------------------------------------------------------------------
     */

    @Output() onFollowButtonToggle: EventEmitter<boolean> = new EventEmitter();

    /**
     * ------------------------------------------------------------------------
     * Local variables:
     * ------------------------------------------------------------------------
     */

    /**
     * true if the component is affixed
     * @type {boolean}
     */
    public isAffixed: boolean = false;

    /**
     * the current logged user
     * @type {User}
     */
    public currentUser: User;

    /**
     * true if the passport is showing in the current logged user's profile
     * @type {boolean}
     */
    public isCurrentUserProfile: boolean = false;

    /**
     * a local variable used in the scrollHandler method to the affix effect purpose
     */
    private previousElTopOffset: number;

    /**
     * component's constructor
     * @param {ImagesProvider} imagesProvider
     * @param {UserService} userService
     * @param {FollowService} followService
     * @param {StateService} routesService
     * @param {ElementRef} el
     */
    constructor(private imagesProvider: ImagesProvider,
                private userService: UserService,
                private followService: FollowService,
                private routesService: StateService,
                private el: ElementRef) {
        this.scrollHandler = this.scrollHandler.bind(this);
    }

    ngOnInit() {
        const userNid = this.user.nid;

        if (this.affix && window.innerWidth >= 1024) {
            window.addEventListener('scroll', this.scrollHandler);
        }

        this.currentUser = this.userService.getUser();
        this.isCurrentUserProfile = (this.currentUser.nid === userNid);
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this.scrollHandler);
    }

    public goToUserProfile(user: User = this.user) {
        const userNid = user.nid;
        this.routesService.go('profileById', { userNid });
    }

    private scrollHandler() {
        const el = this.el.nativeElement.querySelector('.profile-detail-panel');
        const scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);

        if (!this.isAffixed) {
            if (scrollTop > (el.offsetTop - 60)) {
                this.previousElTopOffset = scrollTop;
                this.isAffixed = true;
            }
        } else {
            if (scrollTop < this.previousElTopOffset) {
                this.isAffixed = false;
            }
        }
    }

    public onFollowToggle(isFollowed: boolean) {
        if (this.onFollowButtonToggle) {
            this.onFollowButtonToggle.emit(isFollowed);
        }
    }
}
