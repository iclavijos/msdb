import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventSessionDetailComponent } from './event-session-detail.component';

describe('EventSession Management Detail Component', () => {
  let comp: EventSessionDetailComponent;
  let fixture: ComponentFixture<EventSessionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventSessionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventSession: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventSessionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventSessionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventSession on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventSession).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
