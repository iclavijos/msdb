import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';

import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutPopupService } from './racetrack-layout-popup.service';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Component({
    selector: 'jhi-racetrack-layout-delete-dialog',
    templateUrl: './racetrack-layout-delete-dialog.component.html'
})
export class RacetrackLayoutDeleteDialogComponent {

    racetrackLayout: RacetrackLayout;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private racetrackLayoutService: RacetrackLayoutService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.racetrackLayoutService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'racetrackLayoutsModification',
                content: 'Deleted an racetrackLayout'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-racetrack-layout-delete-popup',
    template: ''
})
export class RacetrackLayoutDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private racetrackLayoutPopupService: RacetrackLayoutPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.racetrackLayoutPopupService
                .open(RacetrackLayoutDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
