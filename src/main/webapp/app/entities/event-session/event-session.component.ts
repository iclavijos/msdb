import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { EventSession } from './event-session.model';
import { EventSessionService } from './event-session.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

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
        private jhiLanguageService: JhiLanguageService,
        private eventSessionService: EventSessionService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['eventSession']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.eventSessionService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.eventSessions = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.eventSessionService.query().subscribe(
            (res: Response) => {
                this.eventSessions = res.json();
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
        this.registerChangeInEventSessions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: EventSession) {
        return item.id;
    }



    registerChangeInEventSessions() {
        this.eventSubscriber = this.eventManager.subscribe('eventSessionListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
