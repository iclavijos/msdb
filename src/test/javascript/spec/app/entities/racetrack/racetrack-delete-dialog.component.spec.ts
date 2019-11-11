import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { RacetrackDeleteDialogComponent } from 'app/entities/racetrack/racetrack-delete-dialog.component';
import { RacetrackService } from 'app/entities/racetrack/racetrack.service';

describe('Component Tests', () => {
  describe('Racetrack Management Delete Component', () => {
    let comp: RacetrackDeleteDialogComponent;
    let fixture: ComponentFixture<RacetrackDeleteDialogComponent>;
    let service: RacetrackService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [RacetrackDeleteDialogComponent]
      })
        .overrideTemplate(RacetrackDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RacetrackDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RacetrackService);
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
