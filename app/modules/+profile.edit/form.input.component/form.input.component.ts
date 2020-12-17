import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { uniqueId } from 'lodash';

@Component({
    selector: 'wn-form-input',
    styleUrls: [ './form.input.component.scss' ],
    template: `
        <div class="form-group wayonara-form-input"
             [ngClass]="{'has-error has-feedback': !modelName.valid && !modelName.pristine}">
            <label [for]="id">{{label}}:<span *ngIf="required">*</span></label>
            <input [type]="type" class="form-control" [id]="id"
                   [name]="name"
                   [placeholder]="placeholder"
                   [required]="required"
                   [maxlength]="maxLength"
                   (keyup)=handleChange($event)
                   [(ngModel)]="model"
                   #modelName="ngModel" />
            <span class="help-block" [hidden]="modelName.valid || modelName.pristine">
                {{errorMessage}}
            </span>
            <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"
                  [hidden]="modelName.valid || modelName.pristine"></span>
        </div>
    `
})
export class FormInputComponent implements OnInit {
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

    ngOnInit() {
        const uid = uniqueId();
        this.id = `wn-inpt-${uid}`;
        if (!this.name) {
            throw new Error('Field name is missing');
        }
    }

    public handleChange($event: KeyboardEvent) {
        const target: HTMLInputElement = ($event.target || $event.srcElement) as HTMLInputElement;
        const { value } = target;
        const name = this.name;

        this.onChange.emit({ value, name });
    }
}
