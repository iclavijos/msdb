import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { PointsSystem } from './points-system.model';
import { PointsSystemPopupService } from './points-system-popup.service';
import { PointsSystemService } from './points-system.service';

@Component({
    selector: 'jhi-points-system-delete-dialog',
    templateUrl: './points-system-delete-dialog.component.html'
})
export class PointsSystemDeleteDialogComponent {

    pointsSystem: PointsSystem;

    constructor(
        private pointsSystemService: PointsSystemService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pointsSystemService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'pointsSystemListModification',
                content: 'Deleted an pointsSystem'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('motorsportsDatabaseApp.pointsSystem.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-points-system-delete-popup',
    template: ''
})
export class PointsSystemDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pointsSystemPopupService: PointsSystemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.pointsSystemPopupService
                .open(PointsSystemDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
