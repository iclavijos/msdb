jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FuelProviderService } from '../service/fuel-provider.service';
import { IFuelProvider, FuelProvider } from '../fuel-provider.model';

import { FuelProviderUpdateComponent } from './fuel-provider-update.component';

describe('FuelProvider Management Update Component', () => {
  let comp: FuelProviderUpdateComponent;
  let fixture: ComponentFixture<FuelProviderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fuelProviderService: FuelProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FuelProviderUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FuelProviderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FuelProviderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fuelProviderService = TestBed.inject(FuelProviderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const fuelProvider: IFuelProvider = { id: 456 };

      activatedRoute.data = of({ fuelProvider });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(fuelProvider));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FuelProvider>>();
      const fuelProvider = { id: 123 };
      jest.spyOn(fuelProviderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fuelProvider });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fuelProvider }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(fuelProviderService.update).toHaveBeenCalledWith(fuelProvider);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FuelProvider>>();
      const fuelProvider = new FuelProvider();
      jest.spyOn(fuelProviderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fuelProvider });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fuelProvider }));
      saveSubject.complete();

      // THEN
      expect(fuelProviderService.create).toHaveBeenCalledWith(fuelProvider);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FuelProvider>>();
      const fuelProvider = { id: 123 };
      jest.spyOn(fuelProviderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fuelProvider });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fuelProviderService.update).toHaveBeenCalledWith(fuelProvider);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
