import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { StateService } from 'ui-router-ng2';
import { ActionBarItemComponent } from '../../action-bar/action-bar-item/action-bar-item.component';
import { StatisticsBarComponent } from '../../action-bar/statistics-bar/statistics-bar.component';
import { ButtonComponent } from '../../button/button.component';
import { FollowButtonComponent } from '../../follow-button-component/follow-button.component';
import { IconComponent } from '../../icon/icon.component';
import { StarRatingComponent } from '../../star-rating-component/star-rating.component';
import { PopoverPlaceComponent } from './popover-place.component';
import { FollowService } from '../../../../shared/follow/follow.service';
import { PlaceService } from '../../../../shared/place/place.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';

describe('PopoverPlaceComponent', () => {
    let component: PopoverPlaceComponent;
    let fixture: ComponentFixture<PopoverPlaceComponent>;

    const mockPlaceData = {
        bit: 12345678,
        id: 1234,
        isFollowed: true
    };

    const mockLabels = {
        attraction: '',
        follow: '',
        followers: '',
        hotel: '',
        likes: '',
        place: '',
        planned: '',
        unfollow: ''
    };

    const followServiceStub = {};

    const stateServiceStub = {
        go: () => {
            return true;
        }
    };

    const placeServiceStub = {
        loadPlaceFullData$: (placeId) => {
            return Observable.of(mockPlaceData);
        }
    };

    // better to put beforeEach in aync mode because template and css loading from original component is done asynchronous (compileComponents)
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ActionBarItemComponent,
                ButtonComponent,
                FollowButtonComponent,
                IconComponent,
                PopoverPlaceComponent,
                StatisticsBarComponent,
                StarRatingComponent
            ],
            providers: [
                { provide: FollowService, useValue: followServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: PlaceService, useValue: placeServiceStub }
            ]
        })
            .overrideComponent(ActionBarItemComponent, {
                set: {
                    template: '<span>ActionBarItemComponent</span>'
                }
            })
            .overrideComponent(StarRatingComponent, {
                set: {
                    template: '<span>StarRatingComponent</span>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(PopoverPlaceComponent);

        component = fixture.componentInstance;
        component.labels = mockLabels;
    }));

    it('should work', () => {
        expect(component instanceof PopoverPlaceComponent).toBe(true);
    });

    it('should have a "goToLinkedPlace" method that redirects to profile page', async(() => {
        expect(typeof component.goToLinkedPlace).toBe('function');
    }));

    describe('should have ngOnInit method that initialize some values', () => {
        it('should have ngOnInit method', () => {
            expect(typeof component.ngOnInit).toBe('function');
        });

        it('should set statisticsItems with 3 items', async(() => {
            const expectedStatisticItemsLenght = 3;

            component.componentData = mockPlaceData;
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.statisticsItems.length).toEqual(expectedStatisticItemsLenght);
        }));

        it('should set isTargetPlaceLoaded to true', async(() => {
            component.componentData = mockPlaceData;
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.isTargetPlaceLoaded).toEqual(true);
        }));

        it('should set iconGlyph to "hotel" ', async(() => {
            component.componentData = {
                bit: ConfigurationService.shardsBitMask.placeHotel,
                id: 1
            };
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.iconGlyph).toEqual('hotel');
        }));

        it('should set iconGlyph to "place" ', async(() => {
            component.componentData = {
                bit: ConfigurationService.shardsBitMask.place,
                id: 1
            };
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.iconGlyph).toEqual('place');
        }));

        it('should set iconGlyph to "attraction" ', async(() => {
            component.componentData = {
                bit: ConfigurationService.shardsBitMask.placeAttraction,
                id: 1
            };
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.iconGlyph).toEqual('attraction');
        }));

        it('should set iconGlyph to empty string because it is default case', async(() => {
            component.componentData = mockPlaceData;
            fixture.detectChanges();
            component.ngOnInit();
            expect(component.iconGlyph).toEqual('');
        }));

    });
});
