import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IChassis } from 'app/shared/model/chassis.model';
import { ChassisService } from './chassis.service';

@Component({
    selector: 'jhi-chassis-update',
    templateUrl: './chassis-update.component.html'
})
export class ChassisUpdateComponent implements OnInit {
    chassis: IChassis;
    isSaving: boolean;

    chassisCollection: IChassis[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected chassisService: ChassisService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ chassis }) => {
            this.chassis = chassis;
        });
        this.chassisService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IChassis[]>) => mayBeOk.ok),
                map((response: HttpResponse<IChassis[]>) => response.body)
            )
            .subscribe((res: IChassis[]) => (this.chassisCollection = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.chassis.id !== undefined) {
            this.subscribeToSaveResponse(this.chassisService.update(this.chassis));
        } else {
            this.subscribeToSaveResponse(this.chassisService.create(this.chassis));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IChassis>>) {
        result.subscribe((res: HttpResponse<IChassis>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackChassisById(index: number, item: IChassis) {
        return item.id;
    }
}
