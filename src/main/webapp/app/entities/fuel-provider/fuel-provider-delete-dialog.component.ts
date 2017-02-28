import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

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
        private jhiLanguageService: JhiLanguageService,
        private fuelProviderService: FuelProviderService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['fuelProvider']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
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

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private fuelProviderPopupService: FuelProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.fuelProviderPopupService
                .open(FuelProviderDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
