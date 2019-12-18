import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPointsSystem, PointsSystem } from 'app/shared/model/points-system.model';
import { PointsSystemService } from './points-system.service';

@Component({
  selector: 'jhi-points-system-update',
  templateUrl: './points-system-update.component.html'
})
export class PointsSystemUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [null, [Validators.required, Validators.maxLength(100)]],
    points: [],
    pointsMostLeadLaps: [],
    pointsFastLap: [],
    pointsPole: [],
    pointsLeadLap: []
  });

  constructor(protected pointsSystemService: PointsSystemService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ pointsSystem }) => {
      this.updateForm(pointsSystem);
    });
  }

  updateForm(pointsSystem: IPointsSystem) {
    this.editForm.patchValue({
      id: pointsSystem.id,
      name: pointsSystem.name,
      description: pointsSystem.description,
      points: pointsSystem.points,
      pointsMostLeadLaps: pointsSystem.pointsMostLeadLaps,
      pointsFastLap: pointsSystem.pointsFastLap,
      pointsPole: pointsSystem.pointsPole,
      pointsLeadLap: pointsSystem.pointsLeadLap
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const pointsSystem = this.createFromForm();
    if (pointsSystem.id !== undefined) {
      this.subscribeToSaveResponse(this.pointsSystemService.update(pointsSystem));
    } else {
      this.subscribeToSaveResponse(this.pointsSystemService.create(pointsSystem));
    }
  }

  private createFromForm(): IPointsSystem {
    return {
      ...new PointsSystem(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value,
      points: this.editForm.get(['points']).value,
      pointsMostLeadLaps: this.editForm.get(['pointsMostLeadLaps']).value,
      pointsFastLap: this.editForm.get(['pointsFastLap']).value,
      pointsPole: this.editForm.get(['pointsPole']).value,
      pointsLeadLap: this.editForm.get(['pointsLeadLap']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPointsSystem>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
