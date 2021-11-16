import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { ITyreProvider } from 'app/shared/model/tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';

import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'jhi-tyre-provider',
  templateUrl: './tyre-provider.component.html'
})
export class TyreProviderComponent implements AfterViewInit, OnDestroy {
  currentAccount: any;
  tyreProviders: ITyreProvider[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  displayedColumns: string[] = ['name', 'logo', 'buttons'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    protected tyreProviderService: TyreProviderService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  ngAfterViewInit() {
    this.registerChangeInTyreProviders();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<ITyreProvider[]>) => {
          this.isLoadingResults = false;
          return this.processTyreProvidersResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.tyreProviders = data));
  }

  private processTyreProvidersResponse(tyreProviders: HttpResponse<ITyreProvider[]>) {
    this.resultsLength = parseInt(tyreProviders.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(tyreProviders.headers.get('link'));
    this.totalItems = parseInt(tyreProviders.headers.get('X-Total-Count'), 10);
    return tyreProviders.body;
  }

  loadAll() {
    this.currentSearch = sessionStorage.getItem('tyreSearch');
    this.tyreProviders = [];
    if (this.currentSearch) {
      return this.tyreProviderService.query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      });
    }
    return this.tyreProviderService.query({
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    sessionStorage.removeItem('tyreSearch');
    this.tyreProviders = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.tyreProviderService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<ITyreProvider[]>) => {
        this.isLoadingResults = false;
        this.tyreProviders = this.processTyreProvidersResponse(data);
      });
  }

  search(query) {
    sessionStorage.setItem('tyreSearch', query);
    this.tyreProviders = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.tyreProviderService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<ITyreProvider[]>) => {
        this.isLoadingResults = false;
        this.tyreProviders = this.processTyreProvidersResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ITyreProvider) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInTyreProviders() {
    this.eventSubscriber = this.eventManager.subscribe('tyreProvidersListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<ITyreProvider[]>) => (this.tyreProviders = this.processTyreProvidersResponse(data)))
    );
  }

  sorting() {
    const result = [this.sort.active + ',' + this.sort.direction];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
}
