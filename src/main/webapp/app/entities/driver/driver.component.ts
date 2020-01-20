import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiDataUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { IDriver } from 'app/shared/model/driver.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { DriverService } from './driver.service';

@Component({
  selector: 'jhi-driver',
  templateUrl: './driver.component.html'
})
export class DriverComponent implements OnDestroy, AfterViewInit {
  drivers: IDriver[] = [];
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

  displayedColumns: string[] = ['flag', 'name', 'surname', 'birthDate', 'birthPlace', 'deathDate', 'deathPlace', 'portrait'];

  resultsLength = 0;
  isLoadingResults = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    protected driverService: DriverService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
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
    // eslint-disable-next-line no-console
    console.log('ngAfterViewInit');
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.currentSearch) {
            return this.driverService.search({
              page: this.paginator.pageIndex,
              query: this.currentSearch,
              size: this.paginator.pageSize,
              sort: this.sorting()
            });
          }
          return this.driverService.query({
            page: this.paginator.pageIndex,
            size: this.paginator.pageSize,
            sort: this.sorting()
          });
        }),
        map((data: HttpResponse<IDriver[]>) => {
          this.isLoadingResults = false;
          return this.processDriversResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.drivers = data));
  }

  private processDriversResponse(drivers: HttpResponse<IDriver[]>) {
    this.resultsLength = parseInt(drivers.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(drivers.headers.get('link'));
    this.totalItems = parseInt(drivers.headers.get('X-Total-Count'), 10);
    return drivers.body.map(driver =>
      Object.assign({}, driver, {
        birthDate: driver.birthDate !== null ? driver.birthDate.month(driver.birthDate.month() - 1) : null,
        deathDate: driver.deathDate !== null ? driver.deathDate.month(driver.deathDate.month() - 1) : null
      })
    );
  }

  loadAll() {
    if (this.currentSearch) {
      this.driverService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sorting()
        })
        .subscribe((res: HttpResponse<IDriver[]>) => this.paginateDrivers(res.body, res.headers));
      return;
    }
    this.driverService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sorting()
      })
      .subscribe((res: HttpResponse<IDriver[]>) => this.paginateDrivers(res.body, res.headers));
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/driver'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.router.navigate([
      '/driver',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.router.navigate([
      '/driver',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  ngOnInitOrig() {
    this.loadAll();
    this.registerChangeInDrivers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IDriver) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInDrivers() {
    this.eventSubscriber = this.eventManager.subscribe('driverListModification', () => this.loadAll());
  }

  sorting() {
    const result = [this.sort.active + ',' + this.sort.direction];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateDrivers(data: IDriver[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.drivers = data.map(driver =>
      Object.assign({}, driver, {
        birthDate: driver.birthDate !== null ? driver.birthDate.month(driver.birthDate.month() - 1) : null,
        deathDate: driver.deathDate !== null ? driver.deathDate.month(driver.deathDate.month() - 1) : null
      })
    );
  }
}
