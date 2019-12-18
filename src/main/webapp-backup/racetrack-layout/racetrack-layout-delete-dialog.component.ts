import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Component({
  selector: 'jhi-racetrack-layout-delete-dialog',
  templateUrl: './racetrack-layout-delete-dialog.component.html'
})
export class RacetrackLayoutDeleteDialogComponent {
  racetrackLayout: IRacetrackLayout;

  constructor(
    protected racetrackLayoutService: RacetrackLayoutService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.racetrackLayoutService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'racetrackLayoutListModification',
        content: 'Deleted an racetrackLayout'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-racetrack-layout-delete-popup',
  template: ''
})
export class RacetrackLayoutDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ racetrackLayout }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(RacetrackLayoutDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.racetrackLayout = racetrackLayout;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/racetrack-layout', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/racetrack-layout', { outlets: { popup: null } }]);
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
