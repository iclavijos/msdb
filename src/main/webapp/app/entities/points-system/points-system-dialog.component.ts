import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';

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
        private jhiLanguageService: JhiLanguageService,
        private alertService: JhiAlertService,
        private pointsSystemService: PointsSystemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.pointsSystem.id !== undefined) {
            this.pointsSystemService.update(this.pointsSystem)
                .subscribe((res: PointsSystem) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.pointsSystemService.create(this.pointsSystem)
                .subscribe((res: PointsSystem) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: PointsSystem) {
        this.eventManager.broadcast({ name: 'pointsSystemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
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

    constructor (
        private route: ActivatedRoute,
        private pointsSystemPopupService: PointsSystemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
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
