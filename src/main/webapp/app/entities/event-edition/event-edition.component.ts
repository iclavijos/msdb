import { Component, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { Event } from 'app/shared/model/event.model';
import { IEventEdition } from 'app/shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';

import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'jhi-event-edition',
  templateUrl: './event-edition.component.html'
})
export class EventEditionComponent implements AfterViewInit, OnDestroy {
  @Input() event: Event;
  currentAccount: any;
  eventEditions: IEventEdition[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  displayedColumns: string[] = ['editionYear', 'longEventName', 'eventDate', 'allowedCategories', 'trackLayout', 'buttons'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    protected eventEditionService: EventEditionService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {}

  ngAfterViewInit() {
    this.registerChangeInEventEditions();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<IEventEdition[]>) => {
          this.isLoadingResults = false;
          return this.processEventEditionsResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.eventEditions = data));
  }

  private processEventEditionsResponse(eventEditions: HttpResponse<IEventEdition[]>) {
    this.resultsLength = parseInt(eventEditions.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(eventEditions.headers.get('link'));
    this.totalItems = parseInt(eventEditions.headers.get('X-Total-Count'), 10);

    return eventEditions.body;
  }

  loadAll() {
    this.eventEditions = [];
    return this.eventEditionService.findEventEditions(this.event.id, {
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    this.eventEditions = [];
    this.paginator.pageIndex = 0;
    this.isLoadingResults = true;
    this.eventEditionService
      .findEventEditions(this.event.id, {
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IEventEdition[]>) => {
        this.isLoadingResults = false;
        this.eventEditions = this.processEventEditionsResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEventEdition) {
    return item.id;
  }

  registerChangeInEventEditions() {
    this.eventSubscriber = this.eventManager.subscribe('eventEditionsListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<IEventEdition[]>) => (this.eventEditions = this.processEventEditionsResponse(data)))
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
