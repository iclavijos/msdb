import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEventEntry } from 'app/shared/model/event-entry.model';
import { AccountService } from 'app/core';
import { EventEntryService } from './event-entry.service';

@Component({
    selector: 'jhi-event-entry',
    templateUrl: './event-entry.component.html'
})
export class EventEntryComponent implements OnInit, OnDestroy {
    eventEntries: IEventEntry[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected eventEntryService: EventEntryService,
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
            this.eventEntryService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IEventEntry[]>) => res.ok),
                    map((res: HttpResponse<IEventEntry[]>) => res.body)
                )
                .subscribe((res: IEventEntry[]) => (this.eventEntries = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.eventEntryService
            .query()
            .pipe(
                filter((res: HttpResponse<IEventEntry[]>) => res.ok),
                map((res: HttpResponse<IEventEntry[]>) => res.body)
            )
            .subscribe(
                (res: IEventEntry[]) => {
                    this.eventEntries = res;
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
        this.registerChangeInEventEntries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IEventEntry) {
        return item.id;
    }

    registerChangeInEventEntries() {
        this.eventSubscriber = this.eventManager.subscribe('eventEntryListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
