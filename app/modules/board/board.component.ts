import { StateService } from 'ui-router-ng2';
import { Component, Input } from '@angular/core';
import { Board } from './types';

@Component({
    selector: 'wn-board',
    styleUrls: [ './board.component.scss' ],
    templateUrl: './board.component.html'
})
export class BoardComponent {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    @Input() data: Board;

    // Fixme: please use the standard angular routing system
    constructor(private routesService: StateService) {
    }

    goToBoardDetail(): void {
        const boardId = this.data.id;

        // Fixme: please use the standard angular routing system
        this.routesService.go('board.view', { boardId });
    }
}
