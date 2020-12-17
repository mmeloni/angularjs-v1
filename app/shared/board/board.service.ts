import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ConfigurationService } from '../../shared/config/configuration.service';
import { SessionService } from '../../shared/session/session.service';

@Injectable()
export class BoardService {

    constructor(
        private http: Http,
        private sessionService: SessionService
    ) {
        //
    }

    updateBoard(board: any) {
        const apiPath = ConfigurationService.api._UPDATE_BOARD;
        return this.http.post(apiPath, board, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    // saveBoard(board: any) {
    planShardsToBoard(boardRequest) {
        const apiPath = ConfigurationService.api._PLAN_SHARDS_TO_BOARD;
        return this.http.post(apiPath, boardRequest, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    getUserBoards(page?: number, numberBoards?: number) {
        const pageNumber = page || 1;
        const apiPath = ConfigurationService.api._RETRIEVE_BOARDS;
        const body = {
            page: pageNumber,
            pageSize: numberBoards
        };
        return this.http.post(apiPath, body, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    }

    private extractData(response: Response) {
        // remember check status error 401 || 403 and redirect window.reload /
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
}
