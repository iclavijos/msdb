jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SeriesEditionService } from '../service/series-edition.service';
import { ISeriesEdition, SeriesEdition } from '../series-edition.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { ISeries } from 'app/entities/series/series.model';
import { SeriesService } from 'app/entities/series/service/series.service';

import { SeriesEditionUpdateComponent } from './series-edition-update.component';

describe('SeriesEdition Management Update Component', () => {
  let comp: SeriesEditionUpdateComponent;
  let fixture: ComponentFixture<SeriesEditionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let seriesEditionService: SeriesEditionService;
  let categoryService: CategoryService;
  let seriesService: SeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SeriesEditionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SeriesEditionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SeriesEditionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    seriesEditionService = TestBed.inject(SeriesEditionService);
    categoryService = TestBed.inject(CategoryService);
    seriesService = TestBed.inject(SeriesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const seriesEdition: ISeriesEdition = { id: 456 };
      const allowedCategories: ICategory = { id: 36218 };
      seriesEdition.allowedCategories = allowedCategories;

      const categoryCollection: ICategory[] = [{ id: 59918 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [allowedCategories];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ seriesEdition });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, ...additionalCategories);
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Series query and add missing value', () => {
      const seriesEdition: ISeriesEdition = { id: 456 };
      const series: ISeries = { id: 47393 };
      seriesEdition.series = series;

      const seriesCollection: ISeries[] = [{ id: 56144 }];
      jest.spyOn(seriesService, 'query').mockReturnValue(of(new HttpResponse({ body: seriesCollection })));
      const additionalSeries = [series];
      const expectedCollection: ISeries[] = [...additionalSeries, ...seriesCollection];
      jest.spyOn(seriesService, 'addSeriesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ seriesEdition });
      comp.ngOnInit();

      expect(seriesService.query).toHaveBeenCalled();
      expect(seriesService.addSeriesToCollectionIfMissing).toHaveBeenCalledWith(seriesCollection, ...additionalSeries);
      expect(comp.seriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const seriesEdition: ISeriesEdition = { id: 456 };
      const allowedCategories: ICategory = { id: 55961 };
      seriesEdition.allowedCategories = allowedCategories;
      const series: ISeries = { id: 77110 };
      seriesEdition.series = series;

      activatedRoute.data = of({ seriesEdition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(seriesEdition));
      expect(comp.categoriesSharedCollection).toContain(allowedCategories);
      expect(comp.seriesSharedCollection).toContain(series);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SeriesEdition>>();
      const seriesEdition = { id: 123 };
      jest.spyOn(seriesEditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seriesEdition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seriesEdition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(seriesEditionService.update).toHaveBeenCalledWith(seriesEdition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SeriesEdition>>();
      const seriesEdition = new SeriesEdition();
      jest.spyOn(seriesEditionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seriesEdition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seriesEdition }));
      saveSubject.complete();

      // THEN
      expect(seriesEditionService.create).toHaveBeenCalledWith(seriesEdition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SeriesEdition>>();
      const seriesEdition = { id: 123 };
      jest.spyOn(seriesEditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seriesEdition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(seriesEditionService.update).toHaveBeenCalledWith(seriesEdition);
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

    describe('trackSeriesById', () => {
      it('Should return tracked Series primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSeriesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
