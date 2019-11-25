import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEntryUpdateComponent } from 'app/entities/event-entry/event-entry-update.component';
import { EventEntryService } from 'app/entities/event-entry/event-entry.service';
import { EventEntry } from 'app/shared/model/event-entry.model';

describe('Component Tests', () => {
  describe('EventEntry Management Update Component', () => {
    let comp: EventEntryUpdateComponent;
    let fixture: ComponentFixture<EventEntryUpdateComponent>;
    let service: EventEntryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventEntryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(EventEntryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EventEntryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EventEntryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new EventEntry(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new EventEntry();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
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
