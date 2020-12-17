import { Injectable } from '@angular/core';
import { ConfigurationService } from '../../../shared/config/configuration.service';
import { Network } from '../../../providers/network';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { City } from './types';

const { api, autocompleteRolesBitMask } = ConfigurationService;

@Injectable()
export class AutocompleteProvider extends Network {

    constructor(http: Http) {
        super(http);
    }

    getCities(needle: string, locale: string): Observable<City[]> {
        const bitmask = autocompleteRolesBitMask.city.toString();
        const url = api._GET_AUTOCOMPLETE_DATA
            .replace(':needle', needle)
            .replace(':locale', locale)
            .replace(':bitMask', bitmask);

        return this.get(url).map(this.serializeResponse).map(({ pois }) => pois);
    }
}
