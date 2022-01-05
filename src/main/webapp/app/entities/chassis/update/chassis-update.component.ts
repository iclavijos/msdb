import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChassis, Chassis } from '../chassis.model';
import { ChassisService } from '../service/chassis.service';

@Component({
  selector: 'jhi-chassis-update',
  templateUrl: './chassis-update.component.html',
})
export class ChassisUpdateComponent implements OnInit {
  isSaving = false;

  chassisSharedCollection: IChassis[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    manufacturer: [null, [Validators.required, Validators.maxLength(50)]],
    debutYear: [null, [Validators.required]],
    derivedFrom: [],
  });

  constructor(protected chassisService: ChassisService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.updateForm(chassis);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chassis = this.createFromForm();
    if (chassis.id !== undefined) {
      this.subscribeToSaveResponse(this.chassisService.update(chassis));
    } else {
      this.subscribeToSaveResponse(this.chassisService.create(chassis));
    }
  }

  trackChassisById(index: number, item: IChassis): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChassis>>): void {
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

  protected updateForm(chassis: IChassis): void {
    this.editForm.patchValue({
      id: chassis.id,
      name: chassis.name,
      manufacturer: chassis.manufacturer,
      debutYear: chassis.debutYear,
      derivedFrom: chassis.derivedFrom,
    });

    this.chassisSharedCollection = this.chassisService.addChassisToCollectionIfMissing(this.chassisSharedCollection, chassis.derivedFrom);
  }

  protected loadRelationshipsOptions(): void {
    this.chassisService
      .query()
      .pipe(map((res: HttpResponse<IChassis[]>) => res.body ?? []))
      .pipe(
        map((chassis: IChassis[]) => this.chassisService.addChassisToCollectionIfMissing(chassis, this.editForm.get('derivedFrom')!.value))
      )
      .subscribe((chassis: IChassis[]) => (this.chassisSharedCollection = chassis));
  }

  protected createFromForm(): IChassis {
    return {
      ...new Chassis(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      manufacturer: this.editForm.get(['manufacturer'])!.value,
      debutYear: this.editForm.get(['debutYear'])!.value,
      derivedFrom: this.editForm.get(['derivedFrom'])!.value,
    };
  }
}
