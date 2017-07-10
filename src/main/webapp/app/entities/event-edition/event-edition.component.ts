import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { Event } from '../event';
import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';
import { EventEntry } from '../event-entry/event-entry.model';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-event-edition',
    templateUrl: './event-edition.component.html'
})
export class EventEditionComponent implements OnInit, OnDestroy {

    @Input() event: Event;
    currentAccount: any;
    eventEditions: EventEdition[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private eventEditionService: EventEditionService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            if (data['pagingParams']) {
                this.page = data['pagingParams'].page;
                this.previousPage = data['pagingParams'].page;
                this.reverse = data['pagingParams'].ascending;
                this.predicate = data['pagingParams'].predicate;
            } else {
                this.page = 1;
                this.previousPage = 1;
                this.reverse = true;
                this.predicate = 'id';
            }
        });
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.eventEditionService.search({
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                    (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
        }
        this.eventEditionService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadEventEditions() {

        this.eventEditionService.findEventEditions(this.event.id, {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => {console.log(res); this.onError(res.json);}
        );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        let queryParams = {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        };
        if (!this.event) {
            this.router.navigate(['/event-edition'], queryParams);
            this.loadAll();
        } else {
            this.router.navigate(['/event', this.event.id], queryParams);
            this.loadEventEditions();
        }
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/event-edition', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate(['/event-edition', {
            search: this.currentSearch,
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        if (!this.event) {
            this.loadAll();
        } else {
            this.loadEventEditions();
        }
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInEventEditions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
    
    private computeDriversName(entry: EventEntry): string {
        let result = '';
        
        for(let i = 0; i < entry.drivers.length; i++) {
            result += entry.drivers[i].surname;
            if (i < entry.drivers.length - 1) {
                result += ' / ';
            }
        }
        return result;
    }

    trackId(index: number, item: EventEdition) {
        return item.id;
    }
    registerChangeInEventEditions() {
        this.eventSubscriber = this.eventManager.subscribe('eventEditionListModification', (response) => this.loadEventEditions());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.eventEditions = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
