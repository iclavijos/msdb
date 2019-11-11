import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IEventEdition, EventEdition } from 'app/shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/racetrack-layout.service';
import { IEvent } from 'app/shared/model/event.model';
import { EventService } from 'app/entities/event/event.service';

@Component({
  selector: 'jhi-event-edition-update',
  templateUrl: './event-edition-update.component.html'
})
export class EventEditionUpdateComponent implements OnInit {
  isSaving: boolean;

  categories: ICategory[];

  racetracklayouts: IRacetrackLayout[];

  events: IEvent[];
  eventDateDp: any;

  editForm = this.fb.group({
    id: [],
    editionYear: [null, [Validators.required]],
    shortEventName: [null, [Validators.required, Validators.maxLength(40)]],
    longEventName: [null, [Validators.required, Validators.maxLength(100)]],
    eventDate: [null, [Validators.required]],
    allowedCategories: [],
    trackLayout: [],
    event: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected eventEditionService: EventEditionService,
    protected categoryService: CategoryService,
    protected racetrackLayoutService: RacetrackLayoutService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.updateForm(eventEdition);
    });
    this.categoryService
      .query()
      .subscribe((res: HttpResponse<ICategory[]>) => (this.categories = res.body), (res: HttpErrorResponse) => this.onError(res.message));
    this.racetrackLayoutService
      .query()
      .subscribe(
        (res: HttpResponse<IRacetrackLayout[]>) => (this.racetracklayouts = res.body),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.eventService
      .query()
      .subscribe((res: HttpResponse<IEvent[]>) => (this.events = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(eventEdition: IEventEdition) {
    this.editForm.patchValue({
      id: eventEdition.id,
      editionYear: eventEdition.editionYear,
      shortEventName: eventEdition.shortEventName,
      longEventName: eventEdition.longEventName,
      eventDate: eventEdition.eventDate,
      allowedCategories: eventEdition.allowedCategories,
      trackLayout: eventEdition.trackLayout,
      event: eventEdition.event
    });
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
      event: this.editForm.get(['event']).value
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
