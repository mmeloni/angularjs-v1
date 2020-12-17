// FIXME: this component should be deprecated as moving to the new Angular version

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { ConfigurationService } from '../../../shared/config/configuration.service';

@Component({
    selector: 'wn-avatar',
    styleUrls: [ './avatar.component.scss' ],
    templateUrl: './avatar.component.html'
})
export class AvatarComponent implements OnInit {
    @Input() userId: number;
    @Input() shape?: string = 'circle';
    @Input() size?: string = 'sm';
    @Input() cssClasses?: string = '';

    // TODO: this Input is of type `any` instead of `boolean` because AngularJS seems to always pass strings to Angular
    // and the type checking gets somehow by-passed.
    // Delete it once the application is full Angular or we ported all the occurrences
    // of the AngularJS Image directive.
    @Input() polling?: any = false;

    @Output() pollingEnded = new EventEmitter<void>();

    imageOptions: ImageServiceOptions;
    classesComputed: string[] = [];

    private shapeCssClassMap = {
        circle: 'img-circle',
        square: 'img-rounded'
    };

    ngOnInit() {
        // TODO: this guard is here because AngularJS seems to always pass strings to Angular
        // and the type checking gets somehow by-passed.
        // Delete it once the application is full Angular or we ported all the occurrences
        // of the AngularJS Image directive.
        if (typeof this.polling === 'string') {
            this.polling = (this.polling === 'true');
        }

        const format = 'avatar';
        this.imageOptions = {
            default: ConfigurationService.defaultImages[ format ],
            format: 'avatar',
            id: this.userId,
            type: 'user'
        };

        this.classesComputed.push(this.shapeCssClassMap[ this.shape ]);
        this.classesComputed.push(this.size);
        this.classesComputed.push(this.cssClasses);

        console.warn('AvatarComponent is actually deprecated, please remove it and use UserProfileCoverComponent instead');
    }

    emitIfFalse(event) {
        if (event === false) {
            this.pollingEnded.next();
        }
    }
}
