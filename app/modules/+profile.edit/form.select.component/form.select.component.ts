import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { uniqueId } from 'lodash';
import { Options } from './types';

@Component({
    selector: 'wn-form-select',
    styleUrls: [ './form.select.component.scss' ],
    template: `
        <div class="form-group wayonara-form-select">
            <label [for]="id">
                {{label}}
            </label>
            <select class="form-control" [id]="id" (change)="handleChange($event)"
                    [(ngModel)]="model">
                <option>{{label.toLocaleLowerCase()}}</option>
                <option *ngFor="let option of options" [value]="option.value">
                    {{option.label}}
                </option>
            </select>
        </div>
    `
})
export class FormSelectComponent implements OnInit {
    @Input() model: any = '';
    @Input() name: string;
    @Input() options: Options = [];
    @Input() label: string = 'Label';

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    public id: string;

    ngOnInit() {
        const uid = uniqueId();
        this.id = `wn-selkt-${uid}`;
        if (!this.name) {
            throw new Error('Model is missing');
        }
    }

    public handleChange($event) {
        const target: HTMLSelectElement = ($event.target || $event.srcElement) as HTMLSelectElement;
        const { value } = target;
        const name = this.name;

        this.onChange.emit({ value, name });
    }
}
