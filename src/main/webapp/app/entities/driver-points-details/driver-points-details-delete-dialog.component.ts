import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDriverPointsDetails } from 'app/shared/model/driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
  selector: 'jhi-driver-points-details-delete-dialog',
  templateUrl: './driver-points-details-delete-dialog.component.html'
})
export class DriverPointsDetailsDeleteDialogComponent {
  driverPointsDetails: IDriverPointsDetails;

  constructor(
    protected driverPointsDetailsService: DriverPointsDetailsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.driverPointsDetailsService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'driverPointsDetailsListModification',
        content: 'Deleted an driverPointsDetails'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-driver-points-details-delete-popup',
  template: ''
})
export class DriverPointsDetailsDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ driverPointsDetails }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DriverPointsDetailsDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.driverPointsDetails = driverPointsDetails;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/driver-points-details', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/driver-points-details', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
