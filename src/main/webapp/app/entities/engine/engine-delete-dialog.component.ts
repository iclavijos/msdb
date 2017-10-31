import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Engine } from './engine.model';
import { EnginePopupService } from './engine-popup.service';
import { EngineService } from './engine.service';

@Component({
    selector: 'jhi-engine-delete-dialog',
    templateUrl: './engine-delete-dialog.component.html'
})
export class EngineDeleteDialogComponent {

    engine: Engine;

    constructor(
        private engineService: EngineService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.engineService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'engineListModification',
                content: 'Deleted an engine'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('motorsportsDatabaseApp.engine.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-engine-delete-popup',
    template: ''
})
export class EngineDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private enginePopupService: EnginePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.enginePopupService
                .open(EngineDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
