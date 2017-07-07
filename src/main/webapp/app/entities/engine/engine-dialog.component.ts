import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiLanguageService, JhiDataUtils } from 'ng-jhipster';

import { Engine } from './engine.model';
import { EnginePopupService } from './engine-popup.service';
import { EngineService } from './engine.service';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

@Component({
    selector: 'jhi-engine-dialog',
    templateUrl: './engine-dialog.component.html'
})
export class EngineDialogComponent implements OnInit {

    engine: Engine;
    authorities: any[];
    isSaving: boolean;
    private derivedFromSearch: string;
    protected dataService: CompleterData;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private engineService: EngineService,
        private eventManager: JhiEventManager,
        private completerService: CompleterService
    ) {
        this.dataService = completerService.remote('api/_search/engines?query=', null, 'name').descriptionField('manufacturer');
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
        if (this.engine.derivedFrom) {
            this.derivedFromSearch = this.engine.manufacturer + ' ' + this.engine.name;
        }
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData($event, engine, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                engine[field] = base64Data;
                engine[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.engine.id !== undefined) {
            this.engineService.update(this.engine)
                .subscribe((res: Engine) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.engineService.create(this.engine)
                .subscribe((res: Engine) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Engine) {
        this.eventManager.broadcast({ name: 'engineListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

    trackEngineById(index: number, item: Engine) {
        return item.id;
    }

    public onEngineSelected(selected: CompleterItem) {
        if (selected) {
            this.engine.derivedFrom = selected.originalObject;
            this.derivedFromSearch = this.engine.manufacturer + ' ' + this.engine.name;
        } else {
            this.engine.derivedFrom = null;
            this.derivedFromSearch = null;
        }
    }
}

@Component({
    selector: 'jhi-engine-popup',
    template: ''
})
export class EnginePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private enginePopupService: EnginePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.enginePopupService
                    .open(EngineDialogComponent, params['id']);
            } else {
                this.modalRef = this.enginePopupService
                    .open(EngineDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
