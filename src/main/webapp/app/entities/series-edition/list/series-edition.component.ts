import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ISeriesEdition, SeriesEdition } from '../series-edition.model';
import { SeriesEditionService } from '../service/series-edition.service';
import { SeriesEditionDeleteDialogComponent } from '../delete/series-edition-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-series-edition',
  templateUrl: './series-edition.component.html',
  styleUrls: ['./series-edition.component.scss']
})
export class SeriesEditionComponent implements OnInit, AfterViewInit {
  @Input() series: Series;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'name';

  dataSource = new MatTableDataSource<ISeriesEdition>([]);
  displayedColumns: string[] = ['logo', 'period', 'name', 'singleChassis', 'singleEngine', 'singleTyres', 'allowedCategories'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;

  constructor(
    protected seriesEditionService: SeriesEditionService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal,
    private sessionStorageService: SessionStorageService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  trackId(index: number, item: ISeriesEdition): number {
    return item.id!;
  }

  delete(event: MouseEvent, seriesEdition: ISeriesEdition): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(SeriesEditionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.seriesEdition = seriesEdition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  pageChanged(event: PageEvent): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.seriesEditionService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ISeriesEdition[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as ISeriesEdition[]));
          this.sorter.active = this.predicate;
          this.sorter.start = this.ascending ? 'asc' : 'desc';
          this.dataSource.sort = this.sorter;
          this.paginator.pageIndex = this.page;
          this.setSort(this.predicate, this.ascending ? 'asc' : 'desc');
        },
        () => {
          this.isLoading = false;
          // this.onError();
        }
      );
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private instantiateResponseObjects(data: ISeriesEdition[]): ISeriesEdition[] {
    const objects: ISeriesEdition[] = [];
    data.forEach(seriesEdition => objects.push(
      new SeriesEdition(
        seriesEdition.id,
        seriesEdition.editionName,
        seriesEdition.period,
        seriesEdition.singleChassis,
        seriesEdition.singleEngine,
        seriesEdition.singleTyre,
        seriesEdition.allowedCategories,
        seriesEdition.series,
        seriesEdition.numEvents,
        seriesEdition.driverChamp,
        seriesEdition.teamChamp,
        seriesEdition.manufacturerChamp,
        seriesEdition.pointsSystems,
        seriesEdition.events,
        seriesEdition.driversStandings,
        seriesEdition.teamsStandings,
        seriesEdition.manufacturersStandings,
        seriesEdition.standingsPerCategory,
        seriesEdition.logoContentType,
        seriesEdition.logo,
        seriesEdition.logoUrl,
      )));

    return objects;
  }

  private setSort(id: string, start?: 'asc' | 'desc'): void {
    start = start ?? 'asc';
    const matSort = this.dataSource.sort;
    const toState = 'active';
    const disableClear = false;

    // reset state so that start is the first sort direction that you will see
    this.reloadData = false;
    matSort!.sort({ id: '', start, disableClear });
    matSort!.sort({ id, start, disableClear });
    this.reloadData = true;

    // ugly hack
    (matSort!.sortables.get(id) as MatSortHeader)._setAnimationTransitionState({ toState });
  }
}
