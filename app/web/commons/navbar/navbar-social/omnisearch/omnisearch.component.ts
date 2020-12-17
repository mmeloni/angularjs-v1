import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'ui-router-ng2';

import { ConfigurationService } from '../../../../../shared/config/configuration.service';
import { ShardService } from '../../../../../shared/shard/shard.service';
import { I18nService } from '../../../../../shared/translation/i18n.service';
import { OmnisearchQuery } from './omnisearch-query.model';

@Component({
    selector: 'wn-omnisearch',
    styleUrls: ['omnisearch.component.scss'],
    templateUrl: 'omnisearch.component.html'
})
export class OmnisearchComponent implements OnInit {
    @Input() cssClasses: string;
    @Input() labels: any;

    model = new OmnisearchQuery();
    isSearching: boolean;

    private placeholderValue: string;

    constructor(
        private stateService: StateService,
        private shardService: ShardService,
        private i18nService: I18nService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        //
    }

    ngOnInit() {
        this.isSearching = false;
    }

    onSubmit(item?: any) {
        const tagType = (item !== undefined) ? item.tagType : undefined;
        switch (tagType) {
            case 'user':
                // this.stateService.go('profile.view', { userId: item.nid });
                this.stateService.go('profileById', { userNid: item.nid });
                break;
            case 'hotel':
                this.stateService.go('hotel', { hotelId: item.linkedPlaceId });
                break;
            case 'place':
                this.stateService.go('place', { placeId: item.linkedPlaceId });
                break;
            case 'attraction':
                this.stateService.go('attraction', { placeId: item.linkedPlaceId });
                break;
            case 'shards':
                this.stateService.go('search', this.model);
                break;
            default:
                this.stateService.go('search', this.model);
                break;
        }
    }

    onFocus(event) {
        this.placeholderValue = event.target.placeholder;
        event.target.placeholder = '';
    }

    onBlur(event) {
        event.target.placeholder = this.placeholderValue;
    }

    // So that we don't have to bind(this)
    searchResult = (text$: Observable<string>) => {
        const itemTypesBitMask = ConfigurationService.autocompleteRolesBitMask.all;
        const searchDelay = 300;

        return text$
            .debounceTime(searchDelay)
            .distinctUntilChanged()
            .do(() => this.isSearching = true)
            .do(() => this.changeDetectorRef.detectChanges())
            .switchMap((term) => {
                return this.shardService.getAutocompleteDataObservable(term, this.i18nService.getCurrentLocale(), itemTypesBitMask)
                    .map((response) => {
                        const users = response.users;
                        const pois = response.pois;
                        let results = users.concat(pois);

                        // Add special 'Search Shards by description' result
                        results.unshift({
                            intro: this.labels.searchAllShards + ': ',
                            label: this.model.text,
                            tagType: 'image' // so that we can have a proper icon
                        });

                        return results;
                    })
                    .catch(() => {
                        return Observable.of([]);
                    });
            })
            .do(() => this.isSearching = false)
            .do(() => this.changeDetectorRef.detectChanges());
    }

    formatResult = (result: { label: string }) => {
        return result.label;
    }

    selectItem(event: NgbTypeaheadSelectItemEvent) {
        const item = event.item;
        this.onSubmit(item);
    }
}
