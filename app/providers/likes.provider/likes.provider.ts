/**
 * LikesProvider deals with the likes within the application,
 * currently it's only possible to like the shard element
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ConfigurationService } from '../../shared/config/configuration.service';
import { Network } from '../network';
import { Observable } from 'rxjs/Observable';
import { ILikeStatus } from '../../modules/shard/types';

@Injectable()
export class LikesProvider extends Network {
    constructor(http: Http) {
        super(http);
    }

    /**
     * toggle like on the shard passed as a parameter
     * @param {number} shardId
     * @returns {Observable<ILikeStatus>}
     */
    toggleLike(shardId: number): Observable<ILikeStatus> {
        const url = ConfigurationService.api._LIKE_SHARD;

        return this.post(url, { shard: shardId }).map(this.serializeResponse);
    }
}
