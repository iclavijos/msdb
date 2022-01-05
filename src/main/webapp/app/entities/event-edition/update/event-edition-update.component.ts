import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEventEdition, EventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/service/racetrack-layout.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

@Component({
  selector: 'jhi-event-edition-update',
  templateUrl: './event-edition-update.component.html',
})
export class EventEditionUpdateComponent implements OnInit {
  isSaving = false;

  categoriesSharedCollection: ICategory[] = [];
  racetrackLayoutsSharedCollection: IRacetrackLayout[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm = this.fb.group({
    id: [],
    editionYear: [null, [Validators.required]],
    shortEventName: [null, [Validators.required, Validators.maxLength(40)]],
    longEventName: [null, [Validators.required, Validators.maxLength(100)]],
    eventDate: [null, [Validators.required]],
    allowedCategories: [],
    trackLayout: [],
    event: [],
  });

  constructor(
    protected eventEditionService: EventEditionService,
    protected categoryService: CategoryService,
    protected racetrackLayoutService: RacetrackLayoutService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.updateForm(eventEdition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
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

  trackCategoryById(index: number, item: ICategory): number {
    return item.id!;
  }

  trackRacetrackLayoutById(index: number, item: IRacetrackLayout): number {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
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
      eventDate: eventEdition.eventDate,
      allowedCategories: eventEdition.allowedCategories,
      trackLayout: eventEdition.trackLayout,
      event: eventEdition.event,
    });

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      eventEdition.allowedCategories
    );
    this.racetrackLayoutsSharedCollection = this.racetrackLayoutService.addRacetrackLayoutToCollectionIfMissing(
      this.racetrackLayoutsSharedCollection,
      eventEdition.trackLayout
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, eventEdition.event);
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('allowedCategories')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.racetrackLayoutService
      .query()
      .pipe(map((res: HttpResponse<IRacetrackLayout[]>) => res.body ?? []))
      .pipe(
        map((racetrackLayouts: IRacetrackLayout[]) =>
          this.racetrackLayoutService.addRacetrackLayoutToCollectionIfMissing(racetrackLayouts, this.editForm.get('trackLayout')!.value)
        )
      )
      .subscribe((racetrackLayouts: IRacetrackLayout[]) => (this.racetrackLayoutsSharedCollection = racetrackLayouts));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));
  }

  protected createFromForm(): IEventEdition {
    return {
      ...new EventEdition(),
      id: this.editForm.get(['id'])!.value,
      editionYear: this.editForm.get(['editionYear'])!.value,
      shortEventName: this.editForm.get(['shortEventName'])!.value,
      longEventName: this.editForm.get(['longEventName'])!.value,
      eventDate: this.editForm.get(['eventDate'])!.value,
      allowedCategories: this.editForm.get(['allowedCategories'])!.value,
      trackLayout: this.editForm.get(['trackLayout'])!.value,
      event: this.editForm.get(['event'])!.value,
    };
  }
}
