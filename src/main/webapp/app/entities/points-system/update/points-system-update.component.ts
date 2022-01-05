import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPointsSystem, PointsSystem } from '../points-system.model';
import { PointsSystemService } from '../service/points-system.service';

@Component({
  selector: 'jhi-points-system-update',
  templateUrl: './points-system-update.component.html',
})
export class PointsSystemUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [null, [Validators.required, Validators.maxLength(100)]],
    points: [],
    pointsMostLeadLaps: [],
    pointsFastLap: [],
    pointsPole: [],
    pointsLeadLap: [],
  });

  constructor(protected pointsSystemService: PointsSystemService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pointsSystem }) => {
      this.updateForm(pointsSystem);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pointsSystem = this.createFromForm();
    if (pointsSystem.id !== undefined) {
      this.subscribeToSaveResponse(this.pointsSystemService.update(pointsSystem));
    } else {
      this.subscribeToSaveResponse(this.pointsSystemService.create(pointsSystem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPointsSystem>>): void {
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

  protected updateForm(pointsSystem: IPointsSystem): void {
    this.editForm.patchValue({
      id: pointsSystem.id,
      name: pointsSystem.name,
      description: pointsSystem.description,
      points: pointsSystem.points,
      pointsMostLeadLaps: pointsSystem.pointsMostLeadLaps,
      pointsFastLap: pointsSystem.pointsFastLap,
      pointsPole: pointsSystem.pointsPole,
      pointsLeadLap: pointsSystem.pointsLeadLap,
    });
  }

  protected createFromForm(): IPointsSystem {
    return {
      ...new PointsSystem(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      points: this.editForm.get(['points'])!.value,
      pointsMostLeadLaps: this.editForm.get(['pointsMostLeadLaps'])!.value,
      pointsFastLap: this.editForm.get(['pointsFastLap'])!.value,
      pointsPole: this.editForm.get(['pointsPole'])!.value,
      pointsLeadLap: this.editForm.get(['pointsLeadLap'])!.value,
    };
  }
}
