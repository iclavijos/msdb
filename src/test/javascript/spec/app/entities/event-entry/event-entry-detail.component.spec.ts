import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEntryDetailComponent } from 'app/entities/event-entry/event-entry-detail.component';
import { EventEntry } from 'app/shared/model/event-entry.model';

describe('Component Tests', () => {
  describe('EventEntry Management Detail Component', () => {
    let comp: EventEntryDetailComponent;
    let fixture: ComponentFixture<EventEntryDetailComponent>;
    const route = ({ data: of({ eventEntry: new EventEntry(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventEntryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EventEntryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EventEntryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.eventEntry).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
