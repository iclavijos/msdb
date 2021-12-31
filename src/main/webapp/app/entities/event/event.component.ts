import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { IEvent } from 'app/shared/model/event.model';
import { EventService } from './event.service';

import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html'
})
export class EventComponent implements AfterViewInit, OnDestroy {
  currentAccount: any;
  events: IEvent[];
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

  displayedColumns: string[] = ['name', 'description', 'isRally', 'isRaid', 'buttons'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    protected eventService: EventService,
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
    this.registerChangeInEvents();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<IEvent[]>) => {
          this.isLoadingResults = false;
          return this.processEventsResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.events = data));
  }

  private processEventsResponse(events: HttpResponse<IEvent[]>) {
    this.resultsLength = parseInt(events.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(events.headers.get('link'));
    this.totalItems = parseInt(events.headers.get('X-Total-Count'), 10);
    return events.body;
  }

  loadAll() {
    this.currentSearch = sessionStorage.getItem('eventSearch');
    this.events = [];
    if (this.currentSearch) {
      return this.eventService.query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      });
    }
    return this.eventService.query({
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    sessionStorage.removeItem('eventSearch');
    this.events = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.eventService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IEvent[]>) => {
        this.isLoadingResults = false;
        this.events = this.processEventsResponse(data);
      });
  }

  search(query) {
    sessionStorage.setItem('eventSearch', query);
    this.events = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.eventService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IEvent[]>) => {
        this.isLoadingResults = false;
        this.events = this.processEventsResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEvent) {
    return item.id;
  }

  registerChangeInEvents() {
    this.eventSubscriber = this.eventManager.subscribe('eventsListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<IEvent[]>) => (this.events = this.processEventsResponse(data)))
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
