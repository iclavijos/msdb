import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { IFuelProvider, FuelProvider } from '../fuel-provider.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { FuelProviderService } from '../service/fuel-provider.service';
import { FuelProviderDeleteDialogComponent } from '../delete/fuel-provider-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { AccountService } from 'app/core/auth/account.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-fuel-provider',
  templateUrl: './fuel-provider.component.html',
})
export class FuelProviderComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'name';
  ascending = true;
  reloadData = true;

  fuelProvidersSearchTextChanged = new Subject<string>();

  dataSource = new MatTableDataSource<IFuelProvider>([]);
  displayedColumns: string[] = ['name', 'logo'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected fuelProviderService: FuelProviderService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    private sessionStorageService: SessionStorageService
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.accountService.hasAnyAuthority(["ROLE_ADMIN", "ROLE_EDITOR"])) {
      this.displayedColumns.push('buttons');
    }
  }

  ngOnInit(): void {
    this.currentSearch = this.sessionStorageService.retrieve('fuelProviderSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('fuelProviderSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('fuelProviderSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('fuelProviderSearchPredicate') ?? 'name';
    this.ascending = this.sessionStorageService.retrieve('fuelProviderSearchAscending') ?? true;

    this.loadPage();

    this.fuelProvidersSearchTextChanged
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
    this.sessionStorageService.store('fuelProviderSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'name';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.fuelProvidersSearchTextChanged.next();
      }
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('fuelProviderSearchPage');
    this.sessionStorageService.clear('fuelProviderSearchItems');
    this.sessionStorageService.clear('fuelProviderSearchPredicate');
    this.sessionStorageService.clear('fuelProviderSearchAscending');
    this.search('');
  }

  trackId(index: number, item: IFuelProvider): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: MouseEvent, fuelProvider: IFuelProvider): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(FuelProviderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fuelProvider = fuelProvider;
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
    this.sessionStorageService.store('fuelProviderSearchPage', this.page);
    this.sessionStorageService.store('fuelProviderSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('fuelProviderSearchPredicate', this.predicate);
    this.sessionStorageService.store('fuelProviderSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('fuelProviderSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.fuelProviderService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IFuelProvider[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IFuelProvider[]));
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

  private instantiateResponseObjects(data: IFuelProvider[]): IFuelProvider[] {
    const objects: IFuelProvider[] = [];
    data.forEach(fuelProvider => objects.push(
      new FuelProvider(
        fuelProvider.id,
        fuelProvider.name,
        undefined,
        undefined,
        fuelProvider.logoUrl
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
