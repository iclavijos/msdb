import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRacetrack } from '../racetrack.model';
import { RacetrackService } from '../service/racetrack.service';
// import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';
// import { RacetrackLayoutDeleteDialogComponent } from 'app/entities/racetrack-layout/delete/racetrack-layout-delete-dialog.component';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/service/racetrack-layout.service';
import { EventEditionAndWinners } from 'app/entities/event-edition/event-edition.model';

import { DataUtils } from 'app/core/util/data-util.service';

import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'jhi-racetrack-detail',
  templateUrl: './racetrack-detail.component.html',
})
export class RacetrackDetailComponent implements OnInit, AfterViewInit {
  racetrack: IRacetrack | null = null;
  nextEventsEditions: EventEditionAndWinners[] = [];
  prevEventsEditions: EventEditionAndWinners[] = [];
  resultsLength = 0;
  links: any;

  nextEventsDisplayedColumns: string[] = ['date', 'eventName', 'layoutImage'];
  prevEventsDisplayedColumns: string[] = ['date', 'prevEventName', 'winners'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private racetrackService: RacetrackService,
    private racetrackLayoutService: RacetrackLayoutService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ racetrack }) => {
      this.racetrack = racetrack;
      this.racetrackService.findNextEvents(racetrack.id).subscribe((res: HttpResponse<EventEditionAndWinners[]>) => {
        this.nextEventsEditions = res.body!;
      });
    });
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => this.loadPreviousEvents(this.racetrack!.id!)),
        map((data: HttpResponse<EventEditionAndWinners[]>) => {
          this.resultsLength = Number(data.headers.get('X-Total-Count'));
          return data.body;
        }),
        catchError(() => observableOf([]))
      )
      .subscribe(data => (this.prevEventsEditions = data!));
  }

  previousState(): void {
    window.history.back();
  }

  concatDriverNames(drivers: any[]): string {
    return drivers.map(d => d.driverName as string).join(', ');
  }

  private loadPreviousEvents(id: number): Observable<HttpResponse<EventEditionAndWinners[]>> {
    const result = this.racetrackService.findPrevEvents(id, {
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize
    });

    return result;
  }
}
