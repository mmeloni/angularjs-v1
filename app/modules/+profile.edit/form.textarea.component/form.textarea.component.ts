import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { uniqueId } from 'lodash';

@Component({
    selector: 'wn-textarea-input',
    styleUrls: [ './form.textarea.component.scss' ],
    template: `
        <div class="form-group wayonara-form-textarea"
             [ngClass]="{'has-error has-feedback': !modelName.valid && !modelName.pristine}">
            <label [for]="id">{{label}}:<span *ngIf="required">*</span></label>
            <textarea class="form-control fc-text-area" [id]="id"
                      [name]="name"
                      [placeholder]="placeholder"
                      [required]="required"
                      (keyup)=handleChange($event)
                      [(ngModel)]="model"
                      #modelName="ngModel"></textarea>
            <span class="help-block" [hidden]="modelName.valid || modelName.pristine">
                {{errorMessage}}
            </span>
            <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"
                  [hidden]="modelName.valid || modelName.pristine"></span>
        </div>
    `
})
export class FormTextareaComponent implements OnInit {
    @Input() model: any = '';
    @Input() name: string;
    @Input() label: string = 'Label';
    @Input() errorMessage: string = 'Error';
    @Input() placeholder: string;
    @Input() required: boolean = false;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    public id: string;

    ngOnInit() {
        const uid = uniqueId();
        this.id = `wn-textarea-${uid}`;
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
