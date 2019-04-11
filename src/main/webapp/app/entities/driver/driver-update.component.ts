import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiDataUtils } from 'ng-jhipster';
import { IDriver } from 'app/shared/model/driver.model';
import { DriverService } from './driver.service';

@Component({
    selector: 'jhi-driver-update',
    templateUrl: './driver-update.component.html'
})
export class DriverUpdateComponent implements OnInit {
    driver: IDriver;
    isSaving: boolean;
    birthDateDp: any;
    deathDateDp: any;

    constructor(
        protected dataUtils: JhiDataUtils,
        protected driverService: DriverService,
        protected elementRef: ElementRef,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ driver }) => {
            this.driver = driver;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.driver, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.driver.id !== undefined) {
            this.subscribeToSaveResponse(this.driverService.update(this.driver));
        } else {
            this.subscribeToSaveResponse(this.driverService.create(this.driver));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IDriver>>) {
        result.subscribe((res: HttpResponse<IDriver>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
