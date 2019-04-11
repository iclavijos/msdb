import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { EventSession } from './event-session.model';
import { EventSessionService } from './event-session.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-event-session',
    templateUrl: './event-session.component.html'
})
export class EventSessionComponent implements OnInit, OnDestroy {
eventSessions: EventSession[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private eventSessionService: EventSessionService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.eventSessionService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.eventSessions = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.eventSessionService.query().subscribe(
            (res: ResponseWrapper) => {
                this.eventSessions = res.json;
                this.currentSearch = '';
            },
            (res: ResponseWrapper) => this.onError(res.json)
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
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInEventSessions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: EventSession) {
        return item.id;
    }
    registerChangeInEventSessions() {
        this.eventSubscriber = this.eventManager.subscribe('eventSessionListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
