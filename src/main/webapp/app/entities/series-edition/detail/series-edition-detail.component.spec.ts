import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SeriesEditionDetailComponent } from './series-edition-detail.component';

describe('SeriesEdition Management Detail Component', () => {
  let comp: SeriesEditionDetailComponent;
  let fixture: ComponentFixture<SeriesEditionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesEditionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ seriesEdition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SeriesEditionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SeriesEditionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load seriesEdition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.seriesEdition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
