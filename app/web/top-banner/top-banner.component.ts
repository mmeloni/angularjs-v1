import { Component, Input } from '@angular/core';

type LinkTarget = '_self' | '_blank';

@Component({
    selector: 'wn-banner-message',
    styleUrls: [ './top-banner.component.scss' ],
    template: `
        <div class="top-banner">
            <div class="top-banner-content">
                {{message}}
                <a *ngIf="!!link"
                   [href]="link"
                   [target]="linkTarget"
                   class="btn btn-success btn-top-banner">
                    {{linkMessage}}<span *ngIf="linkShowHellip">&hellip;</span>
                </a>
            </div>
        </div>
    `
})
export class TopBannerComponent {
    @Input() message: string = 'Welcome to Wayonara';
    @Input() link: string = null;
    @Input() linkMessage: string = 'Learn more';
    @Input() linkTarget: LinkTarget = '_blank';
    @Input() linkShowHellip: boolean = true;
}
