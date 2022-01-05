import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventEntryResultDetailComponent } from './event-entry-result-detail.component';

describe('EventEntryResult Management Detail Component', () => {
  let comp: EventEntryResultDetailComponent;
  let fixture: ComponentFixture<EventEntryResultDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventEntryResultDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventEntryResult: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventEntryResultDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventEntryResultDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventEntryResult on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventEntryResult).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
