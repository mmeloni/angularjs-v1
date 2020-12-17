import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { TutorialMessageComponent } from './tutorial-message.component';
import { TutorialMessageService } from './tutorial-message.service';

describe('TutorialMessageComponent:', () => {
    let component: TutorialMessageComponent;
    let fixture: ComponentFixture<TutorialMessageComponent>;

    beforeEach(() => {
        const tutorialMessageServiceStub = {
            message$: Observable.of('foo'),
            tutorialMessageShown$: Observable.of(true)
        };

        TestBed.configureTestingModule({
            declarations: [TutorialMessageComponent],
            providers: [TutorialMessageService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TutorialMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof TutorialMessageComponent).toBe(true, 'should create TutorialMessageComponent');
    });
});
