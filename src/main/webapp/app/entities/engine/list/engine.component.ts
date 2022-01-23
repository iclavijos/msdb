import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IEngine, Engine } from '../engine.model';
import { EngineService } from '../service/engine.service';
import { EngineDeleteDialogComponent } from '../delete/engine-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'jhi-engine',
  templateUrl: './engine.component.html',
})
export class EngineComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'surname';
  ascending = true;
  reloadData = true;

  dataSource = new MatTableDataSource<IEngine>([]);
  displayedColumns: string[] = ['name', 'manufacturer', 'capacity', 'architecture', 'debutYear', 'petrolEngine', 'dieselEngine', 'electricEngine', 'otherEngine', 'buttons'];

  enginesSearchTextChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sorter!: MatSort;

  constructor(
    protected engineService: EngineService,
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
    this.currentSearch = this.sessionStorageService.retrieve('engineSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('engineSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('engineSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('engineSearchPredicate') ?? 'name';
    this.ascending = this.sessionStorageService.retrieve('engineSearchAscending') ?? true;

    this.loadPage();

    this.enginesSearchTextChanged
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
    this.sessionStorageService.store('engineSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'name';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.enginesSearchTextChanged.next();
      }
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('engineSearchPage');
    this.sessionStorageService.clear('engineSearchItems');
    this.sessionStorageService.clear('engineSearchPredicate');
    this.sessionStorageService.clear('engineSearchAscending');
    this.search('');
  }

  trackId(index: number, item: IEngine): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: MouseEvent, engine: IEngine): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(EngineDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.engine = engine;
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
    this.sessionStorageService.store('engineSearchPage', this.page);
    this.sessionStorageService.store('engineSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('engineSearchPredicate', this.predicate);
    this.sessionStorageService.store('engineSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('engineSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.engineService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IEngine[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IEngine[]));
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

  private instantiateResponseObjects(data: IEngine[]): IEngine[] {
    const objects: IEngine[] = [];
    data.forEach(engine => objects.push(
      new Engine(
        engine.id,
        engine.name,
        engine.manufacturer,
        engine.capacity,
        engine.architecture,
        engine.debutYear,
        engine.petrolEngine,
        engine.dieselEngine,
        engine.electricEngine,
        engine.otherEngine,
        engine.rebranded,
        engine.turbo,
        engine.imageContentType,
        engine.image,
        engine.imageUrl,
        engine.derivedFrom,
        engine.evolutions
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
