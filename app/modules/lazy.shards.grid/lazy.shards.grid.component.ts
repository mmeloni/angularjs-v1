/**
 * The LazyShardGridComponent deals with polling shards items data from the server
 * and arrange them into an ordered resizable grid.
 * The component itself is depending from the "angular2-infinite-scrolling" directive.
 * Please check the directive documentation at:
 * https://www.npmjs.com/package/angular2-infinite-scroll
 * FIXME: the used infinite scrolling directive is actually DEPRECATED,
 * TODO: as soon as angular is updated to a new version, please update the directive module
 */

import {
    Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges,
    Output, EventEmitter
} from '@angular/core';
import {
    CallbackResponse, GridItemSize, GridItemsPerRow, IGridItem,
    ShardsGridStreamType
} from './types';
import { ShardsProvider } from '../../providers/shards.provider';
import { Shard, Shards } from '../shard/types';
import { User } from '../../shared/user/user.model';

@Component({
    selector: 'wn-lazy-shards-grid',
    styleUrls: [ './lazy.shards.grid.component.scss' ],
    templateUrl: './lazy.shards.grid.component.html'
})
export class LazyShardsGridComponent implements OnInit, OnChanges, OnDestroy {

    /* FIXME: please, find a better way to translate the application and remove this disgusting property */
    @Input() translations;

    /**
     * ------------------------------------------------------------------------
     * Input variables:
     * ------------------------------------------------------------------------
     */

    /**
     * Represent the items per row number,
     * once the data are fetched, the grid will be arranged according to this number.
     * Could be 4 for a full-length grid, ex: the stream page or 3 for a grid of max 3 elements
     * useful with page with a sidebar, es: the user profile page.
     * @type {number}
     */
    @Input() itemsPerRow: GridItemsPerRow = 4;

    /**
     * represent the stream type.
     * @type {string}
     */
    @Input() streamType: ShardsGridStreamType = 'stream';

    /**
     * As the grid show only shards components, it needs a user to fetch data
     * @type {User}
     */
    @Input() user: User;

    /**
     * indicates whether or not to show an empty response message from the server
     * @type {boolean}
     */
    @Input() showEmptyResponseMessage: boolean = true;

    /**
     * the empty response message
     * @type {string}
     */
    @Input() emptyResponseMessage: string = 'That\'s all, folks!';

    /**
     * ------------------------------------------------------------------------
     * Output events
     * ------------------------------------------------------------------------
     */

    /**
     * Event emitted once a server response arrive, no matter if empty or not
     * @type {EventEmitter<CallbackResponse>}
     */
    @Output() onResponse: EventEmitter<CallbackResponse> = new EventEmitter();

    /**
     * Event emitted once an empty server response arrive
     * @type {EventEmitter<null>}
     */
    @Output() onEmptyResponse: EventEmitter<null | undefined> = new EventEmitter();

    /**
     * ------------------------------------------------------------------------
     * Local component variables:
     * ------------------------------------------------------------------------
     */

    /**
     * Current line size, used to by the arrangeGrid method
     * @type {number}
     */
    private currLineSize: number = 0;

    /**
     * Current stream page, used to fetch data as a provider parameter
     * @type {number}
     */
    private currStreamPage: number = 1;

    /**
     * It's true only when got an empty response from the server.
     * Means there are no more shards available to show
     * @type {boolean}
     */
    public gotEmptyResp: boolean = false;

    /**
     * fetching flag
     * @type {boolean}
     */
    public isFetching: boolean = false;

    /**
     * Array of grid items, a grid item contains the referred shard info and the arrange properties
     * @type {any[]}
     */
    public grid: IGridItem[] = []; // the grid

    constructor(private shardsProvider: ShardsProvider) {
    }

    /**
     * When component get initialized fetch data and attach the onscroll method
     */
    public ngOnInit(): void {

        this.fetchData();

        window.onscroll = () => {
            if (this.grid.length > 0 && !this.isFetching) {
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
            this.currLineSize = 0;
            this.currStreamPage = 1;
            this.gotEmptyResp = false;
            this.grid = [];
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
     * Arrange shards data into the grid
     * @param {Shards} shards
     * @returns {Shards}
     */
    private arrangeGrid(shards: Shards): Shards {
        if (shards.length > 0) {
            shards.forEach((shard: Shard, index: number) => {
                const gridItem: IGridItem = {
                    shard,
                    size: this.getRandomShardSize(index + 1)
                };

                if (this.currLineSize >= this.itemsPerRow) {
                    this.currLineSize = 0;
                    gridItem.lastInARow = true;
                }

                this.grid.push(gridItem);
            });
        } else {
            this.gotEmptyResp = true;
            this.onEmptyResponse.emit();
            this.currStreamPage = this.currStreamPage > 1 ? this.currStreamPage - 1 : this.currStreamPage;
        }

        return shards;
    }

    /**
     * use currentLineSize component variable and shard's index to establish the shard size
     * into the grid. A random percentage number is also used.
     * @param {number} index
     * @returns {GridItemSize}
     */
    private getRandomShardSize(index: number): GridItemSize {
        // on mobile or tablets, the shard size is always single
        if (window.innerWidth < 1280) {
            return 'single';
        }

        const itemsPerRow = this.itemsPerRow;
        // As the grid show a double element randomly a random flag has been calculated
        const canBeDoubleItem = getRandomFlagByProbability(35);

        // if first position:
        if (canBeDoubleItem && (index % itemsPerRow === 0) && this.currLineSize === 0) {
            this.currLineSize = 2;
            return 'double';
        }

        if (this.itemsPerRow === 4) {
            // if second position:
            if (canBeDoubleItem && (index % 2 === 0) && this.currLineSize < 3) {
                this.currLineSize = this.currLineSize + 2;
                return 'double';
            }

            // if third position:
            if (canBeDoubleItem && (index % 3 === 0) && this.currLineSize < 2) {
                this.currLineSize = this.currLineSize + 2;
                return 'double';
            }
        }

        if (this.itemsPerRow === 3) {
            // if second position:
            if (canBeDoubleItem && (index === 2) && this.currLineSize === 1) {
                this.currLineSize = this.currLineSize + 2;
                return 'double';
            }
        }

        this.currLineSize = this.currLineSize + 1;
        return 'single';
    }

    /**
     * fetch data from service according to the currentStream and the current page
     * @param {number} msDelay
     */
    private fetchData(msDelay: number = 0): void {
        if (!this.isFetching && !this.gotEmptyResp) {
            const user = this.user;
            this.isFetching = true;

            this.shardsProvider.getShardsByStreamType(this.streamType, this.currStreamPage, user.nid)
                .distinctUntilChanged()
                .delay(msDelay) // prevent to continuous scrolling
                .subscribe((shards) => {

                        this.onResponse.emit({
                            response: shards,
                            page: this.currStreamPage
                        });

                        this.arrangeGrid(shards);
                    },
                    null,
                    () => this.isFetching = false);

        }
    }

    /**
     * increment page number use it to fetch data from the server.
     */
    public fetchNextPageData(): void {
        if (!this.isFetching && !this.gotEmptyResp) {
            this.currStreamPage = this.currStreamPage + 1;

            this.fetchData(100); // delay to prevent continuous scrolling
        }
    }
}

/**
 * randomly return a boolean flag according to the probability parameter;
 * @param {number} probability
 * @returns {boolean}
 */
const getRandomFlagByProbability = (probability: number = 35) => (
    Math.floor(Math.random() * 100) <= 100 - probability
);
