jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SeriesService } from '../service/series.service';
import { ISeries, Series } from '../series.model';

import { SeriesUpdateComponent } from './series-update.component';

describe('Series Management Update Component', () => {
  let comp: SeriesUpdateComponent;
  let fixture: ComponentFixture<SeriesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let seriesService: SeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SeriesUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SeriesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SeriesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    seriesService = TestBed.inject(SeriesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const series: ISeries = { id: 456 };

      activatedRoute.data = of({ series });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(series));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Series>>();
      const series = { id: 123 };
      jest.spyOn(seriesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ series });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: series }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(seriesService.update).toHaveBeenCalledWith(series);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Series>>();
      const series = new Series();
      jest.spyOn(seriesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ series });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: series }));
      saveSubject.complete();

      // THEN
      expect(seriesService.create).toHaveBeenCalledWith(series);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Series>>();
      const series = { id: 123 };
      jest.spyOn(seriesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ series });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(seriesService.update).toHaveBeenCalledWith(series);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
