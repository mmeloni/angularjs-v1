/**
 * The BoardsProvider is responsible for handling HTTP calls to the board's API.
 * This provider has an internal cache in order to avoid useless network calls.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from '../../shared/config/configuration.service';
import { CachableNetwork } from '../network';
import { Boards } from '../../modules/board/types';

@Injectable()
export class BoardsProvider extends CachableNetwork<any> {

    constructor(http: Http) {
        super(http);
    }

    /**
     * return current user's boards
     * @param {number} pageNumber
     * @param {number} pageSize
     * @returns {Observable<Board>}
     */
    public getUserBoards(pageNumber: number = 1, pageSize: number = 20): Observable<Boards> {
        const url = ConfigurationService.api._RETRIEVE_BOARDS;
        const params = { page: pageNumber, numberBoards: pageSize, sortMode: 2 };

        return this.post(url, params)
            .map(this.serializeResponse)
            .map((boards: Boards) => this.cache.storeArrayBy('id', boards));
    }

    /**
     * return user's boards
     * @param {number} nid
     * @param {number} pageNumber
     * @param {number} pageSize
     * @param {number} shardsPerBoard
     * @returns {Observable<Boards>}
     */
    public getBoards(nid: number, pageNumber: number = 1, pageSize: number = 20, shardsPerBoard: number = 4): Observable<Boards> {
        const url = ConfigurationService.api._RETRIEVE_USER_BOARDS;

        const params = {
            nid,
            page: pageNumber,
            numberBoards: pageSize,
            sortMode: 2,
            numberShardsForBoard: shardsPerBoard
        };

        return this.post(url, params)
            .map(this.serializeResponse)
            .map((boards: Boards) => this.cache.storeArrayBy('id', boards));
    }
}
