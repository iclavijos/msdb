import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';
import { RacetrackLayoutService } from '../service/racetrack-layout.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { IRacetrack, Racetrack } from 'app/entities/racetrack/racetrack.model';

@Component({
  selector: 'jhi-racetrack-layout-update',
  templateUrl: './racetrack-layout-update.component.html',
})
export class RacetrackLayoutUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    length: [null, [Validators.required, Validators.min(0)]],
    yearFirstUse: [null, [Validators.required, Validators.min(1900), Validators.max(2050)]],
    layoutImage: [],
    layoutImageContentType: [],
    layoutImageUrl: [],
    active: []
  });

  racetrackLayout!: IRacetrackLayout;
  private racetrack: IRacetrack = new Racetrack();

  constructor(
    protected eventManager: EventManager,
    protected racetrackLayoutService: RacetrackLayoutService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ racetrackLayout }) => {
      this.updateForm(racetrackLayout);
      this.racetrackLayout = racetrackLayout;
    });
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

  switchActive(): void {
    this.editForm.patchValue({
      active: !this.editForm.get(['active'])?.value
    });
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

  private updateForm(racetrackLayout: IRacetrackLayout): void {
    this.editForm.patchValue({
      id: racetrackLayout.id,
      name: racetrackLayout.name,
      length: racetrackLayout.length,
      yearFirstUse: racetrackLayout.yearFirstUse,
      layoutImage: racetrackLayout.layoutImage,
      layoutImageContentType: racetrackLayout.layoutImageContentType,
      layoutImageUrl: racetrackLayout.layoutImageUrl,
      active: racetrackLayout.active
    });
  }

  private createFromForm(): IRacetrackLayout {
    const racetrackLayout = new RacetrackLayout();

    racetrackLayout.id = this.editForm.get(['id'])!.value;
    racetrackLayout.name = this.editForm.get(['name'])!.value;
    racetrackLayout.length = this.editForm.get(['length'])!.value;
    racetrackLayout.yearFirstUse = this.editForm.get(['yearFirstUse'])!.value;
    racetrackLayout.layoutImageContentType = this.editForm.get(['layoutImageContentType'])!.value;
    racetrackLayout.layoutImage = this.editForm.get(['layoutImage'])!.value;
    racetrackLayout.layoutImageUrl = this.editForm.get(['layoutImageUrl'])!.value;
    racetrackLayout.active = this.editForm.get(['active'])!.value;
    racetrackLayout.racetrack = this.racetrackLayout.racetrack;

    return racetrackLayout;
  }
}
