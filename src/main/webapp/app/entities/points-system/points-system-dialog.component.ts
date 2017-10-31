import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private pointsSystemService: PointsSystemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.pointsSystem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.pointsSystemService.update(this.pointsSystem));
        } else {
            this.subscribeToSaveResponse(
                this.pointsSystemService.create(this.pointsSystem));
        }
    }

    private subscribeToSaveResponse(result: Observable<PointsSystem>) {
        result.subscribe((res: PointsSystem) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: PointsSystem) {
        this.eventManager.broadcast({ name: 'pointsSystemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-points-system-popup',
    template: ''
})
export class PointsSystemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pointsSystemPopupService: PointsSystemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.pointsSystemPopupService
                    .open(PointsSystemDialogComponent as Component, params['id']);
            } else {
                this.pointsSystemPopupService
                    .open(PointsSystemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
