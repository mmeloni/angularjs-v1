import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyBoardsGridComponent } from './lazy.boards.grid.component';
import { BoardsProvider } from '../../providers/boards.provider';
import { BoardModule } from '../board/board.module';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

@NgModule({
    declarations: [ LazyBoardsGridComponent ],
    exports: [ LazyBoardsGridComponent ],
    entryComponents: [ LazyBoardsGridComponent ],
    imports: [ CommonModule, BoardModule, InfiniteScrollModule ],
    providers: [ BoardsProvider ]
})
export class LazyBoardsGridModule {
}
