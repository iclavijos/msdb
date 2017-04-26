import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

import { EventEdition } from './event-edition.model';
import { EventEditionPopupService } from './event-edition-popup.service';
import { EventEditionService } from './event-edition.service';

@Component({
    selector: 'jhi-event-edition-copy-entries-dialog',
    templateUrl: './event-edition-copy-entries-dialog.component.html'
})
export class EventEditionCopyEntriesDialogComponent {

    eventEdition: EventEdition;
    selectedEventEdition: EventEdition;
    protected dataServiceEventEdition: CompleterData;
    private eventEditionSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEditionService: EventEditionService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager,
        private completerService: CompleterService
    ) {
        this.dataServiceEventEdition = completerService.remote('api/_search/event-editions?query=', null, 'longEventName');
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmCopy () {
        this.eventEditionService.copyEntries(this.selectedEventEdition.id, this.eventEdition.id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventEntryListModification'
            });
            this.activeModal.dismiss(true);
        });
    }
    
    public onEventEditionSelected(selected: CompleterItem) {
        if (!selected.originalObject) return;
        let eventEd = selected.originalObject;
        if (selected) {
            this.selectedEventEdition= eventEd;
            this.eventEditionSearch = eventEd.longEventName;
        } else {
            this.selectedEventEdition = null;
            this.eventEditionSearch = null;
        }
    }
}

@Component({
    selector: 'jhi-event-edition-copy-entries-popup',
    template: ''
})
export class EventEditionCopyEntriesPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEditionPopupService: EventEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventEditionPopupService
                .open(EventEditionCopyEntriesDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
