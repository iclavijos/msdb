jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventEntryService } from '../service/event-entry.service';
import { IEventEntry, EventEntry } from '../event-entry.model';
import { IDriver } from 'app/entities/driver/driver.model';
import { DriverService } from 'app/entities/driver/service/driver.service';

import { EventEntryUpdateComponent } from './event-entry-update.component';

describe('EventEntry Management Update Component', () => {
  let comp: EventEntryUpdateComponent;
  let fixture: ComponentFixture<EventEntryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventEntryService: EventEntryService;
  let driverService: DriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventEntryUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventEntryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventEntryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventEntryService = TestBed.inject(EventEntryService);
    driverService = TestBed.inject(DriverService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Driver query and add missing value', () => {
      const eventEntry: IEventEntry = { id: 456 };
      const driver: IDriver = { id: 59191 };
      eventEntry.driver = driver;

      const driverCollection: IDriver[] = [{ id: 80744 }];
      jest.spyOn(driverService, 'query').mockReturnValue(of(new HttpResponse({ body: driverCollection })));
      const additionalDrivers = [driver];
      const expectedCollection: IDriver[] = [...additionalDrivers, ...driverCollection];
      jest.spyOn(driverService, 'addDriverToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventEntry });
      comp.ngOnInit();

      expect(driverService.query).toHaveBeenCalled();
      expect(driverService.addDriverToCollectionIfMissing).toHaveBeenCalledWith(driverCollection, ...additionalDrivers);
      expect(comp.driversSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventEntry: IEventEntry = { id: 456 };
      const driver: IDriver = { id: 56775 };
      eventEntry.driver = driver;

      activatedRoute.data = of({ eventEntry });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventEntry));
      expect(comp.driversSharedCollection).toContain(driver);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEntry>>();
      const eventEntry = { id: 123 };
      jest.spyOn(eventEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventEntry }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventEntryService.update).toHaveBeenCalledWith(eventEntry);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEntry>>();
      const eventEntry = new EventEntry();
      jest.spyOn(eventEntryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventEntry }));
      saveSubject.complete();

      // THEN
      expect(eventEntryService.create).toHaveBeenCalledWith(eventEntry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventEntry>>();
      const eventEntry = { id: 123 };
      jest.spyOn(eventEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventEntryService.update).toHaveBeenCalledWith(eventEntry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDriverById', () => {
      it('Should return tracked Driver primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDriverById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
