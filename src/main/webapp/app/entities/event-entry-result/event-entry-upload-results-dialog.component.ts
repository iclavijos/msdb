import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Response } from '@angular/http';
import { EventManager, JhiLanguageService, AlertService, DataUtils } from 'ng-jhipster';

import { EventSession } from '../event-session';
import { EventEntryResultPopupService } from '.';

import { Imports, ImportsService } from '../../imports';

@Component({
    selector: 'jhi-event-entry-upload-results-dialog',
    templateUrl: './event-entry-upload-results-dialog.component.html'
})
export class EventEntryUploadResultsDialogComponent {
    imports: Imports;
    eventSession: EventSession;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private dataUtils: DataUtils,
        private importsService: ImportsService,
        private eventManager: EventManager
    ) {
        this.imports = new Imports();
        this.imports.importType = 'SESSION_RESULTS';
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }
    
    setFileData($event) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];

            this.dataUtils.toBase64($file, (base64Data) => {
                this.imports.csvContents = base64Data;
            });
        }
    }

    confirmUpload () {
        this.imports.associatedId = this.eventSession.id;
        this.importsService.importCSV(this.imports)
            .map((res: Response) => res)
            .subscribe(
                (res: Response) => this.success(),
                (res: Response) => this.fail());
    }
    
    success() {
        this.eventManager.broadcast({
            name: 'eventEntryResultListModification',
            content: 'Imported session results'
        });
        this.activeModal.dismiss(true);
    }
    
    fail() {
        this.alertService.error('global.messages.info.imports.fail', null);
    }
}

@Component({
    selector: 'jhi-event-edition-copy-entries-popup',
    template: ''
})
export class EventEntryUploadResultsPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEntryResultPopupService: EventEntryResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventEntryResultPopupService
                .openUploadDialog(EventEntryUploadResultsDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
