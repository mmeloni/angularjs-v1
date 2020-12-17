import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { BoardsProvider } from '../../providers/boards.provider';
import { Boards } from '../board/types';
import { UsersListStreamType } from '../lazy.user.passports.list/types';
import { User } from '../../shared/user/user.model';

@Component({
    selector: 'wn-lazy-boards-grid',
    styleUrls: [ './lazy.boards.grid.component.scss' ],
    templateUrl: './lazy.boards.grid.component.html'
})
export class LazyBoardsGridComponent implements OnInit, OnChanges, OnDestroy {

    /* FIXME: please, find a better way to translate the application and remove this disgusting property */
    @Input() translations;

    /**
     * ------------------------------------------------------------------------
     * Input variables:
     * ------------------------------------------------------------------------
     */

    /**
     * The user reference
     */
    @Input() user: User;

    /**
     * Event emitted once a server response arrive, no matter if the response is empty or not
     * @type {EventEmitter<Boards>}
     */
    @Output() onResponse: EventEmitter<Boards> = new EventEmitter();

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
     * Array of boards items
     * @type {Boards}
     */
    public grid: Boards = []; // the grid

    /**
     * class constructor
     * @param {BoardsProvider} boardsProvider
     */
    constructor(private boardsProvider: BoardsProvider) {
    }

    /**
     * When component get initialized fetch data and attach method to the onscroll event
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
            this.currentStreamPage = 1;
            this.gotEmptyResponse = false;
            this.grid = [];

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
            this.isFetching = true;

            this.boardsProvider.getBoards(this.user.nid, this.currentStreamPage)
                .distinctUntilChanged()
                .delay(delayResponse)
                .subscribe((response: Boards) => {
                        this.onResponse.emit(response);
                        this.addItems(response);
                    },
                    null,
                    () => this.isFetching = false);
        }
    }

    /**
     * Add items to the local grid
     * @param {Boards} response
     */
    private addItems(response: Boards) {
        response.forEach((item) => {
            this.grid.push(item);
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
}
