jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventSessionService } from '../service/event-session.service';
import { IEventSession, EventSession } from '../event-session.model';

import { EventSessionUpdateComponent } from './event-session-update.component';

describe('EventSession Management Update Component', () => {
  let comp: EventSessionUpdateComponent;
  let fixture: ComponentFixture<EventSessionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventSessionService: EventSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventSessionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventSessionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventSessionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventSessionService = TestBed.inject(EventSessionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const eventSession: IEventSession = { id: 456 };

      activatedRoute.data = of({ eventSession });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventSession));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventSession>>();
      const eventSession = { id: 123 };
      jest.spyOn(eventSessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventSession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventSession }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventSessionService.update).toHaveBeenCalledWith(eventSession);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventSession>>();
      const eventSession = new EventSession();
      jest.spyOn(eventSessionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventSession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventSession }));
      saveSubject.complete();

      // THEN
      expect(eventSessionService.create).toHaveBeenCalledWith(eventSession);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventSession>>();
      const eventSession = { id: 123 };
      jest.spyOn(eventSessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventSession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventSessionService.update).toHaveBeenCalledWith(eventSession);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
