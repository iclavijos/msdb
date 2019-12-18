import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IChassis, Chassis } from 'app/shared/model/chassis.model';
import { ChassisService } from './chassis.service';

@Component({
  selector: 'jhi-chassis-update',
  templateUrl: './chassis-update.component.html'
})
export class ChassisUpdateComponent implements OnInit {
  isSaving: boolean;

  chassisCollection: IChassis[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    manufacturer: [null, [Validators.required, Validators.maxLength(50)]],
    debutYear: [null, [Validators.required]],
    derivedFrom: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected chassisService: ChassisService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.updateForm(chassis);
    });
    this.chassisService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IChassis[]>) => mayBeOk.ok),
        map((response: HttpResponse<IChassis[]>) => response.body)
      )
      .subscribe((res: IChassis[]) => (this.chassisCollection = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(chassis: IChassis) {
    this.editForm.patchValue({
      id: chassis.id,
      name: chassis.name,
      manufacturer: chassis.manufacturer,
      debutYear: chassis.debutYear,
      derivedFrom: chassis.derivedFrom
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const chassis = this.createFromForm();
    if (chassis.id !== undefined) {
      this.subscribeToSaveResponse(this.chassisService.update(chassis));
    } else {
      this.subscribeToSaveResponse(this.chassisService.create(chassis));
    }
  }

  private createFromForm(): IChassis {
    return {
      ...new Chassis(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      manufacturer: this.editForm.get(['manufacturer']).value,
      debutYear: this.editForm.get(['debutYear']).value,
      derivedFrom: this.editForm.get(['derivedFrom']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChassis>>) {
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

  trackChassisById(index: number, item: IChassis) {
    return item.id;
  }
}
