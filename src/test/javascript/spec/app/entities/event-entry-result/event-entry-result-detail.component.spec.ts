import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEntryResultDetailComponent } from 'app/entities/event-entry-result/event-entry-result-detail.component';
import { EventEntryResult } from 'app/shared/model/event-entry-result.model';

describe('Component Tests', () => {
  describe('EventEntryResult Management Detail Component', () => {
    let comp: EventEntryResultDetailComponent;
    let fixture: ComponentFixture<EventEntryResultDetailComponent>;
    const route = ({ data: of({ eventEntryResult: new EventEntryResult(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventEntryResultDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EventEntryResultDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EventEntryResultDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.eventEntryResult).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
