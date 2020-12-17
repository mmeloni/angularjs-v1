import { Component, Input, OnInit } from '@angular/core';

import { AuthorInfo } from '../../author-info/author-info.model';

@Component({
    selector: 'wn-testimonial',
    styleUrls: ['./testimonial.component.scss'],
    templateUrl: 'testimonial.component.html'
})

export class TestimonialComponent implements OnInit {
    @Input() quote: string;
    @Input() source?: AuthorInfo;
    @Input() centered?: boolean;
    @Input() cssClasses?: string;

    constructor() {
        //
    }

    ngOnInit() {
        //
    }
}
