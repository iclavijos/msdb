import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChassisDetailComponent } from './chassis-detail.component';

describe('Chassis Management Detail Component', () => {
  let comp: ChassisDetailComponent;
  let fixture: ComponentFixture<ChassisDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChassisDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chassis: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChassisDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChassisDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chassis on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chassis).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
