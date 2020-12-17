import { Component, Input, OnInit } from '@angular/core';

import { AuthorInfo } from './author-info.model';

@Component({
    selector: 'wn-author-info',
    styleUrls: ['author-info.component.scss'],
    templateUrl: 'author-info.component.html'
})

export class AuthorInfoComponent implements OnInit {
    @Input() author: AuthorInfo;
    @Input() cssClasses?: string;

    constructor() {
        //
    }

    ngOnInit() {
        //
    }
}
