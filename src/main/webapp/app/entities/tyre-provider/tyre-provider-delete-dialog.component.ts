import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';

import { TyreProvider } from './tyre-provider.model';
import { TyreProviderPopupService } from './tyre-provider-popup.service';
import { TyreProviderService } from './tyre-provider.service';

@Component({
    selector: 'jhi-tyre-provider-delete-dialog',
    templateUrl: './tyre-provider-delete-dialog.component.html'
})
export class TyreProviderDeleteDialogComponent {

    tyreProvider: TyreProvider;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private tyreProviderService: TyreProviderService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.tyreProviderService.delete(id).subscribe(response => {
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

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private tyreProviderPopupService: TyreProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.tyreProviderPopupService
                .open(TyreProviderDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
