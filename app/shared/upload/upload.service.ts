import { Injectable, NgZone } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AWSError, Credentials, S3 } from 'aws-sdk';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';

declare const EXIF: any;

@Injectable()
export class UploadService {
    private credentials: Credentials;

    constructor(private http: Http,
                private ngZone: NgZone,
                private sessionService: SessionService) {
        this.credentials = new Credentials({
            accessKeyId: ConfigurationService.awsCdn.key,
            secretAccessKey: ConfigurationService.awsCdn.secret
        });
    }

    getObjectFromAWS$(key, bucket, endpoint, mimeType): Observable<S3.GetObjectOutput> {
        const params: S3.GetObjectRequest = {
            Bucket: bucket,
            Key: key,
            ResponseCacheControl: 'no-cache, no-store, must-revalidate', // No, really, I'm telling you I want this object.
            ResponseContentType: mimeType
        };
        const getObjectPromise = new Promise((resolve, reject) => {
            this.getS3Instance(endpoint).getObject(params, (error: AWSError, data: S3.GetObjectOutput) => {
                if (error !== null) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        return Observable.fromPromise(getObjectPromise);
    }

    public getObjectUrlFromAWS$(key, bucket, endpoint, mimeType): Observable<any> {
        const params: S3.GetObjectRequest = {
            Bucket: bucket,
            Key: key,
            ResponseCacheControl: 'no-cache, no-store, must-revalidate', // No, really, I'm telling you I want this object.
            ResponseContentType: mimeType
        };

        const getObjectPromise = new Promise((resolve, reject) => {
            this.getS3Instance(endpoint).getSignedUrl('getObject', params, (error: AWSError, data: S3.GetObjectOutput) => {
                if (error) {
                    return reject(error);
                }

                return resolve(data);
            });
        });

        return Observable.fromPromise(getObjectPromise);
    }

    // uploadContent
    uploadContent(file, type, name) {
        return this.createSignedUri(type, name)
            .then((response) => {
                return response.data.signedUri;
            })
            .then((signedUri) => {
                return this.http.put(signedUri, file)
                    .toPromise();
            })
            .catch(function (error) {
                throw error;
            });
    };

    uploadContentSaneVersion(file, type, name) {
        return this.createSignedUri(type, name)
            .then((response) => {
                return response.data.signedUri;
            })
            .then((signedUri) => {
                return this.http.put(signedUri, file)
                    .toPromise()
                    .then(this.extractData);
            })
            .catch(function (error) {
                throw error;
            });
    };

    // getS3Instance
    private getS3Instance(endpoint): S3 {
        const s3Instance = new S3({
            credentials: this.credentials,
            endpoint: endpoint,
            region: ConfigurationService.awsCdn.region
        });
        return s3Instance;
    }

    // Calls createSignedUri api
    private createSignedUri(type, name) {
        const body = {
            filename: name,
            type: type
        };
        return this.http.post(ConfigurationService.api._GET_AWS_SIGNED_URI, body, this.getOptions())
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    // Calls extractData
    private extractData(response: Response) {
        try {
            return response.json();
        } catch (error) {
            return {};
        }
    }

    // handleError
    private handleError(error: Response) {
        // TODO: log error
    }

    // getOptions
    private getOptions(): RequestOptions {
        let headers: Headers = new Headers({
            Authorization: 'Bearer ' + this.sessionService.getToken()
        });

        let options = new RequestOptions({ headers: headers });
        options.headers = headers; // TODO: is this line redundant?

        return options;
    }
}
