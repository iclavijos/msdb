import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEngine } from 'app/shared/model/engine.model';
import { EngineService } from './engine.service';

@Component({
    selector: 'jhi-engine-delete-dialog',
    templateUrl: './engine-delete-dialog.component.html'
})
export class EngineDeleteDialogComponent {
    engine: IEngine;

    constructor(protected engineService: EngineService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.engineService.delete(id).subscribe(response => {
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
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ engine }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EngineDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.engine = engine;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/engine', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/engine', { outlets: { popup: null } }]);
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
