jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DriverPointsDetailsService } from '../service/driver-points-details.service';
import { IDriverPointsDetails, DriverPointsDetails } from '../driver-points-details.model';

import { DriverPointsDetailsUpdateComponent } from './driver-points-details-update.component';

describe('DriverPointsDetails Management Update Component', () => {
  let comp: DriverPointsDetailsUpdateComponent;
  let fixture: ComponentFixture<DriverPointsDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let driverPointsDetailsService: DriverPointsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DriverPointsDetailsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(DriverPointsDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DriverPointsDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    driverPointsDetailsService = TestBed.inject(DriverPointsDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const driverPointsDetails: IDriverPointsDetails = { id: 456 };

      activatedRoute.data = of({ driverPointsDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(driverPointsDetails));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DriverPointsDetails>>();
      const driverPointsDetails = { id: 123 };
      jest.spyOn(driverPointsDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ driverPointsDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: driverPointsDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(driverPointsDetailsService.update).toHaveBeenCalledWith(driverPointsDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DriverPointsDetails>>();
      const driverPointsDetails = new DriverPointsDetails();
      jest.spyOn(driverPointsDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ driverPointsDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: driverPointsDetails }));
      saveSubject.complete();

      // THEN
      expect(driverPointsDetailsService.create).toHaveBeenCalledWith(driverPointsDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DriverPointsDetails>>();
      const driverPointsDetails = { id: 123 };
      jest.spyOn(driverPointsDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ driverPointsDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(driverPointsDetailsService.update).toHaveBeenCalledWith(driverPointsDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
