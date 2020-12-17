/**
 * Network provider is a basic HTTP methods provider.
 * It expose methods to handle standard HTTP requests like GET, POST, PUT, etc.
 * It is intended not to be used or injected directly into components
 * but should be extended from other providers in order to archive code reuse
 * and avoid providers to re-implements common used methods
 */

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class Network {

    /**
     * Standard network headers
     * @type {Headers}
     */
    static headers: Headers = new Headers({
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });

    constructor(private http: Http) {
    }

    /**
     * Standard network request options
     * @returns {RequestOptions}
     */
    public get standardRequestOptions(): RequestOptions {
        const headers = Network.headers;
        return new RequestOptions({ headers });
    }

    /**
     * HTTP GET method
     * @param {string} url
     * @param {RequestOptions} reqOptions
     * @returns {Observable<Response>}
     */
    public get(url: string, reqOptions = this.standardRequestOptions): Observable<Response> {
        return this.http.get(url, reqOptions);
    }

    /**
     * HTTP POST method
     * @param {string} url
     * @param body
     * @param {RequestOptions} reqOptions
     * @returns {Observable<Response>}
     */
    public post(url: string, body: any, reqOptions = this.standardRequestOptions): Observable<Response> {
        return this.http.post(url, body, reqOptions);
    }

    /**
     * HTTP PUT method
     * @param {string} url
     * @param body
     * @param {RequestOptions} reqOptions
     * @returns {Observable<Response>}
     */
    public put(url: string, body: any, reqOptions = this.standardRequestOptions): Observable<Response> {
        return this.http.put(url, body, reqOptions);
    }

    /**
     * HTTP DELETE method
     * @param {string} url
     * @param {RequestOptions} reqOptions
     * @returns {Observable<Response>}
     */
    public delete(url: string, reqOptions = this.standardRequestOptions): Observable<Response> {
        return this.http.delete(url, reqOptions);
    }

    /**
     * This method set authorization token into the standard network headers
     * @param {string} token
     * @returns {Headers}
     */
    public static setAuthToken(token: string): Headers {
        Network.headers.set('Authorization', `Bearer ${token}`);
        return Network.headers;
    }

    /**
     * this method return turn a standard Response into a serialized json object
     * @param {Response} item
     * @returns {any}
     */
    public serializeResponse(item: Response): any {
        return item.json();
    }
}
