jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChassisService } from '../service/chassis.service';
import { IChassis, Chassis } from '../chassis.model';

import { ChassisUpdateComponent } from './chassis-update.component';

describe('Chassis Management Update Component', () => {
  let comp: ChassisUpdateComponent;
  let fixture: ComponentFixture<ChassisUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chassisService: ChassisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChassisUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ChassisUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChassisUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chassisService = TestBed.inject(ChassisService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Chassis query and add missing value', () => {
      const chassis: IChassis = { id: 456 };
      const derivedFrom: IChassis = { id: 51837 };
      chassis.derivedFrom = derivedFrom;

      const chassisCollection: IChassis[] = [{ id: 78828 }];
      jest.spyOn(chassisService, 'query').mockReturnValue(of(new HttpResponse({ body: chassisCollection })));
      const additionalChassis = [derivedFrom];
      const expectedCollection: IChassis[] = [...additionalChassis, ...chassisCollection];
      jest.spyOn(chassisService, 'addChassisToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chassis });
      comp.ngOnInit();

      expect(chassisService.query).toHaveBeenCalled();
      expect(chassisService.addChassisToCollectionIfMissing).toHaveBeenCalledWith(chassisCollection, ...additionalChassis);
      expect(comp.chassisSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chassis: IChassis = { id: 456 };
      const derivedFrom: IChassis = { id: 60621 };
      chassis.derivedFrom = derivedFrom;

      activatedRoute.data = of({ chassis });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chassis));
      expect(comp.chassisSharedCollection).toContain(derivedFrom);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chassis>>();
      const chassis = { id: 123 };
      jest.spyOn(chassisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chassis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chassis }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chassisService.update).toHaveBeenCalledWith(chassis);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chassis>>();
      const chassis = new Chassis();
      jest.spyOn(chassisService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chassis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chassis }));
      saveSubject.complete();

      // THEN
      expect(chassisService.create).toHaveBeenCalledWith(chassis);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chassis>>();
      const chassis = { id: 123 };
      jest.spyOn(chassisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chassis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chassisService.update).toHaveBeenCalledWith(chassis);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackChassisById', () => {
      it('Should return tracked Chassis primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChassisById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
