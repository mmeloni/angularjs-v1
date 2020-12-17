/**
 * CachableNetwork provider is a basic cache provider that implements standard caching methods.
 * It is intended not to be used or injected directly into components
 * but should be extended from other providers in order to archive code reuse
 * and avoid providers to re-implements common used methods.
 * This provider should be always extended by providers that deals with a server responses.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Network } from './network';
import { ProviderCache } from './cache';

@Injectable()
export class CachableNetwork<T> extends Network {

    public cache: ProviderCache<T> = new ProviderCache<T>();

    constructor(http: Http) {
        super(http);
    }
}
