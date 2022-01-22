import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IDriver, Driver } from '../driver.model';
import { DriverService } from '../service/driver.service';
import { DriverDeleteDialogComponent } from '../delete/driver-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-driver',
  templateUrl: './driver.component.html',
})
export class DriverComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'surname';
  ascending = true;
  reloadData = true;

  dataSource = new MatTableDataSource<IDriver>([]);
  displayedColumns: string[] = ['flag', 'name', 'surname', 'birthDate', 'birthPlace', 'deathDate', 'deathPlace', 'portrait', 'buttons'];

  driversSearchTextChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected driverService: DriverService,
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
    this.currentSearch = this.sessionStorageService.retrieve('driverSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('driverSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('driverSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('driverSearchPredicate') ?? 'surname';
    this.ascending = this.sessionStorageService.retrieve('driverSearchAscending') ?? true;

    this.loadPage();

    this.driversSearchTextChanged
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.page = 0;
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.predicate = 'surname';
        this.ascending = true;
        this.loadPage();
      });
  }

  search(query: string): void {
    this.sessionStorageService.store('driverSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'surname';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.driversSearchTextChanged.next();
      }
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('driverSearchPage');
    this.sessionStorageService.clear('driverSearchItems');
    this.sessionStorageService.clear('driverSearchPredicate');
    this.sessionStorageService.clear('driverSearchAscending');
    this.search('');
  }

  trackId(index: number, item: IDriver): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: MouseEvent, driver: IDriver): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(DriverDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.driver = driver;
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
    this.sessionStorageService.store('driverSearchPage', this.page);
    this.sessionStorageService.store('driverSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('driverSearchPredicate', this.predicate);
    this.sessionStorageService.store('driverSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('driverSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.driverService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IDriver[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IDriver[]));
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
    if (this.predicate !== 'surname') {
      sortPredicates.push(`surname,${ASC}`);
    }
    return sortPredicates;
  }

  private instantiateResponseObjects(data: IDriver[]): IDriver[] {
    const objects: IDriver[] = [];
    data.forEach(driver => objects.push(
      new Driver(
        driver.id,
        driver.name,
        driver.surname,
        driver.birthDate,
        driver.birthPlace,
        driver.nationality,
        driver.deathDate,
        driver.deathPlace,
        driver.portraitContentType,
        driver.portrait,
        driver.portraitUrl
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
