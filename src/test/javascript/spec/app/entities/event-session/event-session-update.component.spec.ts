/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventSessionUpdateComponent } from 'app/entities/event-session/event-session-update.component';
import { EventSessionService } from 'app/entities/event-session/event-session.service';
import { EventSession } from 'app/shared/model/event-session.model';

describe('Component Tests', () => {
    describe('EventSession Management Update Component', () => {
        let comp: EventSessionUpdateComponent;
        let fixture: ComponentFixture<EventSessionUpdateComponent>;
        let service: EventSessionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventSessionUpdateComponent]
            })
                .overrideTemplate(EventSessionUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EventSessionUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventSessionService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new EventSession(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.eventSession = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new EventSession();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.eventSession = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
