import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IPointsSystem } from 'app/shared/model/points-system.model';
import { PointsSystemService } from './points-system.service';

@Component({
    selector: 'jhi-points-system-update',
    templateUrl: './points-system-update.component.html'
})
export class PointsSystemUpdateComponent implements OnInit {
    pointsSystem: IPointsSystem;
    isSaving: boolean;

    constructor(protected pointsSystemService: PointsSystemService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ pointsSystem }) => {
            this.pointsSystem = pointsSystem;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.pointsSystem.id !== undefined) {
            this.subscribeToSaveResponse(this.pointsSystemService.update(this.pointsSystem));
        } else {
            this.subscribeToSaveResponse(this.pointsSystemService.create(this.pointsSystem));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPointsSystem>>) {
        result.subscribe((res: HttpResponse<IPointsSystem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
