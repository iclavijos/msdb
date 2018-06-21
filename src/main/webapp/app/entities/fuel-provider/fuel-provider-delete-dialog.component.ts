import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { FuelProvider } from './fuel-provider.model';
import { FuelProviderPopupService } from './fuel-provider-popup.service';
import { FuelProviderService } from './fuel-provider.service';

@Component({
    selector: 'jhi-fuel-provider-delete-dialog',
    templateUrl: './fuel-provider-delete-dialog.component.html'
})
export class FuelProviderDeleteDialogComponent {

    fuelProvider: FuelProvider;

    constructor(
        private fuelProviderService: FuelProviderService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.fuelProviderService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private fuelProviderPopupService: FuelProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.fuelProviderPopupService
                .open(FuelProviderDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
