import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITyreProvider } from '../../shared/model/tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';

@Component({
  selector: 'jhi-tyre-provider-delete-dialog',
  templateUrl: './tyre-provider-delete-dialog.component.html'
})
export class TyreProviderDeleteDialogComponent {
  tyreProvider: ITyreProvider;

  constructor(
    protected tyreProviderService: TyreProviderService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.tyreProviderService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'tyreProviderListModification',
        content: 'Deleted an tyreProvider'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-tyre-provider-delete-popup',
  template: ''
})
export class TyreProviderDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ tyreProvider }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(TyreProviderDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.tyreProvider = tyreProvider;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/tyre-provider', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/tyre-provider', { outlets: { popup: null } }]);
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
