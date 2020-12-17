import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';

@Component({
    selector: 'wn-image',
    templateUrl: 'image.component.html'
})
export class ImageComponent implements OnInit {
    @Input() componentData: ImageServiceOptions;
    @Input() cssClasses: string;

    // TODO: this Input is of type `any` instead of `boolean` because AngularJS seems to always pass strings to Angular
    // and the type checking gets somehow by-passed.
    // Delete it once the application is full Angular or we ported all the occurrences
    // of the AngularJS Image directive.
    @Input() polling?: any = false;

    @Output() isPollingImageSrc? = new EventEmitter<boolean>();

    imageSrc: string;

    ngOnInit() {
        // TODO: this guard is here because AngularJS seems to always pass strings to Angular
        // and the type checking gets somehow by-passed.
        // Delete it once the application is full Angular or we ported all the occurrences
        // of the AngularJS Image directive.
        if (typeof this.polling === 'string') {
            this.polling = (this.polling === 'true');
        }
    }

    setIsPollingImageSrc(event: boolean) {
        this.isPollingImageSrc.next(event);
    }
}
