import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEditionDetailComponent } from 'app/entities/event-edition/event-edition-detail.component';
import { EventEdition } from 'app/shared/model/event-edition.model';

describe('Component Tests', () => {
  describe('EventEdition Management Detail Component', () => {
    let comp: EventEditionDetailComponent;
    let fixture: ComponentFixture<EventEditionDetailComponent>;
    const route = ({ data: of({ eventEdition: new EventEdition(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventEditionDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EventEditionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EventEditionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.eventEdition).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
