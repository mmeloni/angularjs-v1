/**
 * ImagesProvider deals with the AWS-SDK in order to get and store images urls.
 * The ImagesProvider has a local cache to avoid useless computational cost.
 * FIXME: As this provider mostly use the AWS-SDK, probably should not extends the CachableNetwork.
 * TODO: Create a local cache of just strings;
 */

import { Credentials, S3, CloudFront } from 'aws-sdk';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CachableNetwork } from '../network';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from '../../shared/config/configuration.service';
import { BucketType, ImageFormat, ShardBackgroundImageSize } from './types';

@Injectable()
export class ImagesProvider extends CachableNetwork<string> {

    /**
     * the credentials to access the AWS bucket
     * @type {Credentials}
     */
    private credentials: Credentials = new Credentials({
        accessKeyId: ConfigurationService.awsCdn.key,
        secretAccessKey: ConfigurationService.awsCdn.secret
    });

    /**
     * instance of the current AWS bucket
     * @type {S3}
     */
    private s3Buckets: S3 = new S3({
        credentials: this.credentials,
        endpoint: ConfigurationService.awsCdn.endpointcf, // do not change this endpoint
        region: ConfigurationService.awsCdn.region
    });

    /**
     * Instance of the current AWS CloudFront
     * @type {CloudFront}
     */
    private cloudFront: CloudFront = new CloudFront({
        credentials: this.credentials
    });

    /**
     * a shortcut to the image formats object from the App configuration
     */
    private imageFormats = ConfigurationService.awsCdn.imgFormats;

    /**
     * a shortcut to the buckets format object from the App configuration
     */
    private buckets = ConfigurationService.awsCdn.buckets;

    /**
     * class constructor
     * @param {Http} http
     */
    constructor(http: Http) {
        super(http);
    }

    /**
     * get a standard aws request object
     * @param {string} filename
     * @param {string} bucketKey
     * @returns {S3.GetObjectRequest}
     */
    private getAWSRequestObject(filename: string, bucketKey: BucketType): S3.GetObjectRequest {
        return {
            Bucket: this.buckets[ bucketKey ],
            Key: filename,
            ResponseCacheControl: 'no-cache, no-store, must-revalidate',
            ResponseContentType: 'image/jpeg'
        };
    }

    /**
     * return a unique image id
     * @param {string} id
     * @param {ImageFormat} format
     * @returns {string}
     */
    private getImageId(id: string, format: ImageFormat) {
        const name = this.imageFormats[ format ];
        return `${name}${id}.jpeg`;
    }

    /**
     * perform a getSignedUrl method from the S3 bucket instance
     * @param {S3.GetObjectRequest} request
     * @returns {Observable<string>}
     */
    private requireImage(request: S3.GetObjectRequest): Observable<string> {
        const getSignedUrl = Observable.bindCallback(this.s3Buckets.getSignedUrl.bind(this.s3Buckets)) as Function;

        return getSignedUrl('getObject', request)
            .map((response) => {
                // response = [error, imageUrl]
                const error = response[ 0 ];
                const imageUrl = response[ 1 ];

                if (error) {
                    return Observable.throw(error);
                }

                return imageUrl;
            });
    }

