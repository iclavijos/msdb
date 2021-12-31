import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { Series } from '../../shared/model/series.model';
import { ISeriesEdition, SeriesEdition } from '../../shared/model/series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { SeriesEditionUpdateComponent } from './series-edition-update.component';

import { AccountService } from '../../core/auth/account.service';

import { MatPaginator, MatSort } from '@angular/material';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-series-edition',
  templateUrl: './series-edition.component.html',
  styleUrls: ['series-edition.scss']
})
export class SeriesEditionComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() series: Series;
  currentAccount: any;
  seriesEditions: ISeriesEdition[];
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

  displayedColumns: string[] = ['logo', 'period', 'name', 'singleChassis', 'singleEngine', 'singleTyres', 'allowedCategories'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    protected seriesEditionService: SeriesEditionService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected dialog: MatDialog,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    const hasAnyAuthority = this.accountService.hasAnyAuthority(['ROLE_ADMIN', 'ROLE_EDITOR']);
    if (hasAnyAuthority) {
      this.displayedColumns.push('buttons');
    }
  }

  ngAfterViewInit() {
    this.registerChangeInSeriesEditions();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<ISeriesEdition[]>) => {
          this.isLoadingResults = false;
          return this.processSeriesEditionsResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.seriesEditions = data));
  }

  private processSeriesEditionsResponse(seriesEditions: HttpResponse<ISeriesEdition[]>) {
    this.resultsLength = parseInt(seriesEditions.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(seriesEditions.headers.get('link'));
    this.totalItems = parseInt(seriesEditions.headers.get('X-Total-Count'), 10);

    return seriesEditions.body;
  }

  loadAll() {
    this.seriesEditions = [];
    return this.seriesEditionService.findSeriesEditions(this.series.id, {
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    this.seriesEditions = [];
    this.paginator.pageIndex = 0;
    this.isLoadingResults = true;
    this.seriesEditionService
      .findSeriesEditions(this.series.id, {
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<ISeriesEdition[]>) => {
        this.isLoadingResults = false;
        this.seriesEditions = this.processSeriesEditionsResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ISeriesEdition) {
    return item.id;
  }

  registerChangeInSeriesEditions() {
    this.eventSubscriber = this.eventManager.subscribe('seriesEditionsListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<ISeriesEdition[]>) => (this.seriesEditions = this.processSeriesEditionsResponse(data)))
    );
  }

  sorting() {
    const result = [this.sort.active + ',' + this.sort.direction];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  createSeriesEdition() {
    const dialogRef = this.dialog.open(SeriesEditionUpdateComponent, {
      data: {
        series: this.series,
        seriesEdition: new SeriesEdition()
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadAll().subscribe(data => (this.seriesEditions = data.body));
      }
    });
  }

  editSeriesEdition(seriesEdition: ISeriesEdition, $event) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(SeriesEditionUpdateComponent, {
      data: {
        series: this.series,
        seriesEdition
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadAll().subscribe(data => (this.seriesEditions = data.body));
      }
    });
  }
}
