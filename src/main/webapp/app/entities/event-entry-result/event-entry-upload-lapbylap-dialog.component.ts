import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Response } from '@angular/http';
import { EventManager, JhiLanguageService, AlertService, DataUtils } from 'ng-jhipster';

import { EventSession } from '../event-session';
import { EventEntryResultPopupService } from '.';

import { Imports, ImportsService } from '../../imports';

@Component({
    selector: 'jhi-event-entry-upload-lapbylap-dialog',
    templateUrl: './event-entry-upload-lapbylap-dialog.component.html'
})
export class EventEntryUploadLapByLapDialogComponent {
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
        this.imports.importType = 'LAP_BY_LAP';
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
export class EventEntryUploadLapByLapPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEntryResultPopupService: EventEntryResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventEntryResultPopupService
                .openUploadDialog(EventEntryUploadLapByLapDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
