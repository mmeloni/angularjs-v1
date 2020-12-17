import { Injectable } from '@angular/core';

import { ConfigurationService } from '../../shared/config/configuration.service';
import { SessionService } from '../../shared/session/session.service';
import { ToastService } from '../commons/toast/toast.service';

@Injectable()
export class HelperPublicSiteService {

    constructor(
        private toastService: ToastService,
        private sessionService: SessionService
    ) {
        //
    }

    onAuthenticationSuccess(token: string) {
        this.sessionService.currentUserJwt$.next(token);
    }

    onAuthenticationError(error: any, labels: any): any {
        let message;
        let result = {
            email: '',
            password: '',
            username: ''
        };
        const errorBody = error.json();

        // delete this block once the back-end returns 'email' or 'username' inside error.message
        if (errorBody.message.indexOf('username') !== -1) {
            errorBody.message = 'username';
        } else if (errorBody.message.indexOf('email') !== -1) {
            errorBody.message = 'email';
        }

        const subject = labels[errorBody.message];

        switch (error.status) {
            case ConfigurationService.httpStatusCodes.conflict:
                message = [subject, labels.http.alreadyTaken].join(': ');
                result[errorBody.message] = labels.http.alreadyTaken;
                break;
            case ConfigurationService.httpStatusCodes.notAcceptable:
                result[errorBody.message] = labels.http.notAcceptable;
                message = [subject, labels.http.notAcceptable].join(': ');
                break;
            case ConfigurationService.httpStatusCodes.unauthorized:
                result.username = labels.http.unauthorized;
                result.password = labels.http.unauthorized;
                message = labels.http.unauthorized;
                break;
            case ConfigurationService.httpStatusCodes.serverError:
                message = labels.http.serverError;
                break;
            default:
                message = labels.http.serverError;
                break;
        }

        this.toastService.raiseDanger(message);

        return result;
    }
}
