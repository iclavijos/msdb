import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ITyreProvider, TyreProvider } from '../tyre-provider.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { TyreProviderService } from '../service/tyre-provider.service';
import { TyreProviderDeleteDialogComponent } from '../delete/tyre-provider-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { AccountService } from 'app/core/auth/account.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-tyre-provider',
  templateUrl: './tyre-provider.component.html',
})
export class TyreProviderComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'name';
  ascending = true;
  reloadData = true;

  tyreProvidersSearchTextChanged = new Subject<string>();

  dataSource = new MatTableDataSource<ITyreProvider>([]);
  displayedColumns: string[] = ['name', 'logo'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected tyreProviderService: TyreProviderService,
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
    this.currentSearch = this.sessionStorageService.retrieve('tyreProviderSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('tyreProviderSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('tyreProviderSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('tyreProviderSearchPredicate') ?? 'name';
    this.ascending = this.sessionStorageService.retrieve('tyreProviderSearchAscending') ?? true;

    this.loadPage();

    this.tyreProvidersSearchTextChanged
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
    this.sessionStorageService.store('tyreProviderSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'name';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.tyreProvidersSearchTextChanged.next();
      }
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('tyreProviderSearchPage');
    this.sessionStorageService.clear('tyreProviderSearchItems');
    this.sessionStorageService.clear('tyreProviderSearchPredicate');
    this.sessionStorageService.clear('tyreProviderSearchAscending');
    this.search('');
  }

  trackId(index: number, item: ITyreProvider): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: MouseEvent, tyreProvider: ITyreProvider): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(TyreProviderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tyreProvider = tyreProvider;
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
    this.sessionStorageService.store('tyreProviderSearchPage', this.page);
    this.sessionStorageService.store('tyreProviderSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('tyreProviderSearchPredicate', this.predicate);
    this.sessionStorageService.store('tyreProviderSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('tyreProviderSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.tyreProviderService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ITyreProvider[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as ITyreProvider[]));
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

  private instantiateResponseObjects(data: ITyreProvider[]): ITyreProvider[] {
    const objects: ITyreProvider[] = [];
    data.forEach(tyreProvider => objects.push(
      new TyreProvider(
        tyreProvider.id,
        tyreProvider.name,
        undefined,
        undefined,
        tyreProvider.logoUrl
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
