import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IDriverPointsDetails, DriverPointsDetails } from 'app/shared/model/driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
  selector: 'jhi-driver-points-details-update',
  templateUrl: './driver-points-details-update.component.html'
})
export class DriverPointsDetailsUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: []
  });

  constructor(
    protected driverPointsDetailsService: DriverPointsDetailsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ driverPointsDetails }) => {
      this.updateForm(driverPointsDetails);
    });
  }

  updateForm(driverPointsDetails: IDriverPointsDetails) {
    this.editForm.patchValue({
      id: driverPointsDetails.id
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const driverPointsDetails = this.createFromForm();
    if (driverPointsDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.driverPointsDetailsService.update(driverPointsDetails));
    } else {
      this.subscribeToSaveResponse(this.driverPointsDetailsService.create(driverPointsDetails));
    }
  }

  private createFromForm(): IDriverPointsDetails {
    return {
      ...new DriverPointsDetails(),
      id: this.editForm.get(['id']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDriverPointsDetails>>) {
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
