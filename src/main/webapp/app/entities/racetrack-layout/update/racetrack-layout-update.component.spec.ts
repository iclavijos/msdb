jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RacetrackLayoutService } from '../service/racetrack-layout.service';
import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';
import { IRacetrack } from 'app/entities/racetrack/racetrack.model';
import { RacetrackService } from 'app/entities/racetrack/service/racetrack.service';

import { RacetrackLayoutUpdateComponent } from './racetrack-layout-update.component';

describe('RacetrackLayout Management Update Component', () => {
  let comp: RacetrackLayoutUpdateComponent;
  let fixture: ComponentFixture<RacetrackLayoutUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let racetrackLayoutService: RacetrackLayoutService;
  let racetrackService: RacetrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RacetrackLayoutUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(RacetrackLayoutUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RacetrackLayoutUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    racetrackLayoutService = TestBed.inject(RacetrackLayoutService);
    racetrackService = TestBed.inject(RacetrackService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Racetrack query and add missing value', () => {
      const racetrackLayout: IRacetrackLayout = { id: 456 };
      const racetrack: IRacetrack = { id: 31135 };
      racetrackLayout.racetrack = racetrack;

      const racetrackCollection: IRacetrack[] = [{ id: 83296 }];
      jest.spyOn(racetrackService, 'query').mockReturnValue(of(new HttpResponse({ body: racetrackCollection })));
      const additionalRacetracks = [racetrack];
      const expectedCollection: IRacetrack[] = [...additionalRacetracks, ...racetrackCollection];
      jest.spyOn(racetrackService, 'addRacetrackToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ racetrackLayout });
      comp.ngOnInit();

      expect(racetrackService.query).toHaveBeenCalled();
      expect(racetrackService.addRacetrackToCollectionIfMissing).toHaveBeenCalledWith(racetrackCollection, ...additionalRacetracks);
      expect(comp.racetracksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const racetrackLayout: IRacetrackLayout = { id: 456 };
      const racetrack: IRacetrack = { id: 99228 };
      racetrackLayout.racetrack = racetrack;

      activatedRoute.data = of({ racetrackLayout });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(racetrackLayout));
      expect(comp.racetracksSharedCollection).toContain(racetrack);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RacetrackLayout>>();
      const racetrackLayout = { id: 123 };
      jest.spyOn(racetrackLayoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ racetrackLayout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: racetrackLayout }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(racetrackLayoutService.update).toHaveBeenCalledWith(racetrackLayout);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RacetrackLayout>>();
      const racetrackLayout = new RacetrackLayout();
      jest.spyOn(racetrackLayoutService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ racetrackLayout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: racetrackLayout }));
      saveSubject.complete();

      // THEN
      expect(racetrackLayoutService.create).toHaveBeenCalledWith(racetrackLayout);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RacetrackLayout>>();
      const racetrackLayout = { id: 123 };
      jest.spyOn(racetrackLayoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ racetrackLayout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(racetrackLayoutService.update).toHaveBeenCalledWith(racetrackLayout);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRacetrackById', () => {
      it('Should return tracked Racetrack primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRacetrackById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