    /**
     * invalidate a series of images passed as a relative paths
     * @param {string[] | string} relativePaths
     * @returns {Observable<string>}
     */
    private invalidateImages(relativePaths: string[] | string): Observable<string> {
        const { distributionId } = ConfigurationService.awsCdn.cloudFront;
        const callerReference: string = `${+Date.now()}`;

        const items = relativePaths instanceof Array ? relativePaths : [ relativePaths ];

        const request: CloudFront.Types.CreateInvalidationRequest = {
            DistributionId: distributionId,
            InvalidationBatch: {
                CallerReference: callerReference,
                Paths: {
                    Quantity: items.length,
                    Items: items
                }
            }
        };

        // LOCAL FUNCTION
        function recursGetInvalidationStatus(cloudFront, id, callback, delay: number = 0) {
            const params = {
                DistributionId: distributionId,
                Id: id
            };

            setTimeout(() => {
                cloudFront.getInvalidation(params, (err, response) => {
                    if (response.Invalidation.Status === 'InProgress') {
                        return recursGetInvalidationStatus(cloudFront, id, callback, 2000);
                    } else {
                        return callback(response.Invalidation);
                    }
                });
            }, delay);
        }

        const createInvalidation = Observable.bindCallback(this.cloudFront.createInvalidation.bind(this.cloudFront)) as Function;
        const getInvalidationStatus = Observable.bindCallback(recursGetInvalidationStatus) as Function;

        return createInvalidation(request).flatMap((response) => {
            // response = [error, imageUrl]
            const error = response[ 0 ];
            const invalidation = response[ 1 ] || {};
            const { Id } = invalidation;

            if (error) {
                return Observable.throw(error);
            }

            if (invalidation.Status === 'InProgress') {
                return getInvalidationStatus(this.cloudFront, Id).delay(1000);
            } else {
                return invalidation.Status;
            }
        });
    }

    /**
     * return the shard item image url
     * @param {string} masterId
     * @param {ShardBackgroundImageSize} size
     * @returns {Observable<string>}
     */
    public getShardItemBackground(masterId: string | number, size: ShardBackgroundImageSize = 'single'): Observable<string> {
        const id = masterId.toString();
        const imageName = this.getImageId(id, size);
        const cachedImage = this.cache.get(imageName);

        if (cachedImage) {
            return Observable.of(cachedImage);
        }

        const request = this.getAWSRequestObject(imageName, 'shard');

        return this.requireImage(request).map((imageUrl) => this.cache.put(imageName, imageUrl));
    }

    /**
     * Return User's cover image.
     * As the ImagesProvider implement a local cache,
     * it is possible to avoid cached responses by passing true to the 'disableCache' parameter.
     * @param {string | number} userNid
     * @param {boolean} disableCachedResp
     * @returns {Observable<string>}
     */
    public getUserCover(userNid: string | number, disableCachedResp = false): Observable<string> {
        const id = userNid.toString();
        const imageName = this.getImageId(id, 'cover');

        const cachedImage = this.cache.get(imageName);

        if (!disableCachedResp && cachedImage) {
            return Observable.of(cachedImage);
        }

        const request = this.getAWSRequestObject(imageName, 'user');

        return this.requireImage(request)
            .map((imageUrl) => (imageUrl.split('?')[ 0 ]))
            .map((imageUrl) => this.cache.put(imageName, imageUrl));
    }

    /**
     * Invalidate and remove the user's cover from the server
     * @param {string | number} userNid
     * @returns {Observable<string>}
     */
    public invalidateUserCover(userNid: string | number): Observable<string> {
        const id = userNid.toString();
        const imageName = this.getImageId(id, 'cover');
        const awsReq = this.getAWSRequestObject(imageName, 'user');

        const items = [ `/${awsReq.Bucket}/${awsReq.Key}` ];

        return this.invalidateImages(items);
    }

    /**
     * return the user's profile avatar image url
     * @param {string | number} userNid
     * @returns {Observable<string>}
     */
    public getUserAvatar(userNid: string | number): Observable<string> {
        const id = userNid.toString();
        const imageName = this.getImageId(id, 'avatar');

        const cachedImage = this.cache.get(imageName);

        if (cachedImage) {
            return Observable.of(cachedImage);
        }

        const request = this.getAWSRequestObject(imageName, 'user');

        return this.requireImage(request)
            .map((imageUrl) => (imageUrl.split('?')[ 0 ]))
            .map((imageUrl) => this.cache.put(imageName, imageUrl));
    }

    /**
     * Invalidate and remove the user's profile avatar from the server
     * @param {string | number} userNid
     * @returns {Observable<string>}
     */
    public invalidateUserAvatar(userNid: string | number): Observable<string> {
        const id = userNid.toString();
        const imageName = this.getImageId(id, 'avatar');
        const awsReq = this.getAWSRequestObject(imageName, 'user');

        const items = [ `/${awsReq.Bucket}/${awsReq.Key}` ];

        return this.invalidateImages(items);
    }
}
