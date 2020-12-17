import * as _ from 'lodash';

import { ConfigurationService } from '../../shared/config/configuration.service';

export class HelperShardService {

    static getInstance<T>(context: Object, name: string, ...args: any[]): T {
        let instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return instance as T;
    }

    static initObject(object: any) {
        let newObject = {};
        _.map(object, (value, key) => {

            newObject[key] = value;
        });
        return newObject;
    }

    static populate(object: any, values: any) {
        _.map(object, (value, key) => {
            if (values[key]) {
                object[key] = values[key];
            }
            HelperShardService.mapRelatedPlaceId(object, values);
        });
    }

    static mapRelatedPlaceId(object: any, values: any) {
        switch (values.bit) {
            case ConfigurationService.shardsBitMask.place:
                // if place object is itself a geoplace, it has null geoplace property, so it must catch its id as relatedPlaceId
                if (values['geoplace'] !== null) {
                    object['relatedPlaceId'] = values['geoplace']['id'];
                } else {
                    object['relatedPlaceId'] = values['id'];
                }
                break;
            case ConfigurationService.shardsBitMask.placeAttraction:
                if (values['geoplace'] !== null) {
                    object['relatedPlaceId'] = values['geoplace']['id'];
                } else {
                    // TODO: refactor this service to avoid inconsistency on response data getting rid of initObject and improve populate method
                }
                break;
            case ConfigurationService.shardsBitMask.placeHotel:
                if (values['geoplace'] !== null) {
                    object['relatedPlaceId'] = values['geoplace']['id'];
                } else {
                    // TODO: refactor this service to avoid inconsistency on response data getting rid of initObject and improve populate method
                }
                break;
            default:
                break;
        }
    }
}
