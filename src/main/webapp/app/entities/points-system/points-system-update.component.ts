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
    description: [null, [Validators.maxLength(100)]],
    points: [],
    pointsMostLeadLaps: [null, [Validators.min(0), Validators.max(10)]],
    pointsFastLap: [null, [Validators.min(0), Validators.max(10)]],
    dnfFastLap: [],
    pitlaneStartAllowed: [],
    pctCompletedFastLap: [null, [Validators.min(0), Validators.max(100)]],
    pointsPole: [null, [Validators.min(0), Validators.max(10)]],
    pointsLeadLap: [null, [Validators.min(0), Validators.max(10)]],
    racePctCompleted: [null, [Validators.min(0), Validators.max(100)]],
    pctTotalPoints: [null, [Validators.min(0), Validators.max(100)]],
    maxPosFastLap: [null, [Validators.min(0), Validators.max(100)]],
    active: []
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
      dnfFastLap: pointsSystem.dnfFastLap,
      pitlaneStartAllowed: pointsSystem.pitlaneStartAllowed,
      pctCompletedFastLap: pointsSystem.pctCompletedFastLap,
      pointsPole: pointsSystem.pointsPole,
      pointsLeadLap: pointsSystem.pointsLeadLap,
      racePctCompleted: pointsSystem.racePctCompleted,
      pctTotalPoints: pointsSystem.pctTotalPoints,
      maxPosFastLap: pointsSystem.maxPosFastLap,
      active: pointsSystem.active
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
      dnfFastLap: this.editForm.get(['dnfFastLap']).value,
      pitlaneStartAllowed: this.editForm.get(['pitlaneStartAllowed']).value,
      pctCompletedFastLap: this.editForm.get(['pctCompletedFastLap']).value,
      pointsPole: this.editForm.get(['pointsPole']).value,
      pointsLeadLap: this.editForm.get(['pointsLeadLap']).value,
      racePctCompleted: this.editForm.get(['racePctCompleted']).value,
      pctTotalPoints: this.editForm.get(['pctTotalPoints']).value,
      maxPosFastLap: this.editForm.get(['maxPosFastLap']).value,
      active: this.editForm.get(['active']).value
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

  switchActive() {
    this.editForm.patchValue({ active: !this.editForm.get('active').value });
  }

  switchPitlaneStart() {
    this.editForm.patchValue({ pitlaneStartAllowed: !this.editForm.get('pitlaneStartAllowed').value });
  }
}
