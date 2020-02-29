import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiDataUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import { MatPaginator, MatSort } from '@angular/material';

import { IDriver } from 'app/shared/model/driver.model';

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

  displayedColumns: string[] = ['flag', 'name', 'surname', 'birthDate', 'birthPlace', 'deathDate', 'deathPlace', 'portrait', 'buttons'];

  resultsLength = 0;
  isLoadingResults = true;

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
    this.registerChangeInDrivers();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
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
    this.drivers = [];
    if (this.currentSearch) {
      return this.driverService.query({
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
  }

  clear() {
    this.drivers = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.driverService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IDriver[]>) => {
        this.isLoadingResults = false;
        this.drivers = this.processDriversResponse(data);
      });
  }

  search(query) {
    this.drivers = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.driverService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IDriver[]>) => {
        this.isLoadingResults = false;
        this.drivers = this.processDriversResponse(data);
      });
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
    this.eventSubscriber = this.eventManager.subscribe('driverListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<IDriver[]>) => (this.drivers = this.processDriversResponse(data)))
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
