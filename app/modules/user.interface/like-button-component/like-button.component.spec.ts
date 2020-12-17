import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserInterfaceModule } from '../user.interface.module';
import { LikeButtonComponent } from './like-button.component';
import { LikesProvider } from '../../../providers/likes.provider/likes.provider';

describe('LikeButtonComponent:', () => {
    let component: LikeButtonComponent;
    let fixture: ComponentFixture<LikeButtonComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(async(() => {

        const likeServiceStub = {
            toggleLike: (targetId: number): Promise<boolean> => {
                return Promise.resolve(true);
            }
        };

        TestBed.configureTestingModule({
            imports: [
                UserInterfaceModule
            ],
            providers: [
                { provide: LikesProvider, useValue: likeServiceStub }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LikeButtonComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('button'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof LikeButtonComponent).toBe(true, 'should create LikeButtonComponent');
    });

});
