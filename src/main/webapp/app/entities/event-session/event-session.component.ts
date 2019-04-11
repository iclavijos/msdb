import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEventSession } from 'app/shared/model/event-session.model';
import { AccountService } from 'app/core';
import { EventSessionService } from './event-session.service';

@Component({
    selector: 'jhi-event-session',
    templateUrl: './event-session.component.html'
})
export class EventSessionComponent implements OnInit, OnDestroy {
    eventSessions: IEventSession[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected eventSessionService: EventSessionService,
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
            this.eventSessionService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IEventSession[]>) => res.ok),
                    map((res: HttpResponse<IEventSession[]>) => res.body)
                )
                .subscribe((res: IEventSession[]) => (this.eventSessions = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.eventSessionService
            .query()
            .pipe(
                filter((res: HttpResponse<IEventSession[]>) => res.ok),
                map((res: HttpResponse<IEventSession[]>) => res.body)
            )
            .subscribe(
                (res: IEventSession[]) => {
                    this.eventSessions = res;
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
        this.registerChangeInEventSessions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IEventSession) {
        return item.id;
    }

    registerChangeInEventSessions() {
        this.eventSubscriber = this.eventManager.subscribe('eventSessionListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
