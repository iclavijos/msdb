import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiDataUtils, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';
import { Response } from '@angular/http';
import { Series } from './series.model';
import { SeriesEdition } from '../series-edition/series-edition.model';
import { SeriesService } from './series.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-series-detail',
    templateUrl: './series-detail.component.html'
})
export class SeriesDetailComponent implements OnInit, OnDestroy {

    series: Series;
    private subscription: any;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    currentSearch: string;

    seriesEditions: SeriesEdition[];

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: JhiDataUtils,
        private parseLinks: JhiParseLinks,
        private seriesService: SeriesService,
        private alertService: JhiAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.route.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = route.snapshot.params['search'] ? route.snapshot.params['search'] : '';
    }

    ngOnInit() {
        let id = 0;
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
            id = params['id'];
        });
    }

    load(id) {
        this.seriesService.find(id).subscribe((series) => {
            this.series = series;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }
    loadPage (page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/series-edition'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    sort () {
        let result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess (data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        this.seriesEditions = data;
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

}
