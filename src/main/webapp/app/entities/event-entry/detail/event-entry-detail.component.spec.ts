import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventEntryDetailComponent } from './event-entry-detail.component';

describe('EventEntry Management Detail Component', () => {
  let comp: EventEntryDetailComponent;
  let fixture: ComponentFixture<EventEntryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventEntryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventEntry: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventEntryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventEntryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventEntry on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventEntry).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
