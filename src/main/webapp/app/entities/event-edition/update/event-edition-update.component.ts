import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, map, filter, finalize } from 'rxjs/operators';

import { IEventEdition, EventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IRacetrackLayout, getFullName } from 'app/entities/racetrack-layout/racetrack-layout.model';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/service/racetrack-layout.service';
import { IEvent, isRally, isRaid, instantiateEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-event-edition-update',
  templateUrl: './event-edition-update.component.html',
})
export class EventEditionUpdateComponent implements OnInit {
  isSaving = false;

  event?: IEvent;
  categories: ICategory[] = [];
  layoutOptions: Observable<IRacetrackLayout[] | null> = new Observable();
  eventOptions: Observable<IEvent[] | null> = new Observable();

  editForm = this.fb.group({
    id: [],
    editionYear: [null, [Validators.required]],
    shortEventName: [null, [Validators.required, Validators.maxLength(40)]],
    longEventName: [null, [Validators.required, Validators.maxLength(100)]],
    eventDate: [null, [Validators.required]],
    allowedCategories: [],
    trackLayout: [],
    event: [],
    poster: [],
    posterContentType: [],
    posterUrl: [],
    status: ['ONGOING', []],
    multidriver: [false, []],
    location: [],
    categoryFilterText: []
  });

  constructor(
    protected eventEditionService: EventEditionService,
    protected categoryService: CategoryService,
    protected racetrackLayoutService: RacetrackLayoutService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected eventManager: EventManager,
    protected dataUtils: DataUtils,
    protected elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.updateForm(eventEdition);
    });

    this.displayFnLayouts = this.displayFnLayouts.bind(this);
    this.displayFnEvents = this.displayFnEvents.bind(this);
    this.isSaving = false;

    this.layoutOptions = this.editForm.get('trackLayout')!.valueChanges.pipe(
      debounceTime(300),
      filter(value => value.length >= 3),
      filter(value => typeof value === 'string'),
      switchMap(value => this.racetrackLayoutService.search({ query: value })),
      map(response => response.body)
    );

    this.eventOptions = this.editForm.get('event')!.valueChanges.pipe(
      debounceTime(300),
      filter(value => typeof value === 'string'),
      switchMap(value => this.eventService.search({ query: value })),
      map(response => response.body)
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
        (res: ICategory[] | null) => (this.categories = res?.sort((e1, e2) => (e1.name! > e2.name! ? 1 : -1)) ?? [])
      );
  }

  displayFnLayouts(trackLayout?: IRacetrackLayout): string {
    if (trackLayout?.racetrack) {
      return `${trackLayout.racetrack.name} - ${trackLayout.name}`;
    } else {
      return trackLayout ? getFullName(trackLayout) : '';
    }
  }

  displayFnEvents(event?: IEvent): string {
    return event ? event.name! : '';
  }

  isRally(): boolean {
    return isRally(this.event!);
  }

  isRaid(): boolean {
    return isRaid(this.event!);
  }

  getLayoutFullName(layout: IRacetrackLayout): string {
    return getFullName(layout);
  }

  getEventName(event: IEvent): string {
    return event.name!;
  }

  save(): void {
    this.isSaving = true;
    const eventEdition = this.createFromForm();
    if (eventEdition.id !== undefined) {
      this.subscribeToSaveResponse(this.eventEditionService.update(eventEdition));
    } else {
      this.subscribeToSaveResponse(this.eventEditionService.create(eventEdition));
    }
  }

  compareCategories(c1: ICategory, c2: ICategory): boolean {
    return c1.name === c2.name;
  }

  previousState(): void {
    window.history.back();
  }

  clearCategoriesFilter(): void {
    this.editForm.patchValue({
      ['categoryFilterText']: null,
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEdition>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(eventEdition: IEventEdition): void {
    this.event = instantiateEvent(eventEdition.event!);
    this.editForm.patchValue({
      id: eventEdition.id,
      editionYear: eventEdition.editionYear,
      shortEventName: eventEdition.shortEventName,
      longEventName: eventEdition.longEventName,
      eventDate: eventEdition.eventDate
        ? eventEdition.trackLayout
          ? eventEdition.eventDate.setZone(eventEdition.trackLayout.racetrack!.timeZone)
          : null
        : null,
      allowedCategories: eventEdition.allowedCategories,
      trackLayout: eventEdition.trackLayout,
      event: eventEdition.event,
      poster: eventEdition.poster,
      posterContentType: eventEdition.posterContentType,
      posterUrl: eventEdition.posterUrl,
      status: eventEdition.status ?? 'ONGOING',
      multidriver: eventEdition.multidriver,
      location: eventEdition.location
    });
    if (this.event.rally || this.event.raid) {
      this.editForm.get('multidriver')!.disable();
      this.editForm.get('multidriver')!.setValue(true);
    }
  }

  protected createFromForm(): IEventEdition {
    const eventEdition = new EventEdition();
    eventEdition.id = this.editForm.get(['id'])!.value;
    eventEdition.editionYear = this.editForm.get(['editionYear'])!.value;
    eventEdition.shortEventName = this.editForm.get(['shortEventName'])!.value;
    eventEdition.longEventName = this.editForm.get(['longEventName'])!.value;
    eventEdition.eventDate = this.editForm.get(['eventDate'])!.value;
    eventEdition.allowedCategories = this.editForm.get(['allowedCategories'])!.value;
    eventEdition.trackLayout = this.editForm.get(['trackLayout'])!.value;
    eventEdition.event = this.editForm.get(['event'])!.value;
    eventEdition.poster = this.editForm.get(['poster'])!.value;
    eventEdition.posterContentType = this.editForm.get(['posterContentType'])!.value;
    eventEdition.posterUrl = this.editForm.get(['posterUrl'])!.value;
    eventEdition.status = this.editForm.get(['status'])!.value ? this.editForm.get(['status'])!.value : 'ONGOING';
    eventEdition.multidriver = this.editForm.get(['multidriver'])!.value;
    eventEdition.location = this.editForm.get(['location'])!.value;

    return eventEdition;
  }
}
