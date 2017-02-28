import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { EventEdition } from './event-edition.model';
import { EventEditionPopupService } from './event-edition-popup.service';
import { EventEditionService } from './event-edition.service';

@Component({
    selector: 'jhi-event-edition-delete-dialog',
    templateUrl: './event-edition-delete-dialog.component.html'
})
export class EventEditionDeleteDialogComponent {

    eventEdition: EventEdition;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEditionService: EventEditionService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['eventEdition']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.eventEditionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventEditionListModification',
                content: 'Deleted an eventEdition'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-edition-delete-popup',
    template: ''
})
export class EventEditionDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEditionPopupService: EventEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventEditionPopupService
                .open(EventEditionDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
