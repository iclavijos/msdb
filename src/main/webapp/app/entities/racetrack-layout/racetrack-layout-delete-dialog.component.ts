import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

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
        private racetrackLayoutService: RacetrackLayoutService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.racetrackLayoutService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'racetrackLayoutListModification',
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racetrackLayoutPopupService: RacetrackLayoutPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.racetrackLayoutPopupService
                .open(RacetrackLayoutDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
