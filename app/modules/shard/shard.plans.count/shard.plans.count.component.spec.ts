import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ShardPlansNumberComponent } from './shard.plans.count.component';
import { UserInterfaceModule } from '../../user.interface/user.interface.module';

/**
 * Describe the test suite
 */
describe('ShardPlansNumberComponent', () => {
    // our component;
    let component: ShardPlansNumberComponent;
    // the fixture is a test environment for the component:
    let fixture: ComponentFixture<ShardPlansNumberComponent>;
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
                ShardPlansNumberComponent // the single shard title and description component
            ],
            imports: [ UserInterfaceModule ]
        }).compileComponents();
    }));

    /**
     * setup variables
     */
    beforeEach(() => {
        fixture = TestBed.createComponent(ShardPlansNumberComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        component.count = 10;

        fixture.detectChanges();
    });

    // tests specs:

    it('should create', () => {
        expect(component).toBeDefined();
        expect(component).toBeTruthy();

        expect(component instanceof ShardPlansNumberComponent).toBe(true);
    });

    it('should have a count property', () => {
        expect(typeof component.count).toBe('number');
    });
});
