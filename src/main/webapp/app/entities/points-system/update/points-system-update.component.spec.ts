jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PointsSystemService } from '../service/points-system.service';
import { IPointsSystem, PointsSystem } from '../points-system.model';

import { PointsSystemUpdateComponent } from './points-system-update.component';

describe('PointsSystem Management Update Component', () => {
  let comp: PointsSystemUpdateComponent;
  let fixture: ComponentFixture<PointsSystemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pointsSystemService: PointsSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PointsSystemUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(PointsSystemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PointsSystemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pointsSystemService = TestBed.inject(PointsSystemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pointsSystem: IPointsSystem = { id: 456 };

      activatedRoute.data = of({ pointsSystem });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pointsSystem));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PointsSystem>>();
      const pointsSystem = { id: 123 };
      jest.spyOn(pointsSystemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pointsSystem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pointsSystem }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pointsSystemService.update).toHaveBeenCalledWith(pointsSystem);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PointsSystem>>();
      const pointsSystem = new PointsSystem();
      jest.spyOn(pointsSystemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pointsSystem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pointsSystem }));
      saveSubject.complete();

      // THEN
      expect(pointsSystemService.create).toHaveBeenCalledWith(pointsSystem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PointsSystem>>();
      const pointsSystem = { id: 123 };
      jest.spyOn(pointsSystemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pointsSystem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pointsSystemService.update).toHaveBeenCalledWith(pointsSystem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
