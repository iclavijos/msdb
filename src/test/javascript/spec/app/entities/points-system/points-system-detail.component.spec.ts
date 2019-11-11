import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { PointsSystemDetailComponent } from 'app/entities/points-system/points-system-detail.component';
import { PointsSystem } from 'app/shared/model/points-system.model';

describe('Component Tests', () => {
  describe('PointsSystem Management Detail Component', () => {
    let comp: PointsSystemDetailComponent;
    let fixture: ComponentFixture<PointsSystemDetailComponent>;
    const route = ({ data: of({ pointsSystem: new PointsSystem(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [PointsSystemDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PointsSystemDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PointsSystemDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pointsSystem).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
