jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EngineService } from '../service/engine.service';
import { IEngine, Engine } from '../engine.model';

import { EngineUpdateComponent } from './engine-update.component';

describe('Engine Management Update Component', () => {
  let comp: EngineUpdateComponent;
  let fixture: ComponentFixture<EngineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let engineService: EngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EngineUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EngineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EngineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    engineService = TestBed.inject(EngineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Engine query and add missing value', () => {
      const engine: IEngine = { id: 456 };
      const derivedFrom: IEngine = { id: 44668 };
      engine.derivedFrom = derivedFrom;

      const engineCollection: IEngine[] = [{ id: 8167 }];
      jest.spyOn(engineService, 'query').mockReturnValue(of(new HttpResponse({ body: engineCollection })));
      const additionalEngines = [derivedFrom];
      const expectedCollection: IEngine[] = [...additionalEngines, ...engineCollection];
      jest.spyOn(engineService, 'addEngineToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ engine });
      comp.ngOnInit();

      expect(engineService.query).toHaveBeenCalled();
      expect(engineService.addEngineToCollectionIfMissing).toHaveBeenCalledWith(engineCollection, ...additionalEngines);
      expect(comp.enginesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const engine: IEngine = { id: 456 };
      const derivedFrom: IEngine = { id: 18808 };
      engine.derivedFrom = derivedFrom;

      activatedRoute.data = of({ engine });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(engine));
      expect(comp.enginesSharedCollection).toContain(derivedFrom);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Engine>>();
      const engine = { id: 123 };
      jest.spyOn(engineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ engine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: engine }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(engineService.update).toHaveBeenCalledWith(engine);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Engine>>();
      const engine = new Engine();
      jest.spyOn(engineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ engine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: engine }));
      saveSubject.complete();

      // THEN
      expect(engineService.create).toHaveBeenCalledWith(engine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Engine>>();
      const engine = { id: 123 };
      jest.spyOn(engineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ engine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(engineService.update).toHaveBeenCalledWith(engine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEngineById', () => {
      it('Should return tracked Engine primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEngineById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
