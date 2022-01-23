import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IChassis, Chassis } from '../chassis.model';
import { ChassisService } from '../service/chassis.service';
import { ChassisDeleteDialogComponent } from '../delete/chassis-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-chassis',
  templateUrl: './chassis.component.html',
})
export class ChassisComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'surname';
  ascending = true;
  reloadData = true;

  dataSource = new MatTableDataSource<IChassis>([]);
  displayedColumns: string[] = ['name', 'manufacturer', 'debutYear', 'derivedFrom', 'rebranded', 'buttons'];

  chassisSearchTextChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected chassisService: ChassisService,
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
    this.currentSearch = this.sessionStorageService.retrieve('chassisSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('chassisSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('chassisSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('chassisSearchPredicate') ?? 'name';
    this.ascending = this.sessionStorageService.retrieve('chassisSearchAscending') ?? true;

    this.loadPage();

    this.chassisSearchTextChanged
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
    this.sessionStorageService.store('chassisSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'name';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.chassisSearchTextChanged.next();
      }
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('chassisSearchPage');
    this.sessionStorageService.clear('chassisSearchItems');
    this.sessionStorageService.clear('chassisSearchPredicate');
    this.sessionStorageService.clear('chassisSearchAscending');
    this.search('');
  }

  trackId(index: number, item: IChassis): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: MouseEvent, chassis: IChassis): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(ChassisDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chassis = chassis;
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
    this.sessionStorageService.store('chassisSearchPage', this.page);
    this.sessionStorageService.store('chassisSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('chassisSearchPredicate', this.predicate);
    this.sessionStorageService.store('chassisSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('chassisSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.chassisService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IChassis[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IChassis[]));
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
    if (this.predicate !== 'id') {
      sortPredicates.push(`id,${ASC}`);
    }
    return sortPredicates;
  }

  private instantiateResponseObjects(data: IChassis[]): IChassis[] {
    const objects: IChassis[] = [];
    data.forEach(chassis => objects.push(
      new Chassis(
        chassis.id,
        chassis.name,
        chassis.manufacturer,
        chassis.debutYear,
        chassis.derivedFrom,
        chassis.rebranded,
        chassis.image,
        chassis.imageContentType,
        chassis.imageUrl,
        chassis.evolutions
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
