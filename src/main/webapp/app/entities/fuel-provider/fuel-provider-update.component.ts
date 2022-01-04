import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IFuelProvider, FuelProvider } from '../../shared/model/fuel-provider.model';
import { FuelProviderService } from './fuel-provider.service';

@Component({
  selector: 'jhi-fuel-provider-update',
  templateUrl: './fuel-provider-update.component.html'
})
export class FuelProviderUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    logo: [],
    logoContentType: [],
    logoUrl: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected fuelProviderService: FuelProviderService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ fuelProvider }) => {
      this.updateForm(fuelProvider);
    });
  }

  updateForm(fuelProvider: IFuelProvider) {
    this.editForm.patchValue({
      id: fuelProvider.id,
      name: fuelProvider.name,
      logo: fuelProvider.logo,
      logoContentType: fuelProvider.logoContentType,
      logoUrl: fuelProvider.logoUrl
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event?.target?.files?.[0]) {
        const file: File = event.target.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event as string}`);
      }
    }).then(
      // eslint-disable-next-line no-console
      () => { console.log('Blob added'); }, // success
      this.onError
    );
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const fuelProvider = this.createFromForm();
    if (fuelProvider.id !== undefined) {
      this.subscribeToSaveResponse(this.fuelProviderService.update(fuelProvider));
    } else {
      this.subscribeToSaveResponse(this.fuelProviderService.create(fuelProvider));
    }
  }

  resetLogo() {
    this.editForm.patchValue({
      logoUrl: null,
      logo: null
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFuelProvider>>) {
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

  private createFromForm(): IFuelProvider {
    return {
      ...new FuelProvider(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      logoContentType: this.editForm.get(['logoContentType']).value,
      logo: this.editForm.get(['logo']).value
    };
  }
}
