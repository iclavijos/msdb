jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RacetrackService } from '../service/racetrack.service';
import { IRacetrack, Racetrack } from '../racetrack.model';

import { RacetrackUpdateComponent } from './racetrack-update.component';

describe('Racetrack Management Update Component', () => {
  let comp: RacetrackUpdateComponent;
  let fixture: ComponentFixture<RacetrackUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let racetrackService: RacetrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RacetrackUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(RacetrackUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RacetrackUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    racetrackService = TestBed.inject(RacetrackService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const racetrack: IRacetrack = { id: 456 };

      activatedRoute.data = of({ racetrack });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(racetrack));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Racetrack>>();
      const racetrack = { id: 123 };
      jest.spyOn(racetrackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ racetrack });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: racetrack }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(racetrackService.update).toHaveBeenCalledWith(racetrack);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Racetrack>>();
      const racetrack = new Racetrack();
      jest.spyOn(racetrackService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ racetrack });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: racetrack }));
      saveSubject.complete();

      // THEN
      expect(racetrackService.create).toHaveBeenCalledWith(racetrack);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Racetrack>>();
      const racetrack = { id: 123 };
      jest.spyOn(racetrackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ racetrack });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(racetrackService.update).toHaveBeenCalledWith(racetrack);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
