import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDriver, Driver } from '../driver.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DriverService } from '../service/driver.service';
import { DriverDeleteDialogComponent } from '../delete/driver-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

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

  dataSource = new MatTableDataSource<IDriver>([]);
  displayedColumns: string[] = ['flag', 'name', 'surname', 'birthDate', 'birthPlace', 'deathDate', 'deathPlace', 'portrait', 'buttons'];

  driversSearchTextChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;

  constructor(
    protected driverService: DriverService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadPage();

    this.driversSearchTextChanged
      .pipe(debounceTime(300))
      .subscribe(() => this.loadPage());
  }

  search(query: string): void {
    if (query.length === 0) {
      this.currentSearch = '';
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.driversSearchTextChanged.next();
      }
    }
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
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.page = 0;
    this.loadPage();
    this.paginator.pageIndex = 0;
  }

  protected loadPage(): void {
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
          this.dataSource.sort = this.sorter;
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
}
