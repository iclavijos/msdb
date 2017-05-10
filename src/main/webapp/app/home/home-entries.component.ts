import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService, DataUtils } from 'ng-jhipster';

import { ITEMS_PER_PAGE, Principal } from '../shared';
import { PaginationConfig } from '../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-home-entries',
    templateUrl: './home-entries.component.html'
})
export class HomeEntriesComponent implements OnInit {

    currentAccount: any;
    error: any;
    success: any;
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
    resultEntries: any[];
    
    constructor(
        private jhiLanguageService: JhiLanguageService,
        private parseLinks: ParseLinks,
        private alertService: AlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private dataUtils: DataUtils,
        private router: Router,
        private eventManager: EventManager,
        private paginationUtil: PaginationUtil,
        private paginationConfig: PaginationConfig,
        private http: Http
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }
    
    ngOnInit() {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        
        if (this.currentSearch) {
            this.query({
                query: this.currentSearch,
                size: this.itemsPerPage}).subscribe(
                    (res: Response) => this.onSuccess(res.json(), res.headers));
        }
    }
    
    loadPage (page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page - 1;
            this.transition();
        }
    }
    
    transition() {
        this.router.navigate(['/homeEntries'], {queryParams:
            {
                page: this.page - 1,
                size: this.itemsPerPage,
                search: this.currentSearch
            }
        });
        this.query({
            query: this.currentSearch,
            page: this.page - 1,
            size: this.itemsPerPage}).subscribe(
                (res: Response) => this.onSuccess(res.json(), res.headers));
    }
    
    private query(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(`api/search/entries`, options)
            .map((res: any) => res)
        ;
    }
    
    private createRequestOption(req?: any): BaseRequestOptions {
        let options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            let params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }
    
    private onSuccess (data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        this.resultEntries = data;
    }

}
