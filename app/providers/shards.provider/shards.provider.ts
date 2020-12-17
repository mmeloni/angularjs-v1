/**
 * The BoardsProvider is responsible for handling HTTP calls to the board's API.
 * This provider has an internal cache in order to avoid useless network calls.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from '../../shared/config/configuration.service';
import { CachableNetwork } from '../network';
import { Shard } from '../../modules/shard/types';
import { ShardsGridStreamType } from '../../modules/lazy.shards.grid/types';

@Injectable()
export class ShardsProvider extends CachableNetwork<Shard> {

    constructor(http: Http) {
        super(http);
    }

    /**
     * Return shards according to a stream type.
     * This method it's just a wrapper of some other methods of this class.
     * @param {ShardsGridStreamType} streamType
     * @param {number} pageNumber
     * @param {number} userNid
     * @returns {Observable<Shard[]>}
     */
    public getShardsByStreamType(streamType: ShardsGridStreamType = 'stream', pageNumber: number = 1, userNid?: number): Observable<Shard[]> {
        switch (streamType) {
            default:
            case 'stream':
                return this.getStandardStream(pageNumber);
            case 'user-stages':
                return this.getStageShards(userNid, pageNumber);
            case 'user-tours':
                return this.getToursShards(userNid, pageNumber);

        }
    }

    /**
     * get the public stream
     * @param {number} pageNumber
     * @returns {Observable<Shard[]>}
     */
    public getStandardStream(pageNumber: number = 1): Observable<Shard[]> {
        const url = ConfigurationService.api._GET_SHARDS_ON_STREAM.replace(/{page}/, pageNumber.toString());

        return this.get(url)
            .map(this.serializeResponse)
            .map(({ shards }) => shards)
            .map((shards) => this.cache.storeArrayBy('id', shards));
    }

    /**
     * get the user's stage shards
     * @param {number} userNid
     * @param {number} pageNumber
     * @returns {Observable<Shard[]>}
     */
    public getStageShards(userNid: number, pageNumber: number = 1): Observable<Shard[]> {
        const url = ConfigurationService.api._GET_SHARDS.replace(/:selector/, 'STREAM');
        const params = { user: userNid, page: pageNumber, sortMode: 2 };

        return this.post(url, params)
            .map(this.serializeResponse)
            .map(({ shards }) => shards)
            .map((shards) => this.cache.storeArrayBy('id', shards));
    }

    /**
     * get the user's tour shards
     * @param {number} userNid
     * @param {number} pageNumber
     * @returns {Observable<Shard[]>}
     */
    public getToursShards(userNid: number, pageNumber = 1): Observable<Shard[]> {
        const url = ConfigurationService.api._GET_SHARDS.replace(/:selector/, 'STREAM');
        const bit = ConfigurationService.shardsBitMask.tour;
        const params = { user: userNid, page: pageNumber, bit, sortMode: 2 };

        return this.post(url, params)
            .map(this.serializeResponse)
            .map(({ shards }) => shards)
            .map((shards) => this.cache.storeArrayBy('id', shards));
    }

    /**
     * get a full shard by ID
     * @param {number} shardId
     * @returns {Observable<Shard>}
     */
    public getShardById(shardId: number): Observable<Shard> {
        const cached = this.cache.get(shardId);

        if (!!cached) {
            return Observable.of(cached);
        } else {

            const url = ConfigurationService.api._GET_SHARD_BY_ID
                .replace(':shardId', shardId.toString())
                .replace(':selector', ConfigurationService.shardBuilderSelector.full);

            return this.get(url)
                .map(this.serializeResponse)
                .map((shard) => this.cache.put(shardId, shard));
        }
    }
}
