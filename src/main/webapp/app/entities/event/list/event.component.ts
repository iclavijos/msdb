import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IEvent, Event } from '../event.model';
import { EventService } from '../service/event.service';
import { EventDeleteDialogComponent } from '../delete/event-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'surname';
  ascending = true;
  reloadData = true;

  dataSource = new MatTableDataSource<IEvent>([]);
  displayedColumns: string[] = ['name', 'description', 'isRally', 'isRaid', 'buttons'];

  eventsSearchTextChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal,
    private sessionStorageService: SessionStorageService
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.currentSearch = this.sessionStorageService.retrieve('eventSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('eventSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('eventSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('eventSearchPredicate') ?? 'name';
    this.ascending = this.sessionStorageService.retrieve('eventSearchAscending') ?? true;

    this.loadPage();

    this.eventsSearchTextChanged
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.page = 0;
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.predicate = 'name';
        this.ascending = true;
        this.loadPage();
      });
  }

  search(query: string): void {
    this.sessionStorageService.store('eventSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'name';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.eventsSearchTextChanged.next();
      }
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('eventSearchPage');
    this.sessionStorageService.clear('eventSearchItems');
    this.sessionStorageService.clear('eventSearchPredicate');
    this.sessionStorageService.clear('eventSearchAscending');
    this.search('');
  }

  trackId(index: number, item: IEvent): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(mouseEvent: MouseEvent, event: IEvent): void {
    mouseEvent.stopPropagation();
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
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

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.eventService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IEvent[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IEvent[]));
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
    if (this.predicate !== 'name') {
      sortPredicates.push(`name,${ASC}`);
    }
    return sortPredicates;
  }

  private instantiateResponseObjects(data: IEvent[]): IEvent[] {
    const objects: IEvent[] = [];
    data.forEach(event => objects.push(
      new Event(
        event.id,
        event.name,
        event.description,
        event.rally,
        event.raid,
        event.editions
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
