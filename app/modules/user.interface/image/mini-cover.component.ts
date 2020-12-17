import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { ConfigurationService } from '../../../shared/config/configuration.service';

@Component({
    selector: 'wn-mini-cover',
    templateUrl: 'mini-cover.component.html'
})
export class MiniCoverComponent implements OnInit {
    @Input() cssClasses: string;
    @Input() format: string;
    @Input() itemId: number;

    @Output() isPollingImageSrc? = new EventEmitter<boolean>();

    componentData: ImageServiceOptions;
    polling?: any = false;

    ngOnInit() {
        this.componentData = {
            default: ConfigurationService.defaultImages.shard,
            format: this.format,
            id: this.itemId,
            type: 'shard'
        };

        if (typeof this.polling === 'string') {
            this.polling = (this.polling === 'true');
        }
    }

    setIsPollingImageSrc(event: boolean) {
        this.isPollingImageSrc.next(event);
    }
}
