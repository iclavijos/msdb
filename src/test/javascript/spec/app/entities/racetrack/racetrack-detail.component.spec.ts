import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { RacetrackDetailComponent } from 'app/entities/racetrack/racetrack-detail.component';
import { Racetrack } from 'app/shared/model/racetrack.model';

describe('Component Tests', () => {
  describe('Racetrack Management Detail Component', () => {
    let comp: RacetrackDetailComponent;
    let fixture: ComponentFixture<RacetrackDetailComponent>;
    const route = ({ data: of({ racetrack: new Racetrack(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [RacetrackDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(RacetrackDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RacetrackDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.racetrack).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
