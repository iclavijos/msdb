import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IDriverPointsDetails } from 'app/shared/model/driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
    selector: 'jhi-driver-points-details-update',
    templateUrl: './driver-points-details-update.component.html'
})
export class DriverPointsDetailsUpdateComponent implements OnInit {
    driverPointsDetails: IDriverPointsDetails;
    isSaving: boolean;

    constructor(protected driverPointsDetailsService: DriverPointsDetailsService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ driverPointsDetails }) => {
            this.driverPointsDetails = driverPointsDetails;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.driverPointsDetails.id !== undefined) {
            this.subscribeToSaveResponse(this.driverPointsDetailsService.update(this.driverPointsDetails));
        } else {
            this.subscribeToSaveResponse(this.driverPointsDetailsService.create(this.driverPointsDetails));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IDriverPointsDetails>>) {
        result.subscribe((res: HttpResponse<IDriverPointsDetails>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
