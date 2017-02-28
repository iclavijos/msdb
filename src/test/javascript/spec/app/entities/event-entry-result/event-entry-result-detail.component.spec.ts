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
import { EventEntryResultDetailComponent } from '../../../../../../main/webapp/app/entities/event-entry-result/event-entry-result-detail.component';
import { EventEntryResultService } from '../../../../../../main/webapp/app/entities/event-entry-result/event-entry-result.service';
import { EventEntryResult } from '../../../../../../main/webapp/app/entities/event-entry-result/event-entry-result.model';

describe('Component Tests', () => {

    describe('EventEntryResult Management Detail Component', () => {
        let comp: EventEntryResultDetailComponent;
        let fixture: ComponentFixture<EventEntryResultDetailComponent>;
        let service: EventEntryResultService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [EventEntryResultDetailComponent],
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
                    EventEntryResultService
                ]
            }).overrideComponent(EventEntryResultDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEntryResultDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntryResultService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EventEntryResult(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.eventEntryResult).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
