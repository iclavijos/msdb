import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IChassis } from 'app/shared/model/chassis.model';
import { ChassisService } from './chassis.service';

@Component({
  selector: 'jhi-chassis-delete-dialog',
  templateUrl: './chassis-delete-dialog.component.html'
})
export class ChassisDeleteDialogComponent {
  chassis: IChassis;

  constructor(protected chassisService: ChassisService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.chassisService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'chassisListModification',
        content: 'Deleted an chassis'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-chassis-delete-popup',
  template: ''
})
export class ChassisDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ chassis }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ChassisDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.chassis = chassis;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/chassis', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/chassis', { outlets: { popup: null } }]);
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
