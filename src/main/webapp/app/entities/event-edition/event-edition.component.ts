import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-event-edition',
    templateUrl: './event-edition.component.html'
})
export class EventEditionComponent implements OnInit, OnDestroy {
eventEditions: EventEdition[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEditionService: EventEditionService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['eventEdition']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.eventEditionService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.eventEditions = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.eventEditionService.query().subscribe(
            (res: Response) => {
                this.eventEditions = res.json();
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
        this.registerChangeInEventEditions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: EventEdition) {
        return item.id;
    }



    registerChangeInEventEditions() {
        this.eventSubscriber = this.eventManager.subscribe('eventEditionListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
