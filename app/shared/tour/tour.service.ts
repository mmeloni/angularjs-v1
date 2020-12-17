import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ConfigurationService } from '../../shared/config/configuration.service';
import { SessionService } from '../../shared/session/session.service';

@Injectable()
export class TourService {

    constructor(
        private http: Http,
        private sessionService: SessionService
    ) {
        //
    }

    createTour$(tour: any) {
        const apiUrl = ConfigurationService.api.tour
            .replace('/:tourId', ''); // Ugly: I should be replacing the `:tourId` part only but - at the time of writing - the back-end returns an error if I don't remove also the `/`
        return this.http.post(apiUrl, tour, this.getOptions())
                        .map(this.extractData);
    };

    createRoundtripTour$(origShard: any, destShard: any) {
        const timeline = this.createRoundtripTimeline(origShard, destShard);

        const tour =  { shardsId: [origShard.id, destShard.id] , timeline : timeline };
        const apiUrl = ConfigurationService.api.tour
            .replace('/:tourId', ''); // Ugly: I should be replacing the `:tourId` part only but - at the time of writing - the back-end returns an error if I don't remove also the `/`
        return this.http.post(apiUrl, tour, this.getOptions())
                        .map(this.extractData);
    };

    updateTour$(tour: any) {
        const apiUrl = ConfigurationService.api.tour
            .replace(':tourId', tour.id);
        return this.http.put(apiUrl, tour, this.getOptions())
                        .map(this.extractData);
    }

    private extractData(response: Response) {
        let body = response.json();
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

    private createRoundtripTimeline(origShard: any, destShard: any) {
        let origin = Object.create(null);
        origin.model = Object.create(null);
        origin.model.id = origShard.id;
        origin.model.type = ConfigurationService.shardsBitMask.place;
        origin.model.category = 'shard';
        origin.model.name = origShard.title;
        origin.model.nearestPoiId = origShard.nearestPoiId;

        let destination = Object.create(null);
        destination.model = Object.create(null);
        destination.model.id = destShard.id;
        destination.model.type = ConfigurationService.shardsBitMask.place;
        destination.model.category = 'shard';
        destination.model.name = destShard.title;
        destination.model.nearestPoiId = destShard.nearestPoiId;

        let vector = Object.create(null);
        vector.model = Object.create(null);
        vector.model.type = ConfigurationService.vectorsBitMask.flight;
        vector.model.category = 'vehicle';

        let timeline = {0 : origin, 1 : vector, 2 : destination, 3 : vector, 4 : origin};

        return timeline;
    }
}
