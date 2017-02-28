import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { EventEntry } from './event-entry.model';
import { EventEntryService } from './event-entry.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-event-entry',
    templateUrl: './event-entry.component.html'
})
export class EventEntryComponent implements OnInit, OnDestroy {
eventEntries: EventEntry[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEntryService: EventEntryService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['eventEntry']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.eventEntryService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.eventEntries = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.eventEntryService.query().subscribe(
            (res: Response) => {
                this.eventEntries = res.json();
                this.currentSearch = '';
            },
            (res: Response) => this.onError(res.json())
        );
    }

    search (query) {
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
        this.registerChangeInEventEntries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: EventEntry) {
        return item.id;
    }



    registerChangeInEventEntries() {
        this.eventSubscriber = this.eventManager.subscribe('eventEntryListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
