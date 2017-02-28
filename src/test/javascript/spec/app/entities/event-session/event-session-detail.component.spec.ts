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
import { EventSessionDetailComponent } from '../../../../../../main/webapp/app/entities/event-session/event-session-detail.component';
import { EventSessionService } from '../../../../../../main/webapp/app/entities/event-session/event-session.service';
import { EventSession } from '../../../../../../main/webapp/app/entities/event-session/event-session.model';

describe('Component Tests', () => {

    describe('EventSession Management Detail Component', () => {
        let comp: EventSessionDetailComponent;
        let fixture: ComponentFixture<EventSessionDetailComponent>;
        let service: EventSessionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [EventSessionDetailComponent],
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
                    EventSessionService
                ]
            }).overrideComponent(EventSessionDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventSessionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventSessionService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EventSession(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.eventSession).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
