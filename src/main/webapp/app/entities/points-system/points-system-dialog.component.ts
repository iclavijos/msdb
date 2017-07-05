import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PointsSystem } from './points-system.model';
import { PointsSystemPopupService } from './points-system-popup.service';
import { PointsSystemService } from './points-system.service';

@Component({
    selector: 'jhi-points-system-dialog',
    templateUrl: './points-system-dialog.component.html'
})
export class PointsSystemDialogComponent implements OnInit {

    pointsSystem: PointsSystem;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private pointsSystemService: PointsSystemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.pointsSystem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.pointsSystemService.update(this.pointsSystem), false);
        } else {
            this.subscribeToSaveResponse(
                this.pointsSystemService.create(this.pointsSystem), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<PointsSystem>, isCreated: boolean) {
        result.subscribe((res: PointsSystem) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: PointsSystem, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.pointsSystem.created'
            : 'motorsportsDatabaseApp.pointsSystem.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'pointsSystemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-points-system-popup',
    template: ''
})
export class PointsSystemPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pointsSystemPopupService: PointsSystemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.pointsSystemPopupService
                    .open(PointsSystemDialogComponent, params['id']);
            } else {
                this.modalRef = this.pointsSystemPopupService
                    .open(PointsSystemDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
