import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { DriverPointsDetailsDetailComponent } from 'app/entities/driver-points-details/driver-points-details-detail.component';
import { DriverPointsDetails } from 'app/shared/model/driver-points-details.model';

describe('Component Tests', () => {
  describe('DriverPointsDetails Management Detail Component', () => {
    let comp: DriverPointsDetailsDetailComponent;
    let fixture: ComponentFixture<DriverPointsDetailsDetailComponent>;
    const route = ({ data: of({ driverPointsDetails: new DriverPointsDetails(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [DriverPointsDetailsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DriverPointsDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DriverPointsDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.driverPointsDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
