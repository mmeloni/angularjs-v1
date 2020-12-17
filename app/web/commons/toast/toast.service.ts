import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { ToastConfig, ToastrService } from 'ngx-toastr';
import { RawParams, StateDeclaration } from 'ui-router-ng2';

import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { I18nService } from '../../../shared/translation/i18n.service';
import { ContextualVariant } from '../../utilities/contextual-variant.type';
import { ToastActionableComponent } from './toast-actionable/toast-actionable.component';

@Injectable()
export class ToastService {
    private options: ToastConfig;
    private translations: any;

    constructor(
        private toastrService: ToastrService,
        private i18nService: I18nService
    ) {
        this.options = this.toastrService.toastrConfig;
        this.options.onActivateTick = true;

        this.translations = this.i18nService.getTranslationLabels();
    }

    raiseSuccess(message) {
        this.raiseContextual(message, 'success');
    }

    raiseInfo(message) {
        this.raiseContextual(message, 'info');
    }

    raiseDanger(message) {
        this.raiseContextual(message, 'danger');
    }

    raiseActionable(message: string, toState: StateDeclaration, toParams: RawParams, imageOptions: ImageServiceOptions) {
        let options = _.cloneDeep(this.options);
        options.toastComponent = ToastActionableComponent;
        options.toastClass = 'toast padding-horizontal-none padding-vertical-none';

        let toastInstance = this.toastrService.info(message, null, options);

        toastInstance.portal.instance.componentData = {
            imageOptions: imageOptions,
            toParams: toParams,
            toState: toState
         };

        toastInstance.portal.instance.labels = {
            button: this.translations.open
        };
    }

    raisePlanned(params: any) {
        const toastHTML = `${this.translations.plannedIn}<br /><strong>${params.toTitle}</strong>`;
        const toState: StateDeclaration = params.toState;
        const toParams: RawParams = params.toParams;
        const imageOptions: ImageServiceOptions = params.imageOptions;

        this.raiseActionable(toastHTML, toState, toParams, imageOptions);
    }

    raiseNewShard(newShard) {
        const toParams: RawParams = { userNid: newShard.user.nid };
        const toState: StateDeclaration = 'profileById';
        const toastHTML = `${this.translations.shardedIt}<br /><strong>${this.translations.yourProfile}</strong>`;

        this.raiseActionable(toastHTML, toState, toParams, null);
    }

    private raiseContextual(message, type: ContextualVariant) {
        let options = _.cloneDeep(this.options);
        options.toastClass = 'toast text-center h3';

        // what's the typescript syntax to call methods when their name is stored in a variable?
        switch (type) {
            case 'danger':
                this.toastrService.error(message, null, options);
                break;
            case 'info':
                this.toastrService.info(message, null, options);
                break;
            case 'primary':
                // doesn't exists in Toastr (should we propose a PR?)
                break;
            case 'success' :
                this.toastrService.success(message, null, options);
                break;
            default:
                this.toastrService.info(message, null, options);
                break;
        }
    }
}
