import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventSessionDetailComponent } from 'app/entities/event-session/event-session-detail.component';
import { EventSession } from 'app/shared/model/event-session.model';

describe('Component Tests', () => {
  describe('EventSession Management Detail Component', () => {
    let comp: EventSessionDetailComponent;
    let fixture: ComponentFixture<EventSessionDetailComponent>;
    const route = ({ data: of({ eventSession: new EventSession(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventSessionDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EventSessionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EventSessionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.eventSession).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
