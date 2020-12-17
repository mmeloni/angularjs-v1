import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { uniqueId } from 'lodash';
import { I18nService } from '../../../shared/translation/i18n.service';
import { AutocompleteProvider } from './autocomplete.provider';
import { City } from './types';

@Component({
    selector: 'wn-form-input-city-autocomplete',
    styleUrls: [ './form.input.city.autocomplete.component.scss' ],
    template: `
        <div class="form-group wayonara-form-input-city-autocomplete">
            <label [for]="id">{{label}}:<span *ngIf="required">*</span></label>
            <input [type]="type" class="form-control" [id]="id"
                   [name]="name"
                   [placeholder]="placeholder"
                   [required]="required"
                   (keyup)=handleChange($event)
                   [autocomplete]="'off'"
                   [value]="model" />
        </div>
        <div class="cities-list" *ngIf="response && response.length > 0">
            <ul>
                <li *ngFor="let item of response" (click)="setCity(item)">
                    {{item.label}}
                </li>
            </ul>
        </div>
    `
})
export class FormInputCityAutocompleteComponent implements OnInit {
    @Input() model: any = '';
    @Input() name: string;
    @Input() type: string = 'text';
    @Input() label: string = 'Label';
    @Input() errorMessage: string = 'Error';
    @Input() placeholder: string;
    @Input() required: boolean = false;
    @Input() maxLength: number = 150;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    public id: string;
    public response: City[] = [];

    constructor(private translationsService: I18nService, private autocompleteProvider: AutocompleteProvider) {

    }

    ngOnInit() {
        const uid = uniqueId();
        this.id = `wn-inpt-aut-${uid}`;
        if (!this.name) {
            throw new Error('Field is missing');
        }
    }

    public handleChange($event: KeyboardEvent) {
        const target: HTMLInputElement = ($event.target || $event.srcElement) as HTMLInputElement;
        const { value } = target;

        if (value.length > 3) {
            const locale = this.translationsService.getCurrentLocale();
            this.autocompleteProvider.getCities(value, locale).subscribe((response: City[]) => {
                this.response = response;
            });
        } else {
            this.response = [];
        }
    }

    public setCity(city: City) {
        this.onChange.emit(city);
        this.response = [];
    }
}
