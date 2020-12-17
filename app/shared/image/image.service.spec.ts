import { TestBed, async, getTestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { S3 } from 'aws-sdk';

import { UploadService } from '../upload/upload.service';
import { ImageServiceOptions } from './image-service-options.model';
import { ImageService } from './image.service';

describe('ImageService:', () => {
    let service: ImageService;
    const mockOptions: ImageServiceOptions = {
        default: 'foo.jpg',
        format: '_baz',
        id: 123,
        type: 'shard'
    };

    beforeEach(() => {
        const uploadServiceStub = {};
        service = new ImageService(uploadServiceStub as UploadService);
    });

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof ImageService).toBe(true);
    });

    it('should have a static "buildImageFilename" method to get a proper image filename', () => {
        expect(typeof ImageService.buildImageFilename).toBe('function');

        const expectedFilename = '_avatar_1.jpeg';
        expect(ImageService.buildImageFilename('avatar', 1)).toBe(expectedFilename);
    });
});
