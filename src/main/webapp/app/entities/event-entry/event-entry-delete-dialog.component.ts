import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { EventEntry } from './event-entry.model';
import { EventEntryPopupService } from './event-entry-popup.service';
import { EventEntryService } from './event-entry.service';

@Component({
    selector: 'jhi-event-entry-delete-dialog',
    templateUrl: './event-entry-delete-dialog.component.html'
})
export class EventEntryDeleteDialogComponent {

    eventEntry: EventEntry;

    constructor(
        private eventEntryService: EventEntryService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.eventEntryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'eventEntryListModification',
                content: 'Deleted an eventEntry'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('motorsportsDatabaseApp.eventEntry.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-event-entry-delete-popup',
    template: ''
})
export class EventEntryDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventEntryPopupService: EventEntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.eventEntryPopupService
                .open(EventEntryDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
