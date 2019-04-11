import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDriverPointsDetails } from 'app/shared/model/driver-points-details.model';
import { AccountService } from 'app/core';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
    selector: 'jhi-driver-points-details',
    templateUrl: './driver-points-details.component.html'
})
export class DriverPointsDetailsComponent implements OnInit, OnDestroy {
    driverPointsDetails: IDriverPointsDetails[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected driverPointsDetailsService: DriverPointsDetailsService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.driverPointsDetailsService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IDriverPointsDetails[]>) => res.ok),
                    map((res: HttpResponse<IDriverPointsDetails[]>) => res.body)
                )
                .subscribe(
                    (res: IDriverPointsDetails[]) => (this.driverPointsDetails = res),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.driverPointsDetailsService
            .query()
            .pipe(
                filter((res: HttpResponse<IDriverPointsDetails[]>) => res.ok),
                map((res: HttpResponse<IDriverPointsDetails[]>) => res.body)
            )
            .subscribe(
                (res: IDriverPointsDetails[]) => {
                    this.driverPointsDetails = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDriverPointsDetails();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IDriverPointsDetails) {
        return item.id;
    }

    registerChangeInDriverPointsDetails() {
        this.eventSubscriber = this.eventManager.subscribe('driverPointsDetailsListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
