import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map, filter, finalize } from 'rxjs/operators';

import { IEventEdition, EventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/service/racetrack-layout.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

import * as dayjs from 'dayjs';

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
    location: []
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
      switchMap(value => {
        if (typeof value === 'string') {
          return this.racetrackLayoutService.query(value);
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.eventOptions = this.editForm.get('event')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.eventService.query(value);
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
        (res: ICategory[] | null) => (this.categories = res?.sort((e1, e2) => (e1.name! > e2.name! ? 1 : -1)) ?? [])
      );
  }

  displayFnLayouts(trackLayout?: any): string {
    if (trackLayout?.racetrack) {
      return `${trackLayout.racetrack.name as string} - ${trackLayout.name as string}`;
    } else {
      return trackLayout ? trackLayout.getFullName() as string : '';
    }
  }

  displayFnEvents(event?: any): string {
    return event ? event.name as string : '';
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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('motorsportsDatabaseApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
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
    this.editForm.patchValue({
      id: eventEdition.id,
      editionYear: eventEdition.editionYear,
      shortEventName: eventEdition.shortEventName,
      longEventName: eventEdition.longEventName,
      eventDate: eventEdition.eventDate
        ? eventEdition.trackLayout
          ? dayjs(eventEdition.eventDate).tz(eventEdition.trackLayout.racetrack!.timeZone)
          : null
        : null,
      allowedCategories: eventEdition.allowedCategories,
      trackLayout: eventEdition.trackLayout,
      event: this.event ? this.event : eventEdition.event,
      poster: eventEdition.poster,
      posterContentType: eventEdition.posterContentType,
      posterUrl: eventEdition.posterUrl,
      status: eventEdition.status,
      multidriver: eventEdition.multidriver,
      location: eventEdition.location
    });
    if (this.event!.rally || this.event!.raid) {
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
