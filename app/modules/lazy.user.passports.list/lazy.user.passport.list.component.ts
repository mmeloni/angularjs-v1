/**
 * The LazyUserPassportListComponent deals with polling users data from the server
 * and arrange them into a simple grid, users can be users that the current user is
 * following or users that are currently following the current user.
 * The component itself is depending from the "angular2-infinite-scrolling" directive:
 * https://www.npmjs.com/package/angular2-infinite-scroll
 * TODO: the used infinite scrolling directive is actually DEPRECATED,
 * TODO: as soon as angular is updated to a new version, please update the directive module
 */

import {
    Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges,
    EventEmitter, Output
} from '@angular/core';
import { User } from '../../shared/user/user.model';
import { UserService } from '../../shared/user/user.service';
import { ApiResponse, UsersListStreamType } from './types';

@Component({
    selector: 'wn-lazy-users-list',
    styleUrls: [ './lazy.user.passports.list.component.scss' ],
    templateUrl: './lazy.user.passports.list.component.html'
})
export class LazyUserPassportListComponent implements OnInit, OnChanges, OnDestroy {
    /* FIXME: please, find a better way to translate the application and remove this disgusting property */
    @Input() translations;

    /**
     * ------------------------------------------------------------------------
     * Input variables:
     * ------------------------------------------------------------------------
     */

    /**
     * represent the stream type.
     * @type {string}
     */
    @Input() streamType: UsersListStreamType = 'following';

    /**
     * The current logged user.
     */
    @Input() user: User;

    /**
     * ------------------------------------------------------------------------
     * Output variables:
     * ------------------------------------------------------------------------
     */

    /**
     * Event emitted once a server response arrive, no matter if the response is empty or not
     * @type {EventEmitter<ApiResponse[]>}
     */
    @Output() onResponse: EventEmitter<ApiResponse[]> = new EventEmitter();

    @Output() onFollowButtonToggle: EventEmitter<{ isFollowed: boolean, listLength: number }> = new EventEmitter();

    /**
     * ------------------------------------------------------------------------
     * Local variables:
     * ------------------------------------------------------------------------
     */

    /**
     * Current stream page, used to fetch data as a provider parameter
     * @type {number}
     */
    private currentStreamPage: number = 1;

    /**
     * It's true only when got an empty response from the server.
     * Means there are no more users available to show
     * @type {boolean}
     */
    public gotEmptyResponse: boolean = false;

    /**
     * fetching flag
     * @type {boolean}
     */
    public isFetching: boolean = false;

    /**
     * Array of users items
     * @type {ApiResponse[]}
     */
    public list: ApiResponse[] = []; // the grid

    /**
     * class constructor
     * @param {UserService} userService
     */
    constructor(private userService: UserService) {
    }

    /**
     * When component get initialized fetch data and attach method to the onscroll event
     */
    public ngOnInit(): void {

        this.fetchData();

        window.onscroll = () => {
            if (this.list.length > 0 && !this.isFetching) {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    this.fetchNextPageData();
                }
            }
        };
    }

    /**
     * When the currentStream changes reset the local variables and fetch data.
     * Basically it means that the grid has been re-initialized with a new currentStream and the
     * previous data should be destroyed
     * @param {SimpleChanges} changes
     */
    public ngOnChanges({ streamType }: SimpleChanges): void {
        if (!this.isFetching && streamType && streamType.currentValue !== streamType.previousValue) {
            // reset initial variables values
            this.currentStreamPage = 1;
            this.gotEmptyResponse = false;
            this.list = [];
            this.streamType = streamType.currentValue;

            this.fetchData();
        }
    }

    /**
     * When component get destroyed remove window.onscroll method
     */
    public ngOnDestroy(): void {
        window.onscroll = null;
    }

    /**
     * fetch data from service according to the currentStream and the current page
     */
    private fetchData(delayResponse: number = 0): void {
        if (!this.isFetching && !this.gotEmptyResponse) {
            const user = this.user;
            this.isFetching = true;

            if (this.streamType === 'following') {
                this.userService.getUserFollowing$(user.nid, this.currentStreamPage)
                    .distinctUntilChanged()
                    .delay(delayResponse) // prevent to continuous scrolling
                    .subscribe((response) => this.addItems(response), null, () => this.isFetching = false);
            } else {
                this.userService.getUserFollowers$(user.nid, this.currentStreamPage)
                    .distinctUntilChanged()
                    .delay(delayResponse) // prevent to continuous scrolling
                    .subscribe(
                        (response: ApiResponse[]) => {
                            this.onResponse.emit(response);
                            this.addItems(response);
                        },
                        null,
                        () => this.isFetching = false
                    );
            }
        }
    }

    /**
     * Add items to the local grid
     * @param {ApiResponse[]} response
     */
    private addItems(response: ApiResponse[]) {
        response.forEach((item) => {
            this.list.push(item);
        });
    }

    /**
     * increment page number use it to fetch data from the server.
     */
    public fetchNextPageData(): void {
        if (!this.isFetching && !this.gotEmptyResponse) {
            this.currentStreamPage = this.currentStreamPage + 1;

            this.fetchData(100); // delay to prevent continuous scrolling
        }
    }

    public followButtonToggle(isFollowed): void {
        const listLength = this.list.length;
        this.onFollowButtonToggle.emit({ isFollowed, listLength });
    }
}
