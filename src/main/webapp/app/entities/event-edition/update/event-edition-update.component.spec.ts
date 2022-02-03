jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventEditionService } from '../service/event-edition.service';
import { IEventEdition, EventEdition } from '../event-edition.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/service/racetrack-layout.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { EventEditionUpdateComponent } from './event-edition-update.component';

describe('EventEdition Management Update Component', () => {
  let comp: EventEditionUpdateComponent;
  let fixture: ComponentFixture<EventEditionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventEditionService: EventEditionService;
  let categoryService: CategoryService;
  let racetrackLayoutService: RacetrackLayoutService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventEditionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventEditionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventEditionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventEditionService = TestBed.inject(EventEditionService);
    categoryService = TestBed.inject(CategoryService);
    racetrackLayoutService = TestBed.inject(RacetrackLayoutService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const eventEdition: IEventEdition = { id: 456 };
      const allowedCategories: ICategory = { id: 56013 };
      eventEdition.allowedCategories = allowedCategories;

      const categoryCollection: ICategory[] = [{ id: 16104 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [allowedCategories];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventEdition });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, ...additionalCategories);
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call RacetrackLayout query and add missing value', () => {
      const eventEdition: IEventEdition = { id: 456 };
      const trackLayout: IRacetrackLayout = { id: 14119 };
      eventEdition.trackLayout = trackLayout;

      const racetrackLayoutCollection: IRacetrackLayout[] = [{ id: 53430 }];
      jest.spyOn(racetrackLayoutService, 'query').mockReturnValue(of(new HttpResponse({ body: racetrackLayoutCollection })));
      const additionalRacetrackLayouts = [trackLayout];
      const expectedCollection: IRacetrackLayout[] = [...additionalRacetrackLayouts, ...racetrackLayoutCollection];
      jest.spyOn(racetrackLayoutService, 'addRacetrackLayoutToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventEdition });
      comp.ngOnInit();

      expect(racetrackLayoutService.query).toHaveBeenCalled();
      expect(racetrackLayoutService.addRacetrackLayoutToCollectionIfMissing).toHaveBeenCalledWith(
        racetrackLayoutCollection,
        ...additionalRacetrackLayouts
      );
      expect(comp.racetrackLayoutsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const eventEdition: IEventEdition = { id: 456 };
      const event: IEvent = { id: 47249 };
      eventEdition.event = event;

      const eventCollection: IEvent[] = [{ id: 4116 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventEdition });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventEdition: IEventEdition = { id: 456 };
      const allowedCategories: ICategory = { id: 50661 };
      eventEdition.allowedCategories = allowedCategories;
      const trackLayout: IRacetrackLayout = { id: 95986 };
      eventEdition.trackLayout = trackLayout;
      const event: IEvent = { id: 8873 };
      eventEdition.event = event;

      activatedRoute.data = of({ eventEdition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventEdition));
      expect(comp.categoriesSharedCollection).toContain(allowedCategories);
      expect(comp.racetrackLayoutsSharedCollection).toContain(trackLayout);
      expect(comp.eventsSharedCollection).toContain(event);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEdition>>();
      const eventEdition = { id: 123 };
      jest.spyOn(eventEditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEdition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventEdition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventEditionService.update).toHaveBeenCalledWith(eventEdition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEdition>>();
      const eventEdition = new EventEdition();
      jest.spyOn(eventEditionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEdition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventEdition }));
      saveSubject.complete();

      // THEN
      expect(eventEditionService.create).toHaveBeenCalledWith(eventEdition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEdition>>();
      const eventEdition = { id: 123 };
      jest.spyOn(eventEditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEdition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventEditionService.update).toHaveBeenCalledWith(eventEdition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCategoryById', () => {
      it('Should return tracked Category primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCategoryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackRacetrackLayoutById', () => {
      it('Should return tracked RacetrackLayout primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRacetrackLayoutById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
