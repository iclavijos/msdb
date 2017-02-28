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
import { SeriesDetailComponent } from '../../../../../../main/webapp/app/entities/series/series-detail.component';
import { SeriesService } from '../../../../../../main/webapp/app/entities/series/series.service';
import { Series } from '../../../../../../main/webapp/app/entities/series/series.model';

describe('Component Tests', () => {

    describe('Series Management Detail Component', () => {
        let comp: SeriesDetailComponent;
        let fixture: ComponentFixture<SeriesDetailComponent>;
        let service: SeriesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [SeriesDetailComponent],
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
                    SeriesService
                ]
            }).overrideComponent(SeriesDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SeriesDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SeriesService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Series(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.series).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
