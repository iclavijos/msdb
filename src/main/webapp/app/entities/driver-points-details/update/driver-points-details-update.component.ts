import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDriverPointsDetails, DriverPointsDetails } from '../driver-points-details.model';
import { DriverPointsDetailsService } from '../service/driver-points-details.service';

@Component({
  selector: 'jhi-driver-points-details-update',
  templateUrl: './driver-points-details-update.component.html',
})
export class DriverPointsDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(
    protected driverPointsDetailsService: DriverPointsDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ driverPointsDetails }) => {
      this.updateForm(driverPointsDetails);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const driverPointsDetails = this.createFromForm();
    if (driverPointsDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.driverPointsDetailsService.update(driverPointsDetails));
    } else {
      this.subscribeToSaveResponse(this.driverPointsDetailsService.create(driverPointsDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDriverPointsDetails>>): void {
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

  protected updateForm(driverPointsDetails: IDriverPointsDetails): void {
    this.editForm.patchValue({
      id: driverPointsDetails.id,
    });
  }

  protected createFromForm(): IDriverPointsDetails {
    return {
      ...new DriverPointsDetails(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}
