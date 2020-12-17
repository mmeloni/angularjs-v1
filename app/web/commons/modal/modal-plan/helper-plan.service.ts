import { Injectable } from '@angular/core';

import { I18nService } from '../../../../shared/translation/i18n.service';
import { User } from '../../../../shared/user/user.model';
import { UserService } from '../../../../shared/user/user.service';
import { ToastService } from '../../../commons/toast/toast.service';
import { TutorialMessageService } from '../../../tutorial-message/tutorial-message.service';

@Injectable()
export class HelperPlanService {
    constructor(
        private userService: UserService,
        private tutorialMessageService: TutorialMessageService,
        private toastService: ToastService,
        private i18nService: I18nService
    ) {
        //
    }

    completeOnBoarding() {
        let user: User = this.userService.setOnboardingPlanDone();

        this.userService.updateUserData(user).then((response) => {
            user = this.userService.deserialize(response);
            this.userService.setUser(user);
        });

        this.tutorialMessageService.hideTutorialMessage();

        const message = this.i18nService.getTranslationLabels().onboardingActions.planSuccess;
        this.toastService.raiseSuccess(message);
    }
}
