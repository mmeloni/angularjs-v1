import { Component, Input, OnDestroy, OnInit, animate, state, style, transition, trigger } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TutorialMessageState } from './tutorial-message-state.model';
import { TutorialMessageService } from './tutorial-message.service';

@Component({
    animations: [
        trigger('slideInOut', [
            state('in', style({transform: 'translateY(0)'})),
            state('out', style({transform: 'translateY(100%)'})),
            transition('out => in', [
                style({transform: 'translateY(100%)'}),
                animate('300ms ease-in')
            ]),
            transition('in => out', [
                style({transform: 'translateY(0)'}),
                animate('300ms ease-out')
            ])
        ])
    ],
    selector: 'wn-tutorial-message',
    styleUrls: ['tutorial-message.component.scss'],
    templateUrl: 'tutorial-message.component.html'
})
export class TutorialMessageComponent implements OnDestroy, OnInit {
    stateOptions: TutorialMessageState;
    message: string;

    private subscriptionShowHide: Subscription;
    private subscriptionMessage: Subscription;

    constructor(
        private tutorialMessageService: TutorialMessageService
    ) {
        this.subscriptionShowHide = this.tutorialMessageService.state$.subscribe((newState) => {
            this.stateOptions = newState;
        });
    }

    ngOnInit() {
        this.subscriptionMessage = this.tutorialMessageService.message$.subscribe((newMessage) => {
            this.message = newMessage;
        });
    }

    animationStart(event) {
        this.tutorialMessageService.animationStart(event);
    }

    animationDone(event) {
        this.tutorialMessageService.animationDone(event, this.stateOptions.callback);
    }

    ngOnDestroy() {
        if (this.subscriptionShowHide !== undefined) {
            this.subscriptionShowHide.unsubscribe();
        }

        if (this.subscriptionMessage !== undefined) {
            this.subscriptionMessage.unsubscribe();
        }
    }
}
