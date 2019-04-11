import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';
import { AccountService } from 'app/core';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
    selector: 'jhi-event-entry-result',
    templateUrl: './event-entry-result.component.html'
})
export class EventEntryResultComponent implements OnInit, OnDestroy {
    eventEntryResults: IEventEntryResult[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected eventEntryResultService: EventEntryResultService,
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
            this.eventEntryResultService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IEventEntryResult[]>) => res.ok),
                    map((res: HttpResponse<IEventEntryResult[]>) => res.body)
                )
                .subscribe(
                    (res: IEventEntryResult[]) => (this.eventEntryResults = res),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.eventEntryResultService
            .query()
            .pipe(
                filter((res: HttpResponse<IEventEntryResult[]>) => res.ok),
                map((res: HttpResponse<IEventEntryResult[]>) => res.body)
            )
            .subscribe(
                (res: IEventEntryResult[]) => {
                    this.eventEntryResults = res;
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
        this.registerChangeInEventEntryResults();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IEventEntryResult) {
        return item.id;
    }

    registerChangeInEventEntryResults() {
        this.eventSubscriber = this.eventManager.subscribe('eventEntryResultListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
