import { DebugElement }    from '@angular/core';
import { ComponentFixture, TestBed, async, getTestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';

import { AuthorInfoComponent } from '../../author-info/author-info.component';
import { AuthorInfo } from '../../author-info/author-info.model';
import { TestimonialComponent } from './testimonial.component';

describe('TestimonialComponent:', () => {
    let component: TestimonialComponent;
    let fixture: ComponentFixture<TestimonialComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestimonialComponent,
                AuthorInfoComponent
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TestimonialComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('blockquote'));
        htmlElement = debugElement.nativeElement;
    });

    it('should work', () => {
        expect(component instanceof TestimonialComponent).toBe(true, 'should create TestimonialComponent');
    });

    it('should get generic CSS classes for its main container', () => {
        const mockCssClasses = 'foo bar';
        const htmlElement = fixture.debugElement.nativeElement;

        expect(htmlElement.innerHTML).not.toContain(`class="${mockCssClasses}"`);

        component.cssClasses = mockCssClasses;
        fixture.detectChanges();

        expect(htmlElement.innerHTML).toContain(`class="${mockCssClasses}"`);
    });

    it('should be optionally centered', () => {
        expect(htmlElement.innerHTML).not.toContain('text-center');

        component.centered = true;
        fixture.detectChanges();

        expect(htmlElement.innerHTML).toContain('text-center');
    });

    it('should get a quote and display it', () => {
        const mockQuote = 'Foo bar baz foobar baz';

        component.quote = mockQuote;
        fixture.detectChanges();

        expect(htmlElement.innerText).toContain(mockQuote);
        expect(htmlElement.innerHTML).not.toContain('<footer');
    });

    describe('When it also gets a source:', () => {
        it('should always display the source title', () => {
            const mockSource: AuthorInfo = {
                title: 'Foo bar'
            };

            component.source = mockSource;
            fixture.detectChanges();

            expect(htmlElement.innerText).toContain(mockSource.title);
            expect(htmlElement.innerHTML).not.toContain('href="');
            expect(htmlElement.innerHTML).not.toContain('<img');
        });

        it('should optionally link the source title to the source URL', () => {
            const mockSource: AuthorInfo = {
                title: 'Foo bar',
                url: new URL('http://www.example.com')
            };

            component.source = mockSource;
            fixture.detectChanges();

            expect(htmlElement.innerText).toContain(mockSource.title);
            expect(htmlElement.innerHTML).toContain('href="');
        });

        it('should optionally display the source subtitle', () => {
            const mockSource: AuthorInfo = {
                subtitle: 'Baz baz',
                title: 'Foo bar'
            };

            component.source = mockSource;
            fixture.detectChanges();

            expect(htmlElement.innerText).toContain(mockSource.title);
            expect(htmlElement.innerText).toContain(mockSource.subtitle);
        });

        it('should optionally display the source image', () => {
            const mockSource: AuthorInfo = {
                imageSrc: 'foo-bar.png',
                title: 'Foo bar'
            };

            component.source = mockSource;
            fixture.detectChanges();

            expect(htmlElement.innerText).toContain(mockSource.title);
            expect(htmlElement.innerHTML).toContain('<img');
        });
    });
});
