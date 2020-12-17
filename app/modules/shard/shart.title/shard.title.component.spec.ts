import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ShardTitleComponent } from './shard.title.component';

/**
 * Describe the test suite
 */
describe('ShardTitleComponent', () => {
    // our component;
    let component: ShardTitleComponent;
    // the fixture is a test environment for the component:
    let fixture: ComponentFixture<ShardTitleComponent>;
    // the rendered HTML
    let de: DebugElement;

    /**
     * Prepare the TestBed for this test suite.
     * A TestBed is just an NgModule specific for testing
     */
    beforeEach(async(() => {
        // import component and related services
        TestBed.configureTestingModule({
            declarations: [
                ShardTitleComponent // the single shard title and description component
            ]
        }).compileComponents();
    }));

    /**
     * setup variables
     */
    beforeEach(() => {
        fixture = TestBed.createComponent(ShardTitleComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        fixture.detectChanges();
    });

    // tests specs:

    it('should create', () => {
        expect(component).toBeDefined();
        expect(component).toBeTruthy();

        expect(component instanceof ShardTitleComponent).toBe(true);
    });

    it('should have a title', () => {
        expect(component.title).toBeDefined();
        expect(typeof component.title).toBe('string');
    });

    it('should have a description', () => {
        expect(component.description).toBeDefined();
        expect(typeof component.description).toBe('string');
    });
});
