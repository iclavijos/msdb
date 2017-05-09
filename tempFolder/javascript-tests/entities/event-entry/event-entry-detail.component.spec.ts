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
import { EventEntryDetailComponent } from '../../../../../../main/webapp/app/entities/event-entry/event-entry-detail.component';
import { EventEntryService } from '../../../../../../main/webapp/app/entities/event-entry/event-entry.service';
import { EventEntry } from '../../../../../../main/webapp/app/entities/event-entry/event-entry.model';

describe('Component Tests', () => {

    describe('EventEntry Management Detail Component', () => {
        let comp: EventEntryDetailComponent;
        let fixture: ComponentFixture<EventEntryDetailComponent>;
        let service: EventEntryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [EventEntryDetailComponent],
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
                    EventEntryService
                ]
            }).overrideComponent(EventEntryDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEntryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntryService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EventEntry(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.eventEntry).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
