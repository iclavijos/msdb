import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { IEngine } from 'app/shared/model/engine.model';

import { EngineService } from './engine.service';

import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'jhi-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements AfterViewInit, OnDestroy {
  currentAccount: any;
  engines: IEngine[];
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

  displayedColumns: string[] = [
    'name',
    'manufacturer',
    'capacity',
    'architecture',
    'debutYear',
    'petrolEngine',
    'dieselEngine',
    'electricEngine',
    'otherEngine',
    'turbo',
    'buttons'
  ];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    protected enginesService: EngineService,
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
    this.registerChangeInEngines();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<IEngine[]>) => {
          this.isLoadingResults = false;
          return this.processEnginesResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.engines = data));
  }

  private processEnginesResponse(engines: HttpResponse<IEngine[]>) {
    this.resultsLength = parseInt(engines.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(engines.headers.get('link'));
    this.totalItems = parseInt(engines.headers.get('X-Total-Count'), 10);
    return engines.body;
  }

  loadAll() {
    this.currentSearch = sessionStorage.getItem('engineSearch');
    this.engines = [];
    if (this.currentSearch) {
      return this.enginesService.query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      });
    }
    return this.enginesService.query({
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    sessionStorage.deleteItem('engineSearch');
    this.engines = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.enginesService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IEngine[]>) => {
        this.isLoadingResults = false;
        this.engines = this.processEnginesResponse(data);
      });
  }

  search(query) {
    sessionStorage.setItem('engineSearch', query);
    this.engines = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.enginesService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IEngine[]>) => {
        this.isLoadingResults = false;
        this.engines = this.processEnginesResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEngine) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInEngines() {
    this.eventSubscriber = this.eventManager.subscribe('enginesListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<IEngine[]>) => (this.engines = this.processEnginesResponse(data)))
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
