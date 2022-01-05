import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PointsSystemDetailComponent } from './points-system-detail.component';

describe('PointsSystem Management Detail Component', () => {
  let comp: PointsSystemDetailComponent;
  let fixture: ComponentFixture<PointsSystemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointsSystemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pointsSystem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PointsSystemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PointsSystemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pointsSystem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pointsSystem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
