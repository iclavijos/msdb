import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';
import { ICar } from 'app/shared/model/car.model';
import { CarService } from 'app/entities/car';
import { IDriver } from 'app/shared/model/driver.model';
import { DriverService } from 'app/entities/driver';
import { ITeam } from 'app/shared/model/team.model';
import { TeamService } from 'app/entities/team';

@Component({
    selector: 'jhi-event-entry-update',
    templateUrl: './event-entry-update.component.html'
})
export class EventEntryUpdateComponent implements OnInit {
    eventEntry: IEventEntry;
    isSaving: boolean;

    cars: ICar[];

    drivers: IDriver[];

    teams: ITeam[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected eventEntryService: EventEntryService,
        protected carService: CarService,
        protected driverService: DriverService,
        protected teamService: TeamService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventEntry }) => {
            this.eventEntry = eventEntry;
        });
        this.carService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICar[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICar[]>) => response.body)
            )
            .subscribe((res: ICar[]) => (this.cars = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.driverService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IDriver[]>) => mayBeOk.ok),
                map((response: HttpResponse<IDriver[]>) => response.body)
            )
            .subscribe((res: IDriver[]) => (this.drivers = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.teamService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITeam[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITeam[]>) => response.body)
            )
            .subscribe((res: ITeam[]) => (this.teams = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.eventEntry.id !== undefined) {
            this.subscribeToSaveResponse(this.eventEntryService.update(this.eventEntry));
        } else {
            this.subscribeToSaveResponse(this.eventEntryService.create(this.eventEntry));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEntry>>) {
        result.subscribe((res: HttpResponse<IEventEntry>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCarById(index: number, item: ICar) {
        return item.id;
    }

    trackDriverById(index: number, item: IDriver) {
        return item.id;
    }

    trackTeamById(index: number, item: ITeam) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
