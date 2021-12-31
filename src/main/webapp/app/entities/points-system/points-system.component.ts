import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { IPointsSystem } from '../../shared/model/points-system.model';
import { PointsSystemService } from './points-system.service';

import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'jhi-points-system',
  styleUrls: ['points-system.component.scss'],
  templateUrl: './points-system.component.html'
})
export class PointsSystemComponent implements AfterViewInit, OnDestroy {
  currentAccount: any;
  pointsSystems: IPointsSystem[];
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
    'points',
    'pointsMostLeadLaps',
    'pointsFastLap',
    'pointsPole',
    'pointsLeadLap',
    'active',
    'buttons'
  ];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    protected pointsSystemService: PointsSystemService,
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
    this.registerChangeInPointsSystems();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<IPointsSystem[]>) => {
          this.isLoadingResults = false;
          return this.processPointsSystemsResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.pointsSystems = data));
  }

  private processPointsSystemsResponse(pointsSystems: HttpResponse<IPointsSystem[]>) {
    this.resultsLength = parseInt(pointsSystems.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(pointsSystems.headers.get('link'));
    this.totalItems = parseInt(pointsSystems.headers.get('X-Total-Count'), 10);
    return pointsSystems.body;
  }

  loadAll() {
    this.currentSearch = sessionStorage.getItem('pointsSearch');
    this.pointsSystems = [];
    if (this.currentSearch) {
      return this.pointsSystemService.query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      });
    }
    return this.pointsSystemService.query({
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    sessionStorage.removeItem('pointsSearch');
    this.pointsSystems = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.pointsSystemService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IPointsSystem[]>) => {
        this.isLoadingResults = false;
        this.pointsSystems = this.processPointsSystemsResponse(data);
      });
  }

  search(query) {
    sessionStorage.setItem('pointsSearch', query);
    this.pointsSystems = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.pointsSystemService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IPointsSystem[]>) => {
        this.isLoadingResults = false;
        this.pointsSystems = this.processPointsSystemsResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPointsSystem) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInPointsSystems() {
    this.eventSubscriber = this.eventManager.subscribe('pointsSystemsListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<IPointsSystem[]>) => (this.pointsSystems = this.processPointsSystemsResponse(data)))
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
