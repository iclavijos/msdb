import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Racetrack } from './racetrack.model';
import { RacetrackPopupService } from './racetrack-popup.service';
import { RacetrackService } from './racetrack.service';

@Component({
    selector: 'jhi-racetrack-delete-dialog',
    templateUrl: './racetrack-delete-dialog.component.html'
})
export class RacetrackDeleteDialogComponent {

    racetrack: Racetrack;

    constructor(
        private racetrackService: RacetrackService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.racetrackService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'racetrackListModification',
                content: 'Deleted an racetrack'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('motorsportsDatabaseApp.racetrack.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-racetrack-delete-popup',
    template: ''
})
export class RacetrackDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racetrackPopupService: RacetrackPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.racetrackPopupService
                .open(RacetrackDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
