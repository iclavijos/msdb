import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IPointsSystem, PointsSystem } from '../points-system.model';
import { PointsSystemService } from '../service/points-system.service';
import { PointsSystemDeleteDialogComponent } from '../delete/points-system-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { AccountService } from 'app/core/auth/account.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-points-system',
  templateUrl: './points-system.component.html',
  styleUrls: ['./points-system.component.scss']
})
export class PointsSystemComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'name';
  ascending = true;
  reloadData = true;

  dataSource = new MatTableDataSource<IPointsSystem>([]);
  displayedColumns: string[] = [
      'name',
      'points',
      'pointsMostLeadLaps',
      'pointsFastLap',
      'pointsPole',
      'pointsLeadLap'
    ];
  pointsSystemSearchTextChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected pointsSystemService: PointsSystemService,
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
    this.currentSearch = this.sessionStorageService.retrieve('pointsSystemSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('pointsSystemSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('pointsSystemSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('pointsSystemSearchPredicate') ?? 'name';
    this.ascending = this.sessionStorageService.retrieve('pointsSystemSearchAscending') ?? true;

    this.loadPage();

    this.pointsSystemSearchTextChanged
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
    this.sessionStorageService.store('pointsSystemSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'name';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.pointsSystemSearchTextChanged.next();
      }
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('pointsSystemSearchPage');
    this.sessionStorageService.clear('pointsSystemSearchItems');
    this.sessionStorageService.clear('pointsSystemSearchPredicate');
    this.sessionStorageService.clear('pointsSystemSearchAscending');
    this.search('');
  }

  trackId(index: number, item: IPointsSystem): number {
    return item.id!;
  }

  delete(event: MouseEvent, pointsSystem: IPointsSystem): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(PointsSystemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pointsSystem = pointsSystem;
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
    this.sessionStorageService.store('pointsSystemSearchPage', this.page);
    this.sessionStorageService.store('pointsSystemSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('pointsSystemSearchPredicate', this.predicate);
    this.sessionStorageService.store('pointsSystemSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('pointsSystemSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.pointsSystemService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IPointsSystem[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IPointsSystem[]));
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

  private instantiateResponseObjects(data: IPointsSystem[]): IPointsSystem[] {
    const objects: IPointsSystem[] = [];
    data.forEach(pointsSystem => objects.push(
      new PointsSystem(
        pointsSystem.id,
        pointsSystem.name,
        pointsSystem.description,
        pointsSystem.points,
        pointsSystem.pointsMostLeadLaps,
        pointsSystem.pointsFastLap,
        pointsSystem.maxPosFastLap,
        pointsSystem.dnfFastLap,
        pointsSystem.pitlaneStartAllowed,
        pointsSystem.alwaysAssignFastLap,
        pointsSystem.pctCompletedFastLap,
        pointsSystem.pointsPole,
        pointsSystem.pointsLeadLap,
        pointsSystem.racePctCompleted,
        pointsSystem.pctTotalPoints,
        pointsSystem.active
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
