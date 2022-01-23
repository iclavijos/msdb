import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, finalize, map, tap, startWith, distinctUntilChanged } from 'rxjs/operators';

import { IChassis, Chassis } from '../chassis.model';
import { ChassisService } from '../service/chassis.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-chassis-update',
  templateUrl: './chassis-update.component.html',
})
export class ChassisUpdateComponent implements OnInit {
  isSaving = false;
  isLoading = false;

  options!: Observable<IChassis[]>;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    manufacturer: [null, [Validators.required, Validators.maxLength(50)]],
    debutYear: [null, [Validators.required]],
    derivedFrom: [],
    rebranded: [],
    image: [],
    imageContentType: [],
    imageUrl: []
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected chassisService: ChassisService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isSaving = false;

    this.options = this.editForm.get('derivedFrom')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // this.options = of([]);
      }),
      switchMap(value => {
        if (typeof value !== 'object' && value !== null) {
          return this.chassisService.query({
                 page: 0,
                 query: value,
                 size: 20,
                 sort: ['name,asc'],
               })
            .pipe(finalize(() => this.isLoading = false));
        } else {
          return [];
        }
      }),
      map(response => response.body as IChassis[])
    );

    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.updateForm(chassis);
    });
  }

  displayFn(chassis?: IChassis): string {
    return chassis ? `${chassis.manufacturer} ${chassis.name}` : '';
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

  switchRebranded(): void {
    this.editForm.patchValue({ rebranded: !this.editForm.get('rebranded')?.value });
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
      rebranded: chassis.rebranded,
      image: chassis.image,
      imageContentType: chassis.imageContentType,
      imageUrl: chassis.imageUrl
    });
  }

  protected createFromForm(): IChassis {
    return {
      ...new Chassis(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      manufacturer: this.editForm.get(['manufacturer'])!.value,
      debutYear: this.editForm.get(['debutYear'])!.value,
      derivedFrom: this.editForm.get(['derivedFrom'])!.value,
      rebranded: this.editForm.get(['rebranded'])!.value,
      image: this.editForm.get(['image'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      imageUrl: this.editForm.get(['imageUrl'])!.value
    };
  }
}
