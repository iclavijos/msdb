import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPointsSystem } from '../../shared/model/points-system.model';
import { PointsSystemService } from './points-system.service';

@Component({
  selector: 'jhi-points-system-delete-dialog',
  templateUrl: './points-system-delete-dialog.component.html'
})
export class PointsSystemDeleteDialogComponent {
  pointsSystem: IPointsSystem;

  constructor(
    protected pointsSystemService: PointsSystemService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.pointsSystemService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'pointsSystemListModification',
        content: 'Deleted an pointsSystem'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-points-system-delete-popup',
  template: ''
})
export class PointsSystemDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ pointsSystem }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PointsSystemDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.pointsSystem = pointsSystem;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/points-system', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/points-system', { outlets: { popup: null } }]);
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
