import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { StateService } from 'ui-router-ng2';

import { ConfigurationService } from '../../../shared/config/configuration.service';
import { Locale } from '../../../shared/config/locale.model';
import { SessionService } from '../../../shared/session/session.service';
import { I18nService } from '../../../shared/translation/i18n.service';
import { AuthorInfoComponent } from '../author-info/author-info.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { HomePublicComponent } from './home-public.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';
import { TopBannerModule } from '../../top-banner/top-banner.module';

describe('HomePublicComponent:', () => {
    let component: HomePublicComponent;
    let fixture: ComponentFixture<HomePublicComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;

    const mockLocale: Locale = _.find(ConfigurationService.locales, { code: 'EN' });

    const mockTranslationLabels = {
        publicSite: {
            commons: {
                footer: {
                    copyright: '',
                    madeInItalyIntro: '',
                    madeInItalyOutro: ''
                }
            },
            homePage: {
                footer: {
                    blog: '',
                    company: '',
                    faqs: '',
                    helpCenter: '',
                    howItWorks: '',
                    newsletter: {
                        mainAction: '',
                        subtitle: '',
                        title: ''
                    },
                    social: '',
                    support: ''
                },
                sectionImagePlanYourTrip: {
                    signIn: '',
                    signUp: '',
                    text: '',
                    title: ''
                },
                sectionImageSignUp: {
                    signUp: ''
                },
                sectionImageWaitAMinute: {
                    signUp: '',
                    text: '',
                    title: ''
                },
                sectionIntro: {
                    text: '',
                    title: ''
                },
                sectionStatistics: {
                    text: '',
                    title: ''
                },
                sectionTestimonials: {
                    text: '',
                    title: ''
                },
                statistics: {
                    //     'airlines': 'Airlines',
                    //     'rails': 'Rails (soon)',
                    //     'carRentals': 'Car rentals (soon)',
                    //     'hotels': 'Hotels (soon)',
                    //     'places': 'Places'
                },
                testimonials: [
                    {
                        quote: '',
                        source: {}
                    },
                    {
                        quote: '',
                        source: {}
                    },
                    {
                        quote: '',
                        source: {}
                    }
                ]
            }
        }
    };

    const i18nServiceStub = {
        getCurrentLocale: () => {
            return mockLocale.code;
        },

        getTranslationLabels: () => {
            return mockTranslationLabels;
        },

        loadTranslationLabels: (code): Promise<any> => {
            return Promise.resolve({});
        }
    };

    const stateServiceStub = {};

    const sessionServiceStub = {
        getCookiesAccepted: () => {
            return true;
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomePublicComponent,
                TestimonialComponent,
                CookiePolicyComponent,
                AuthorInfoComponent
            ],
            imports: [
                UserInterfaceModule,
                NgbModule.forRoot(),
                TopBannerModule
            ],
            providers: [
                { provide: I18nService, useValue: i18nServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: SessionService, useValue: sessionServiceStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePublicComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.all());
        htmlElement = debugElement.nativeElement;

        component.translationResolved = mockTranslationLabels;
        fixture.detectChanges();
    });

    it('should work', () => {
        expect(component instanceof HomePublicComponent).toBe(true, 'should create HomePublicComponent');
    });

    it('should have a "changeLocale()" method to change the current locale', async(() => {
        expect(typeof component.changeLocale).toBe('function');

        component.ngOnInit();
        expect(component.currentLocale).toEqual(mockLocale);

        component.changeLocale('IT');
        expect(component.currentLocale.code).toEqual('IT');
    }));
});
