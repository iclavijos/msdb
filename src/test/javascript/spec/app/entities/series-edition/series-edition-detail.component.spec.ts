import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils } from 'ng-jhipster';
import { JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SeriesEditionDetailComponent } from '../../../../../../main/webapp/app/entities/series-edition/series-edition-detail.component';
import { SeriesEditionService } from '../../../../../../main/webapp/app/entities/series-edition/series-edition.service';
import { SeriesEdition } from '../../../../../../main/webapp/app/entities/series-edition/series-edition.model';

describe('Component Tests', () => {

    describe('SeriesEdition Management Detail Component', () => {
        let comp: SeriesEditionDetailComponent;
        let fixture: ComponentFixture<SeriesEditionDetailComponent>;
        let service: SeriesEditionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [SeriesEditionDetailComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    {
                        provide: JhiLanguageService,
                        useClass: MockLanguageService
                    },
                    SeriesEditionService
                ]
            }).overrideComponent(SeriesEditionDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SeriesEditionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SeriesEditionService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new SeriesEdition(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.seriesEdition).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
