import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITyreProvider } from '../tyre-provider.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { TyreProviderService } from '../service/tyre-provider.service';
import { TyreProviderDeleteDialogComponent } from '../delete/tyre-provider-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'jhi-tyre-provider',
  templateUrl: './tyre-provider.component.html',
})
export class TyreProviderComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;

  dataSource = new MatTableDataSource<ITyreProvider>([]);
  displayedColumns: string[] = ['name', 'logo', 'buttons'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;

  constructor(
    protected tyreProviderService: TyreProviderService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  search(query: string): void {
    this.dataSource.filter = query.trim().toLowerCase();
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

  protected loadPage(): void {
    this.tyreProviderService
      .query({
        page: 0,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: ['name,asc'],
      })
      .subscribe(
        (res: HttpResponse<ITyreProvider[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource.data = res.body ?? [];
          this.dataSource.sort = this.sorter;
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  protected sort(): string[] {
    return [this.predicate + ',' + (this.ascending ? ASC : DESC)];
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        // this.loadPage(pageNumber, true);
      }
    });
  }

  protected onError(): void {
    this.page = this.page ?? 1;
  }
}
