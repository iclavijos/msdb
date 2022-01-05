import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventEditionDetailComponent } from './event-edition-detail.component';

describe('EventEdition Management Detail Component', () => {
  let comp: EventEditionDetailComponent;
  let fixture: ComponentFixture<EventEditionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventEditionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventEdition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventEditionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventEditionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventEdition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventEdition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
