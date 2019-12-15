import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDriver } from 'app/shared/model/driver.model';
import { DriverService } from './driver.service';

@Component({
  selector: 'jhi-driver-delete-dialog',
  templateUrl: './driver-delete-dialog.component.html'
})
export class DriverDeleteDialogComponent {
  driver: IDriver;

  constructor(protected driverService: DriverService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.driverService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'driverListModification',
        content: 'Deleted an driver'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-driver-delete-popup',
  template: ''
})
export class DriverDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ driver }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DriverDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.driver = driver;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/driver', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/driver', { outlets: { popup: null } }]);
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
