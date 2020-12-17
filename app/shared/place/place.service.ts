import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class PlaceService {

    constructor(
        private http: Http,
        private sessionService: SessionService
    ) {
        //
    }

    loadPlaceFullData(placeId: number): Promise<any> {
        const url = ConfigurationService.api._GET_SHARD_BY_ID
                        .replace(':shardId', placeId.toString())
                        .replace(':selector', ConfigurationService.shardBuilderSelector.full);

        return this.http.get(url, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    // note: 'place' model is different from object returned by loadPlaceFull$, so we can't bind respodne to <Place> type.In addition loadPlaceFull$ could potentially return place, placeHotel and placeAttraction objects, so we need
    // additional models, our 'place' model is not sufficent to cover those properties.
    loadPlaceFullData$(placeId: number): Observable<any> {
        const url = ConfigurationService.api._GET_SHARD_BY_ID
                        .replace(':shardId', placeId.toString())
                        .replace(':selector', ConfigurationService.shardBuilderSelector.full);

        return this.http.get(url, this.getOptions())
                        .map(this.extractData);
    }

    getSuggestedPlaces(): Promise<any> {
        return this.http.get(ConfigurationService.api._ONBOARDING_SUGGESTED_PLACES, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    private extractData(response: Response) {
        let body = response.json();
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        return body || { };
    }

    private getOptions(): RequestOptions {
        let headers: Headers = new Headers({
            Authorization: 'Bearer ' + this.sessionService.getToken()
        });

        let options = new RequestOptions({ headers: headers });
        options.headers = headers; // TODO: is this line redundant?

        return options;
    }
}
