import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { BoardShardTileComponent } from './board.shard.tile/board.shard.tile.component';
import { BoardContentComponent } from './board.content/board.content.component';
import { BoardCoverComponent } from './board.cover/board.cover.component';
import { UserInterfaceModule } from '../user.interface/user.interface.module';
import { CommonModule } from '@angular/common';
import { ImagesProvider } from '../../providers/images.provider';
import { StateService } from 'ui-router-ng2';
import { Observable } from 'rxjs/Observable';
import { Board } from './types';

const mockedStateService = {
    go: () => ({})
};

const mockedImagesService = {
    getShardItemBackground: () => Observable.of('string')
};

const board: Board = {
    id: 1,
    title: 'Lorem Ipsum',
    description: '',
    countPlannedShards: 2,
    shards: []
};

describe('BoardComponent:', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BoardComponent,
                BoardCoverComponent,
                BoardContentComponent,
                BoardShardTileComponent
            ],
            imports: [ UserInterfaceModule, CommonModule ],
            providers: [
                { provide: ImagesProvider, useValue: mockedImagesService },
                { provide: StateService, useValue: mockedStateService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        htmlElement = debugElement.nativeElement;

        component.data = board;

        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof BoardComponent).toBe(true);
    });
});
