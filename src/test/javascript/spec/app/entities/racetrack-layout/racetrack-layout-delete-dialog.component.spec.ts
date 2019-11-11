import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { RacetrackLayoutDeleteDialogComponent } from 'app/entities/racetrack-layout/racetrack-layout-delete-dialog.component';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/racetrack-layout.service';

describe('Component Tests', () => {
  describe('RacetrackLayout Management Delete Component', () => {
    let comp: RacetrackLayoutDeleteDialogComponent;
    let fixture: ComponentFixture<RacetrackLayoutDeleteDialogComponent>;
    let service: RacetrackLayoutService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [RacetrackLayoutDeleteDialogComponent]
      })
        .overrideTemplate(RacetrackLayoutDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RacetrackLayoutDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RacetrackLayoutService);
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
