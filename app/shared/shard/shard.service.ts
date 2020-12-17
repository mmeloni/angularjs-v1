import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { ConfigurationService } from '../../shared/config/configuration.service';
import { SessionService } from '../../shared/session/session.service';
import { UploadService } from '../../shared/upload/upload.service';
import { GPSCoordinates } from '../../web/commons/file-upload/gps-coordinates.model';
import { ShardComment } from '../../web/commons/modal/modal-shard-detail/shard-comments/shard-comment.model';
import { Shard } from './shard.model';

@Injectable()
export class ShardService {

    constructor(
        private http: Http,
        private sessionService: SessionService,
        private uploadService: UploadService
    ) {
        //
    }

    static buildShardUploadFilename(filename: string, userId: number, shardId: number): string {
        const regExp = new RegExp(ConfigurationService.fileExtRegex);
        const extension = regExp.exec(filename)[1];

        return ['_todelete_',
                userId,
                '_',
                shardId,
                '.',
                extension].join('');
    }

    uploadPhoto(file: File, uploadFilename: string): Promise<any> {
        return this.uploadService.uploadContentSaneVersion(file, 'shard', uploadFilename);
    };

    createShards(shardArray: Shard[]) {
        const params = { shards: shardArray };
        return this.http.post(ConfigurationService.api._ADD_SHARDS, params, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    };

    getShards(query: string, pageNumber?: number) {
        pageNumber = pageNumber || 1;
        const apiUrl = ConfigurationService.api._GET_SHARDS
            .replace(':selector', ConfigurationService.shardBuilderSelector.stream);
        const body = {
            page: pageNumber,
            queryString: query
        };

        return this.http.post(apiUrl, body, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    };

    getShardById(id: number) {
        const apiUrl = ConfigurationService.api._GET_SHARD_BY_ID
            .replace(':shardId', id.toString())
            .replace(':selector', ConfigurationService.shardBuilderSelector.full);

        return this.http.get(apiUrl, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    getShardById$(id: number): Observable<Shard> {
        const apiUrl = ConfigurationService.api._GET_SHARD_BY_ID
            .replace(':shardId', id.toString())
            .replace(':selector', ConfigurationService.shardBuilderSelector.full);

        return this.http.get(apiUrl, this.getOptions())
                        .map(this.extractData);
    }

    // Where does this come from???
    // Why the params object is called 'options'???
    // TODO: Refactor & destroy ASAP
    getShardStreamByOptions(options: any) {
        const apiUrl = ConfigurationService.api._GET_SHARDS
            .replace(':selector', ConfigurationService.shardBuilderSelector.stream);

        return this.http.post(apiUrl, options, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    // NOTE: THIS LOGIC HAS BEEN CENTRALIZED IN LIKESERVICE, delete from it and refactor approppriate code when spreading new like button component
    toggleLike(shardId: number) {
        const apiUrl = ConfigurationService.api._LIKE_SHARD;
        const body = {
            shard: shardId
        };

        return this.http.post(apiUrl, body, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    // Classic Promise version, for use with legacy code
    getAutocompleteData(needle: string, locale: string, bitmask: number) {
        const apiUrl = ConfigurationService.api._GET_AUTOCOMPLETE_DATA
            .replace(':needle', needle)
            .replace(':locale', locale)
            .replace(':bitMask', bitmask.toString());

        return this.http.get(apiUrl, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    };

    // Observable version, for use with ng-bootstrap typeahead
    getAutocompleteDataObservable(needle: string, locale: string, bitmask: number) {
        const apiUrl = ConfigurationService.api._GET_AUTOCOMPLETE_DATA
            .replace(':needle', needle)
            .replace(':locale', locale)
            .replace(':bitMask', bitmask.toString());

        return this.http.get(apiUrl, this.getOptions())
                        .map(this.extractData);
    };

    buildShardFromUrl(url: URL): Promise<any> {
        const params = { url: url.href };

        return this.http.post(ConfigurationService.api._BUILDSHARDFROMURL, params, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    };

    getPoisByCoordinates$(coordinates: GPSCoordinates): Observable<any> {
        return this.http.post(ConfigurationService.api._GET_POI_FROM_COORDS, coordinates, this.getOptions())
                        .map(this.extractData);
    }

    getComments$(shardId: number, page: number): Observable<ShardComment[]> {
        const apiUrl = ConfigurationService.api._GET_COMMENTS
            .replace(':shardId', shardId.toString())
            .replace(':page', page.toString());

        return this.http.get(apiUrl, this.getOptions())
                        .map(this.extractData);
    };

    addComment$(shardId: number, comment: string) {
        const params = { shard: shardId, text: comment };

        return this.http.post(ConfigurationService.api._INSERT_COMMENT, params, this.getOptions())
                        .map(this.extractData);
    };

    static getShardBitByPoiBit(poiBit: number): number {
        let shardBit: number;

        switch (poiBit) {
            case ConfigurationService.autocompleteRolesBitMask.city:
                shardBit = ConfigurationService.shardsBitMask.stage;
                break;
            case ConfigurationService.autocompleteRolesBitMask.hotel :
                shardBit = ConfigurationService.shardsBitMask.hotel;
                break;
            case ConfigurationService.autocompleteRolesBitMask.attraction :
                shardBit = ConfigurationService.shardsBitMask.attraction;
                break;
            default:
                shardBit = ConfigurationService.shardsBitMask.photo;
                break;
        }

        return shardBit;
    }

    private extractData(response: Response) {
        // remember check status error 401 || 403 and redirect window.reload /
        let body = response.json();
        if (typeof body === 'string') {
            if (body === 'like_added') {
                body = true;
            }

            if (body === 'like_deleted') {
                body = false;
            }
            // body = JSON.parse(body);
        }
        return body || {};
    }

    private getOptions(): RequestOptions {
        let headers: Headers = new Headers({
            Authorization: 'Bearer ' + this.sessionService.getToken()
        });

        let options = new RequestOptions({ headers: headers });
        options.headers = headers;

        return options;
    }
}
