import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-event-entry-result',
    templateUrl: './event-entry-result.component.html'
})
export class EventEntryResultComponent implements OnInit, OnDestroy {
eventEntryResults: EventEntryResult[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private eventEntryResultService: EventEntryResultService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.eventEntryResultService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.eventEntryResults = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.eventEntryResultService.query().subscribe(
            (res: ResponseWrapper) => {
                this.eventEntryResults = res.json;
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
        this.registerChangeInEventEntryResults();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: EventEntryResult) {
        return item.id;
    }
    registerChangeInEventEntryResults() {
        this.eventSubscriber = this.eventManager.subscribe('eventEntryResultListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
