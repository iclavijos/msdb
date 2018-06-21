import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

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
    }
}

@Component({
    selector: 'jhi-engine-delete-popup',
    template: ''
})
export class EngineDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private enginePopupService: EnginePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.enginePopupService
                .open(EngineDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
