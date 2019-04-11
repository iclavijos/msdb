/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventSessionComponent } from 'app/entities/event-session/event-session.component';
import { EventSessionService } from 'app/entities/event-session/event-session.service';
import { EventSession } from 'app/shared/model/event-session.model';

describe('Component Tests', () => {
    describe('EventSession Management Component', () => {
        let comp: EventSessionComponent;
        let fixture: ComponentFixture<EventSessionComponent>;
        let service: EventSessionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventSessionComponent],
                providers: []
            })
                .overrideTemplate(EventSessionComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EventSessionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventSessionService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new EventSession(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.eventSessions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
