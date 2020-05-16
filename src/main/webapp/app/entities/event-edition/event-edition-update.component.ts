// import {
//   MAT_MOMENT_DATE_FORMATS,
//   MomentDateAdapter,
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
// } from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map, filter } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IEventEdition, EventEdition } from 'app/shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/racetrack-layout.service';
import { IEvent } from 'app/shared/model/event.model';
import { EventService } from 'app/entities/event/event.service';

import * as moment from 'moment';

@Component({
  selector: 'jhi-event-edition-update',
  templateUrl: './event-edition-update.component.html',
  styleUrls: ['event-edition.scss']
  //   providers: [
  //     {
  //       provide: DateAdapter,
  //       useClass: MomentDateAdapter,
  //       deps: [ MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS ]
  //     },
  //     { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  //   ]
})
export class EventEditionUpdateComponent implements OnInit {
  isSaving: boolean;

  categories: ICategory[];
  layoutOptions: Observable<IRacetrackLayout[]>;
  eventOptions: Observable<IEvent[]>;

  editForm = this.fb.group({
    id: [],
    editionYear: [null, [Validators.required]],
    shortEventName: [null, [Validators.required, Validators.maxLength(40)]],
    longEventName: [null, [Validators.required, Validators.maxLength(100)]],
    eventDate: [null, [Validators.required]],
    allowedCategories: [],
    trackLayout: [null, [Validators.required]],
    event: [],
    poster: [],
    posterContentType: [],
    posterUrl: [],
    status: ['O', []],
    multidriver: [false, []]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected eventEditionService: EventEditionService,
    protected categoryService: CategoryService,
    protected racetrackLayoutService: RacetrackLayoutService,
    protected eventService: EventService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) //     private dateAdapter: DateAdapter<any>
  {}

  ngOnInit() {
    this.displayFnLayouts = this.displayFnLayouts.bind(this);
    this.displayFnEvents = this.displayFnEvents.bind(this);
    this.isSaving = false;

    this.layoutOptions = this.editForm.get('trackLayout').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.racetrackLayoutService.search(value);
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.eventOptions = this.editForm.get('event').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.eventService.search(value);
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.updateForm(eventEdition);
    });
    this.categoryService
      .query({
        page: 0,
        query: '',
        size: 100
      })
      .pipe(
        filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICategory[]>) => response.body)
      )
      .subscribe(
        (res: ICategory[]) => (this.categories = res.sort((e1, e2) => (e1.name > e2.name ? 1 : -1))),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  displayFnLayouts(trackLayout?: any): string | undefined {
    if (trackLayout.racetrack) {
      return trackLayout.racetrack.name + ' - ' + trackLayout.name;
    } else {
      return trackLayout ? trackLayout.fullName : undefined;
    }
  }

  displayFnEvents(event?: any): string | undefined {
    return event ? event.name : undefined;
  }

  //   ngAfterViewInit() {
  //     this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
  //         this.dateAdapter.setLocale(langChangeEvent.lang);
  //     });
  //   }

  updateForm(eventEdition: IEventEdition) {
    eventEdition.eventDate[1]--;
    this.editForm.patchValue({
      id: eventEdition.id,
      editionYear: eventEdition.editionYear,
      shortEventName: eventEdition.shortEventName,
      longEventName: eventEdition.longEventName,
      eventDate: moment(eventEdition.eventDate).tz(eventEdition.trackLayout.racetrack.timeZone),
      allowedCategories: eventEdition.allowedCategories,
      trackLayout: eventEdition.trackLayout,
      event: eventEdition.event,
      poster: eventEdition.poster,
      posterContentType: eventEdition.posterContentType,
      posterUrl: eventEdition.posterUrl,
      status: eventEdition.status,
      multidriver: eventEdition.multidriver
    });
  }

  compareCategories(c1: ICategory, c2: ICategory) {
    return c1 && c2 && c1.name === c2.name;
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const eventEdition = this.createFromForm();
    if (eventEdition.id !== undefined) {
      this.subscribeToSaveResponse(this.eventEditionService.update(eventEdition));
    } else {
      this.subscribeToSaveResponse(this.eventEditionService.create(eventEdition));
    }
  }

  private createFromForm(): IEventEdition {
    return {
      ...new EventEdition(),
      id: this.editForm.get(['id']).value,
      editionYear: this.editForm.get(['editionYear']).value,
      shortEventName: this.editForm.get(['shortEventName']).value,
      longEventName: this.editForm.get(['longEventName']).value,
      eventDate: this.editForm.get(['eventDate']).value,
      allowedCategories: this.editForm.get(['allowedCategories']).value,
      trackLayout: this.editForm.get(['trackLayout']).value,
      event: this.editForm.get(['event']).value,
      poster: this.editForm.get(['poster']).value,
      posterContentType: this.editForm.get(['posterContentType']).value,
      posterUrl: this.editForm.get(['posterUrl']).value,
      status: this.editForm.get(['status']).value,
      multidriver: this.editForm.get(['multidriver']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEdition>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackCategoryById(index: number, item: ICategory) {
    return item.id;
  }

  trackRacetrackLayoutById(index: number, item: IRacetrackLayout) {
    return item.id;
  }

  trackEventById(index: number, item: IEvent) {
    return item.id;
  }
}
