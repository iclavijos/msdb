import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEntryComponent } from 'app/entities/event-entry/event-entry.component';
import { EventEntryService } from 'app/entities/event-entry/event-entry.service';
import { EventEntry } from 'app/shared/model/event-entry.model';

describe('Component Tests', () => {
  describe('EventEntry Management Component', () => {
    let comp: EventEntryComponent;
    let fixture: ComponentFixture<EventEntryComponent>;
    let service: EventEntryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventEntryComponent],
        providers: []
      })
        .overrideTemplate(EventEntryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EventEntryComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EventEntryService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EventEntry(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.eventEntries[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
