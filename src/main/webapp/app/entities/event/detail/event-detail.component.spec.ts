import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventDetailComponent } from './event-detail.component';

describe('Event Management Detail Component', () => {
  let comp: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ event: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load event on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.event).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
