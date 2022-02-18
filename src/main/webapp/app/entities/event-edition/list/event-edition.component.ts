import { Component, OnInit, AfterViewInit, ViewChild, Renderer2, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IEvent } from 'app/entities/event/event.model';
import { IEventEdition, EventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';
import { EventEditionDeleteDialogComponent } from '../delete/event-edition-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-event-edition',
  templateUrl: './event-edition.component.html',
})
export class EventEditionComponent implements OnInit, AfterViewInit {
  @Input() event!: IEvent;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'editionYear';
  ascending = false;
  reloadData = true;

  dataSource = new MatTableDataSource<IEventEdition>([]);
  displayedColumns: string[] = ['editionYear', 'affiche', 'longEventName', 'eventDate', 'allowedCategories', 'trackLayout', 'buttons'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected eventEditionService: EventEditionService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal,
    private sessionStorageService: SessionStorageService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.page = this.sessionStorageService.retrieve('eventEditionSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('eventEditionSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('eventEditionSearchPredicate') ?? 'editionYear';
    this.ascending = this.sessionStorageService.retrieve('eventEditionSearchAscending') ?? false;

    this.loadPage();
  }

  trackId(index: number, item: IEventEdition): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(mouseEvent: MouseEvent, event: IEventEdition): void {
    mouseEvent.stopPropagation();
    const modalRef = this.modalService.open(EventEditionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventEdition = event;
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
    this.sessionStorageService.store('eventSearchPage', this.page);
    this.sessionStorageService.store('eventSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('eventSearchPredicate', this.predicate);
    this.sessionStorageService.store('eventSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('eventSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  zoomIn(elementToZoom: HTMLElement): void {
    this.renderer.setStyle(elementToZoom, 'transform', 'scale(1.1)');
  }

  zoomOut(elementToUnzoom: HTMLElement): void {
    this.renderer.setStyle(elementToUnzoom, 'transform', 'scale(1.0)');
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.eventEditionService.findEventEditions(this.event.id!, {
      page: this.page,
      size: this.itemsPerPage,
      sort: this.sort()
    }).subscribe(
      (res: HttpResponse<IEventEdition[]>) => {
        this.isLoading = false;
        this.totalItems = Number(res.headers.get('X-Total-Count'));
        this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IEventEdition[]));
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
    const sortPredicates = [`${this.predicate},${this.ascending ? ASC : DESC }`];
    if (this.predicate !== 'editionYear') {
      sortPredicates.push(`editionYear,${ASC}`);
    }
    return sortPredicates;
  }

  private instantiateResponseObjects(data: IEventEdition[]): IEventEdition[] {
    const objects: IEventEdition[] = [];
    data.forEach(event => objects.push(
      new EventEdition(
        event.id,
        event.previousEditionId,
        event.nextEditionId,
        event.editionYear,
        event.shortEventName,
        event.longEventName,
        event.eventDate,
        event.allowedCategories,
        event.trackLayout,
        event.event,
        event.sessions,
        event.multidriver,
        event.singleChassis,
        event.singleEngine,
        event.singleTyre,
        event.winners,
        event.seriesId,
        event.posterContentType,
        event.poster,
        event.posterUrl,
        event.status,
        event.seriesEditions,
        event.location,
        event.locationTimeZone,
        event.latitude,
        event.longitude,
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
