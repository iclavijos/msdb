import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { TyreProviderDeleteDialogComponent } from 'app/entities/tyre-provider/tyre-provider-delete-dialog.component';
import { TyreProviderService } from 'app/entities/tyre-provider/tyre-provider.service';

describe('Component Tests', () => {
  describe('TyreProvider Management Delete Component', () => {
    let comp: TyreProviderDeleteDialogComponent;
    let fixture: ComponentFixture<TyreProviderDeleteDialogComponent>;
    let service: TyreProviderService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [TyreProviderDeleteDialogComponent]
      })
        .overrideTemplate(TyreProviderDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TyreProviderDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TyreProviderService);
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
