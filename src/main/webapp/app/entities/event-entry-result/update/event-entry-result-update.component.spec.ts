jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventEntryResultService } from '../service/event-entry-result.service';
import { IEventEntryResult, EventEntryResult } from '../event-entry-result.model';

import { EventEntryResultUpdateComponent } from './event-entry-result-update.component';

describe('EventEntryResult Management Update Component', () => {
  let comp: EventEntryResultUpdateComponent;
  let fixture: ComponentFixture<EventEntryResultUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventEntryResultService: EventEntryResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventEntryResultUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventEntryResultUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventEntryResultUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventEntryResultService = TestBed.inject(EventEntryResultService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const eventEntryResult: IEventEntryResult = { id: 456 };

      activatedRoute.data = of({ eventEntryResult });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventEntryResult));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEntryResult>>();
      const eventEntryResult = { id: 123 };
      jest.spyOn(eventEntryResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEntryResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventEntryResult }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventEntryResultService.update).toHaveBeenCalledWith(eventEntryResult);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEntryResult>>();
      const eventEntryResult = new EventEntryResult();
      jest.spyOn(eventEntryResultService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEntryResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventEntryResult }));
      saveSubject.complete();

      // THEN
      expect(eventEntryResultService.create).toHaveBeenCalledWith(eventEntryResult);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEntryResult>>();
      const eventEntryResult = { id: 123 };
      jest.spyOn(eventEntryResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEntryResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventEntryResultService.update).toHaveBeenCalledWith(eventEntryResult);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
