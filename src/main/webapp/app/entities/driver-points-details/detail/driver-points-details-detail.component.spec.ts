import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DriverPointsDetailsDetailComponent } from './driver-points-details-detail.component';

describe('DriverPointsDetails Management Detail Component', () => {
  let comp: DriverPointsDetailsDetailComponent;
  let fixture: ComponentFixture<DriverPointsDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverPointsDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ driverPointsDetails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DriverPointsDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DriverPointsDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load driverPointsDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.driverPointsDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
