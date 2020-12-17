import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { S3 } from 'aws-sdk';

import { ConfigurationService } from '../config/configuration.service';
import { UploadService } from '../upload/upload.service';
import { ImageServiceOptions } from './image-service-options.model';

@Injectable()
export class ImageService {
    private mimeType = 'image/jpeg';
    private endpoint;

    constructor(private uploadService: UploadService) {
    }

    getImageFromAWS$(options: ImageServiceOptions): Observable<File> {
        const filename = ImageService.buildImageFilename(options.format, options.id);
        this.endpoint = ConfigurationService.awsCdn.endpoint;
        if (options.type === 'shard' || options.type === 'cover') {
            this.endpoint = ConfigurationService.awsCdn.endpointcf;
        }
        return this.uploadService.getObjectFromAWS$(filename, ConfigurationService.awsCdn.buckets[ options.type ], this.endpoint, this.mimeType)
            .map((s3Data: S3.GetObjectOutput) => {
                return new File([ s3Data.Body as Blob ], filename, { type: this.mimeType });
            })
            .catch((error) => {
                const emptyFile = new File([], filename, { type: this.mimeType });
                return Observable.of(emptyFile);
            });
    }

    public getImageUrlFromAWS$(options: ImageServiceOptions): Observable<any> {
        const filename = ImageService.buildImageFilename(options.format, options.id);
        this.endpoint = ConfigurationService.awsCdn.endpoint;
        if (options.type === 'shard' || options.type === 'cover') {
            this.endpoint = ConfigurationService.awsCdn.endpointcf;
        }
        return this.uploadService.getObjectUrlFromAWS$(filename, ConfigurationService.awsCdn.buckets[ options.type ], this.endpoint, this.mimeType);
    }

    static buildImageFilename(format, id): string {
        return [
            ConfigurationService.awsCdn.imgFormats[ format ],
            id,
            '.jpeg'
        ].join('');
    }
}
