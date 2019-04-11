/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEntryResultUpdateComponent } from 'app/entities/event-entry-result/event-entry-result-update.component';
import { EventEntryResultService } from 'app/entities/event-entry-result/event-entry-result.service';
import { EventEntryResult } from 'app/shared/model/event-entry-result.model';

describe('Component Tests', () => {
    describe('EventEntryResult Management Update Component', () => {
        let comp: EventEntryResultUpdateComponent;
        let fixture: ComponentFixture<EventEntryResultUpdateComponent>;
        let service: EventEntryResultService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [EventEntryResultUpdateComponent]
            })
                .overrideTemplate(EventEntryResultUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EventEntryResultUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntryResultService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new EventEntryResult(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.eventEntryResult = entity;
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
                    const entity = new EventEntryResult();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.eventEntryResult = entity;
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
