import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { ITyreProvider, TyreProvider } from 'app/shared/model/tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';

@Component({
  selector: 'jhi-tyre-provider-update',
  templateUrl: './tyre-provider-update.component.html'
})
export class TyreProviderUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    logo: [],
    logoContentType: [],
    logoUrl: [],
    letterColor: [null, [Validators.required]],
    backgroundColor: [null, [Validators.required]]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected tyreProviderService: TyreProviderService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ tyreProvider }) => {
      this.updateForm(tyreProvider);
    });
  }

  updateForm(tyreProvider: ITyreProvider) {
    this.editForm.patchValue({
      id: tyreProvider.id,
      name: tyreProvider.name,
      logo: tyreProvider.logo,
      logoContentType: tyreProvider.logoContentType,
      logoUrl: tyreProvider.logoUrl,
      letterColor: tyreProvider.letterColor,
      backgroundColor: tyreProvider.backgroundColor
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
      if (event && event.target && event.target.files && event.target.files[0]) {
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
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      // eslint-disable-next-line no-console
      () => console.log('blob added'), // success
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
    const tyreProvider = this.createFromForm();
    if (tyreProvider.id !== undefined) {
      this.subscribeToSaveResponse(this.tyreProviderService.update(tyreProvider));
    } else {
      this.subscribeToSaveResponse(this.tyreProviderService.create(tyreProvider));
    }
  }

  private createFromForm(): ITyreProvider {
    return {
      ...new TyreProvider(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      logoContentType: this.editForm.get(['logoContentType']).value,
      logo: this.editForm.get(['logo']).value,
      logoUrl: this.editForm.get(['logoUrl']).value,
      letterColor: this.editForm.get(['letterColor']).value,
      backgroundColor: this.editForm.get(['backgroundColor']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITyreProvider>>) {
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
}
