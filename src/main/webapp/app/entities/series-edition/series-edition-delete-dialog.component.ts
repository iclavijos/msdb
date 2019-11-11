import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISeriesEdition } from 'app/shared/model/series-edition.model';
import { SeriesEditionService } from './series-edition.service';

@Component({
  selector: 'jhi-series-edition-delete-dialog',
  templateUrl: './series-edition-delete-dialog.component.html'
})
export class SeriesEditionDeleteDialogComponent {
  seriesEdition: ISeriesEdition;

  constructor(
    protected seriesEditionService: SeriesEditionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.seriesEditionService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'seriesEditionListModification',
        content: 'Deleted an seriesEdition'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-series-edition-delete-popup',
  template: ''
})
export class SeriesEditionDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(SeriesEditionDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.seriesEdition = seriesEdition;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/series-edition', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/series-edition', { outlets: { popup: null } }]);
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
