import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultPopupService } from './event-entry-result-popup.service';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
    selector: 'jhi-event-entry-result-delete-dialog',
    templateUrl: './event-entry-result-delete-dialog.component.html'
})
export class EventEntryResultDeleteDialogComponent {

    eventEntryResult: EventEntryResult;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEntryResultService: EventEntryResultService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['eventEntryResult']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.eventEntryResultService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventEntryResultListModification',
                content: 'Deleted an eventEntryResult'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-entry-result-delete-popup',
    template: ''
})
export class EventEntryResultDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEntryResultPopupService: EventEntryResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventEntryResultPopupService
                .open(EventEntryResultDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
