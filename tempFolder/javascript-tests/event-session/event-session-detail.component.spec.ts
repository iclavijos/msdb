import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
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
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventSessionDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    EventSessionService,
                    JhiEventManager
                ]
            }).overrideTemplate(EventSessionDetailComponent, '')
            .compileComponents();
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
