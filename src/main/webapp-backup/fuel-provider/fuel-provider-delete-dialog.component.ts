import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFuelProvider } from 'app/shared/model/fuel-provider.model';
import { FuelProviderService } from './fuel-provider.service';

@Component({
  selector: 'jhi-fuel-provider-delete-dialog',
  templateUrl: './fuel-provider-delete-dialog.component.html'
})
export class FuelProviderDeleteDialogComponent {
  fuelProvider: IFuelProvider;

  constructor(
    protected fuelProviderService: FuelProviderService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.fuelProviderService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'fuelProviderListModification',
        content: 'Deleted an fuelProvider'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-fuel-provider-delete-popup',
  template: ''
})
export class FuelProviderDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ fuelProvider }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(FuelProviderDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.fuelProvider = fuelProvider;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/fuel-provider', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/fuel-provider', { outlets: { popup: null } }]);
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
