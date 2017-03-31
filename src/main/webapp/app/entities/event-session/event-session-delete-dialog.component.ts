import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { EventSession } from './event-session.model';
import { EventSessionPopupService } from './event-session-popup.service';
import { EventSessionService } from './event-session.service';

@Component({
    selector: 'jhi-event-session-delete-dialog',
    templateUrl: './event-session-delete-dialog.component.html'
})
export class EventSessionDeleteDialogComponent {

    eventSession: EventSession;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventSessionService: EventSessionService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        //this.jhiLanguageService.setLocations(['eventSession']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.eventSessionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventSessionListModification',
                content: 'Deleted an eventSession'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-session-delete-popup',
    template: ''
})
export class EventSessionDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventSessionPopupService: EventSessionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventSessionPopupService
                .open(EventSessionDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
