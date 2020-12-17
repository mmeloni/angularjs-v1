import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';

import { GPSCoordinates } from '../../web/commons/file-upload/gps-coordinates.model';
import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { UploadService } from '../upload/upload.service';
import { Shard } from './shard.model';
import { ShardService } from './shard.service';

describe('ShardService:', () => {
    let mockBackend: MockBackend;
    let service: ShardService;
    let defaultLocale: string;
    const mockResponseData = { foo: 'bar' };

    const sessionServiceStub = {
        getToken: () => { return 'token'; }
    };

    const uploadServiceStub = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                ShardService,
                MockBackend,
                BaseRequestOptions,
                {
                    deps: [MockBackend, BaseRequestOptions],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: UploadService, useValue: uploadServiceStub }
            ]
        });

        mockBackend = getTestBed().get(MockBackend);

        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                        body: mockResponseData
                    }
                )
            ));
        });

        // It's important to get the service after the mockBackend is established,
        // so that its constructor can use the mocked Http.
        service = getTestBed().get(ShardService);
    }));

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof ShardService).toBe(true);
    });

    it('should have a "getShardById" method to get shard passing an id', async(() => {
        expect(typeof service.getShardById).toBe('function');

        service.getShardById(1).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getShards" method to get shards passing a query object and a page number', async(() => {
        expect(typeof service.getShards).toBe('function');

        const query = 'foo';
        service.getShards(query, 1).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getShardStreamByOptions" method to get shard stage stream passing some options', async(() => {
        expect(typeof service.getShardStreamByOptions).toBe('function');
        const params = {
                bit: ConfigurationService.shardsBitMask.stage | ConfigurationService.shardsBitMask.hotel | ConfigurationService.shardsBitMask.attraction,
                page: 1,
                pageSize: 3,
                sortModeBm: ConfigurationService.sortBitMask.SCORE
            };
        service.getShardStreamByOptions(params).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "toggleLike" method to follow a place', async(() => {
        expect(typeof service.toggleLike).toBe('function');

        service.toggleLike(1).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getAutocompleteData" method to get data for various type of typeahead instances', async(() => {
        expect(typeof service.getAutocompleteData).toBe('function');

        service.getAutocompleteData('foo', 'bar', 1).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "createShards" method to create and post a batch of new shard data objects', async(() => {
        expect(typeof service.createShards).toBe('function');

        let shardArray: Shard[] = [];
        shardArray.push(new Shard());
        service.createShards(shardArray).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getPoisByCoordinates$" observable to get a grid of POIs filtered down by coordinates', async(() => {
        expect(typeof service.getPoisByCoordinates$).toBe('function');

        // no need to unsubscribe since we only use the first emission, then the Observable completes.
        service.getPoisByCoordinates$(new GPSCoordinates()).first().subscribe((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getComments$" observable to get the grid of comments for a Shard', async(() => {
        expect(typeof service.getComments$).toBe('function');
    }));

    it('should have a "addComment" observable to create a new comment for a Shard', async(() => {
        expect(typeof service.addComment$).toBe('function');
    }));
});
