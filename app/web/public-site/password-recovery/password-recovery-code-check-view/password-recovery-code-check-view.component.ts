import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { StateService } from 'ui-router-ng2';

@Component({
    templateUrl: 'password-recovery-code-check-view.component.html'
})

export class PasswordRecoveryCodeCheckViewComponent implements AfterViewInit, OnInit {
    @Input() translationResolved;

    @ViewChild('autofocusControl') autofocusControl: ElementRef;

    model = {
        authCode: null
    };
    labels: any;

    constructor(
        private stateService: StateService
    ) {
        //
    }

    ngOnInit() {
        this.initLabels();
    }

    ngAfterViewInit() {
        this.autofocusControl.nativeElement.focus();
    }

    onSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.stateService.go('newPassword', { code: this.model.authCode, nid: this.stateService.params.nid });
    }

    private initLabels() {
        this.labels = {
            codeCheck: this.translationResolved.publicSite.codeCheck
        };
    }
}
