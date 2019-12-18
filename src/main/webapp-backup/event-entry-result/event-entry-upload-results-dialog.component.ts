import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Response } from '@angular/http';
import { JhiEventManager, JhiLanguageService, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { EventSession } from '../event-session';
import { EventEntryResultPopupService } from '.';

import { Imports, ImportsService } from '../../imports';

@Component({
  selector: 'jhi-event-entry-upload-results-dialog',
  templateUrl: './event-entry-upload-results-dialog.component.html'
})
export class EventEntryUploadResultsDialogComponent implements OnInit {
  imports: Imports;
  isSaving: boolean;
  eventSession: EventSession;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private dataUtils: JhiDataUtils,
    private importsService: ImportsService,
    private eventManager: JhiEventManager
  ) {
    this.imports = new Imports();
    this.imports.importType = 'SESSION_RESULTS';
  }

  ngOnInit() {
    this.isSaving = false;
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  setFileData(event, entity, field, isImage) {
    this.dataUtils.setFileData(event, entity, field, isImage);
  }

  confirmUpload() {
    this.isSaving = true;
    this.imports.associatedId = this.eventSession.id;
    this.importsService
      .importCSV(this.imports)
      .map((res: Response) => res)
      .subscribe((res: Response) => this.success(), (res: Response) => this.fail());
  }

  success() {
    this.isSaving = false;
    this.eventManager.broadcast({
      name: 'eventEntryResultListModification',
      content: 'Imported session results'
    });
    this.eventManager.broadcast({
      name: 'uploadedResult',
      content: 'OK'
    });
    this.activeModal.dismiss(true);
  }

  fail() {
    this.isSaving = false;
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

  constructor(private route: ActivatedRoute, private eventEntryResultPopupService: EventEntryResultPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.eventEntryResultPopupService.openUploadDialog(EventEntryUploadResultsDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
