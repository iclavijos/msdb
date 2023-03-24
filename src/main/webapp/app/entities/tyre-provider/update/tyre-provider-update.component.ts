import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITyreProvider, TyreProvider } from '../tyre-provider.model';
import { TyreProviderService } from '../service/tyre-provider.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-tyre-provider-update',
  templateUrl: './tyre-provider-update.component.html',
})
export class TyreProviderUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    logo: [],
    logoContentType: [],
    logoUrl: [],
    letterColor: [null, [Validators.required]],
    backgroundColor: [null, [Validators.required]],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected tyreProviderService: TyreProviderService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tyreProvider }) => {
      this.updateForm(tyreProvider);
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
    const tyreProvider = this.createFromForm();
    if (tyreProvider.id !== undefined) {
      this.subscribeToSaveResponse(this.tyreProviderService.update(tyreProvider));
    } else {
      this.subscribeToSaveResponse(this.tyreProviderService.create(tyreProvider));
    }
  }

  resetLogo(): void {
    this.editForm.patchValue({ logoUrl: null, logo: null });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITyreProvider>>): void {
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

  protected updateForm(tyreProvider: ITyreProvider): void {
    this.editForm.patchValue({
      id: tyreProvider.id,
      name: tyreProvider.name,
      logo: tyreProvider.logo,
      logoContentType: tyreProvider.logoContentType,
      logoUrl: tyreProvider.logoUrl,
      letterColor: tyreProvider.letterColor,
      backgroundColor: tyreProvider.backgroundColor,
    });
  }

  protected createFromForm(): ITyreProvider {
    return {
      ...new TyreProvider(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      logoUrl: this.editForm.get(['logoUrl'])!.value,
      letterColor: this.editForm.get(['letterColor'])!.value,
      backgroundColor: this.editForm.get(['backgroundColor'])!.value,
    };
  }
}
