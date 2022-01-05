import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';
import { RacetrackLayoutService } from '../service/racetrack-layout.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IRacetrack } from 'app/entities/racetrack/racetrack.model';
import { RacetrackService } from 'app/entities/racetrack/service/racetrack.service';

@Component({
  selector: 'jhi-racetrack-layout-update',
  templateUrl: './racetrack-layout-update.component.html',
})
export class RacetrackLayoutUpdateComponent implements OnInit {
  isSaving = false;

  racetracksSharedCollection: IRacetrack[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    length: [null, [Validators.required]],
    yearFirstUse: [null, [Validators.required]],
    layoutImage: [],
    layoutImageContentType: [],
    active: [],
    racetrack: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected racetrackLayoutService: RacetrackLayoutService,
    protected racetrackService: RacetrackService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ racetrackLayout }) => {
      this.updateForm(racetrackLayout);

      this.loadRelationshipsOptions();
    });
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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const racetrackLayout = this.createFromForm();
    if (racetrackLayout.id !== undefined) {
      this.subscribeToSaveResponse(this.racetrackLayoutService.update(racetrackLayout));
    } else {
      this.subscribeToSaveResponse(this.racetrackLayoutService.create(racetrackLayout));
    }
  }

  trackRacetrackById(index: number, item: IRacetrack): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRacetrackLayout>>): void {
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

  protected updateForm(racetrackLayout: IRacetrackLayout): void {
    this.editForm.patchValue({
      id: racetrackLayout.id,
      name: racetrackLayout.name,
      length: racetrackLayout.length,
      yearFirstUse: racetrackLayout.yearFirstUse,
      layoutImage: racetrackLayout.layoutImage,
      layoutImageContentType: racetrackLayout.layoutImageContentType,
      active: racetrackLayout.active,
      racetrack: racetrackLayout.racetrack,
    });

    this.racetracksSharedCollection = this.racetrackService.addRacetrackToCollectionIfMissing(
      this.racetracksSharedCollection,
      racetrackLayout.racetrack
    );
  }

  protected loadRelationshipsOptions(): void {
    this.racetrackService
      .query()
      .pipe(map((res: HttpResponse<IRacetrack[]>) => res.body ?? []))
      .pipe(
        map((racetracks: IRacetrack[]) =>
          this.racetrackService.addRacetrackToCollectionIfMissing(racetracks, this.editForm.get('racetrack')!.value)
        )
      )
      .subscribe((racetracks: IRacetrack[]) => (this.racetracksSharedCollection = racetracks));
  }

  protected createFromForm(): IRacetrackLayout {
    return {
      ...new RacetrackLayout(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      length: this.editForm.get(['length'])!.value,
      yearFirstUse: this.editForm.get(['yearFirstUse'])!.value,
      layoutImageContentType: this.editForm.get(['layoutImageContentType'])!.value,
      layoutImage: this.editForm.get(['layoutImage'])!.value,
      active: this.editForm.get(['active'])!.value,
      racetrack: this.editForm.get(['racetrack'])!.value,
    };
  }
}
