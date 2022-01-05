jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TyreProviderService } from '../service/tyre-provider.service';
import { ITyreProvider, TyreProvider } from '../tyre-provider.model';

import { TyreProviderUpdateComponent } from './tyre-provider-update.component';

describe('TyreProvider Management Update Component', () => {
  let comp: TyreProviderUpdateComponent;
  let fixture: ComponentFixture<TyreProviderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tyreProviderService: TyreProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TyreProviderUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(TyreProviderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TyreProviderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tyreProviderService = TestBed.inject(TyreProviderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tyreProvider: ITyreProvider = { id: 456 };

      activatedRoute.data = of({ tyreProvider });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(tyreProvider));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TyreProvider>>();
      const tyreProvider = { id: 123 };
      jest.spyOn(tyreProviderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tyreProvider });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tyreProvider }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tyreProviderService.update).toHaveBeenCalledWith(tyreProvider);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TyreProvider>>();
      const tyreProvider = new TyreProvider();
      jest.spyOn(tyreProviderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tyreProvider });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tyreProvider }));
      saveSubject.complete();

      // THEN
      expect(tyreProviderService.create).toHaveBeenCalledWith(tyreProvider);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TyreProvider>>();
      const tyreProvider = { id: 123 };
      jest.spyOn(tyreProviderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tyreProvider });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tyreProviderService.update).toHaveBeenCalledWith(tyreProvider);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
