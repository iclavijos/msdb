import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { DriverPointsDetailsDeleteDialogComponent } from 'app/entities/driver-points-details/driver-points-details-delete-dialog.component';
import { DriverPointsDetailsService } from 'app/entities/driver-points-details/driver-points-details.service';

describe('Component Tests', () => {
  describe('DriverPointsDetails Management Delete Component', () => {
    let comp: DriverPointsDetailsDeleteDialogComponent;
    let fixture: ComponentFixture<DriverPointsDetailsDeleteDialogComponent>;
    let service: DriverPointsDetailsService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [DriverPointsDetailsDeleteDialogComponent]
      })
        .overrideTemplate(DriverPointsDetailsDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DriverPointsDetailsDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DriverPointsDetailsService);
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
