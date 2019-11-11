import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { EventEditionDeleteDialogComponent } from 'app/entities/event-edition/event-edition-delete-dialog.component';
import { EventEditionService } from 'app/entities/event-edition/event-edition.service';

describe('Component Tests', () => {
  describe('EventEdition Management Delete Component', () => {
    let comp: EventEditionDeleteDialogComponent;
    let fixture: ComponentFixture<EventEditionDeleteDialogComponent>;
    let service: EventEditionService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [EventEditionDeleteDialogComponent]
      })
        .overrideTemplate(EventEditionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EventEditionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EventEditionService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
