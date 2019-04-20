/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEditionUpdateComponent } from 'app/entities/event-edition/event-edition-update.component';
import { EventEditionService } from 'app/entities/event-edition/event-edition.service';
import { EventEdition } from 'app/shared/model/event-edition.model';

describe('Component Tests', () => {
    describe('EventEdition Management Update Component', () => {
        let comp: EventEditionUpdateComponent;
        let fixture: ComponentFixture<EventEditionUpdateComponent>;
        let service: EventEditionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventEditionUpdateComponent]
            })
                .overrideTemplate(EventEditionUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EventEditionUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEditionService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new EventEdition(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.eventEdition = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new EventEdition();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.eventEdition = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
