import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[wnURLWatcher]'
})
export class URLWatcherDirective implements OnInit {
    @Input() wnURLWatcherCallback?: Function;

    ngOnInit() {
        if (this.wnURLWatcherCallback === undefined) {
            this.wnURLWatcherCallback = (url: URL) => {
                //
            };
        }
    }

    @HostListener('paste', ['$event']) onPaste(event) {
        if (event.clipboardData.types.indexOf('text/plain') > -1) {
            this.processDataFromClipboard(event.clipboardData.getData('text/plain'));
            // Not sure if wanted at the moment
            // return false; // event.preventDefault()
        }
    }

    private processDataFromClipboard(data) {
        try {
            this.wnURLWatcherCallback(new URL(data));
        } catch (error) {
            // handle errors
        }
    }
}
