import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { RacetrackLayoutDetailComponent } from 'app/entities/racetrack-layout/racetrack-layout-detail.component';
import { RacetrackLayout } from 'app/shared/model/racetrack-layout.model';

describe('Component Tests', () => {
  describe('RacetrackLayout Management Detail Component', () => {
    let comp: RacetrackLayoutDetailComponent;
    let fixture: ComponentFixture<RacetrackLayoutDetailComponent>;
    const route = ({ data: of({ racetrackLayout: new RacetrackLayout(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [RacetrackLayoutDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(RacetrackLayoutDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RacetrackLayoutDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.racetrackLayout).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
