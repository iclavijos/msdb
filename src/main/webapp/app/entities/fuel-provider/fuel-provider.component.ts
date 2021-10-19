import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { IFuelProvider } from 'app/shared/model/fuel-provider.model';
import { FuelProviderService } from './fuel-provider.service';

import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'jhi-fuel-provider',
  templateUrl: './fuel-provider.component.html'
})
export class FuelProviderComponent implements AfterViewInit, OnDestroy {
  currentAccount: any;
  fuelProviders: IFuelProvider[];
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
    protected fuelProviderService: FuelProviderService,
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
    this.registerChangeInFuelProviders();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<IFuelProvider[]>) => {
          this.isLoadingResults = false;
          return this.processFuelProvidersResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.fuelProviders = data));
  }

  private processFuelProvidersResponse(fuelProviders: HttpResponse<IFuelProvider[]>) {
    this.resultsLength = parseInt(fuelProviders.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(fuelProviders.headers.get('link'));
    this.totalItems = parseInt(fuelProviders.headers.get('X-Total-Count'), 10);
    return fuelProviders.body;
  }

  loadAll() {
    this.currentSearch = sessionStorage.getItem('fuelSearch');
    this.fuelProviders = [];
    if (this.currentSearch) {
      return this.fuelProviderService.query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      });
    }
    return this.fuelProviderService.query({
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    sessionStorage.deleteItem('fuelSearch');
    this.fuelProviders = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.fuelProviderService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IFuelProvider[]>) => {
        this.isLoadingResults = false;
        this.fuelProviders = this.processFuelProvidersResponse(data);
      });
  }

  search(query) {
    sessionStorage.setItem('fuelSearch', query);
    this.fuelProviders = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.fuelProviderService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IFuelProvider[]>) => {
        this.isLoadingResults = false;
        this.fuelProviders = this.processFuelProvidersResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IFuelProvider) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInFuelProviders() {
    this.eventSubscriber = this.eventManager.subscribe('fuelProvidersListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<IFuelProvider[]>) => (this.fuelProviders = this.processFuelProvidersResponse(data)))
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
