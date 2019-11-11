import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISeries } from 'app/shared/model/series.model';
import { SeriesService } from './series.service';

@Component({
  selector: 'jhi-series-delete-dialog',
  templateUrl: './series-delete-dialog.component.html'
})
export class SeriesDeleteDialogComponent {
  series: ISeries;

  constructor(protected seriesService: SeriesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.seriesService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'seriesListModification',
        content: 'Deleted an series'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-series-delete-popup',
  template: ''
})
export class SeriesDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ series }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(SeriesDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.series = series;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/series', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/series', { outlets: { popup: null } }]);
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
