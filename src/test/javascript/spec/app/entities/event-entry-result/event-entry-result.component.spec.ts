import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEntryResultComponent } from 'app/entities/event-entry-result/event-entry-result.component';
import { EventEntryResultService } from 'app/entities/event-entry-result/event-entry-result.service';
import { EventEntryResult } from 'app/shared/model/event-entry-result.model';

describe('Component Tests', () => {
  describe('EventEntryResult Management Component', () => {
    let comp: EventEntryResultComponent;
    let fixture: ComponentFixture<EventEntryResultComponent>;
    let service: EventEntryResultService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventEntryResultComponent],
        providers: []
      })
        .overrideTemplate(EventEntryResultComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EventEntryResultComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EventEntryResultService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EventEntryResult(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.eventEntryResults[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
