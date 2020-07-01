import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IRacetrack, Racetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';

@Component({
  selector: 'jhi-racetrack-update',
  templateUrl: './racetrack-update.component.html'
})
export class RacetrackUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    location: [null, [Validators.required, Validators.maxLength(100)]],
    countryCode: [],
    timeZone: [],
    logo: [],
    logoContentType: [],
    logoUrl: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected racetrackService: RacetrackService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ racetrack }) => {
      this.updateForm(racetrack);
    });
  }

  updateForm(racetrack: IRacetrack) {
    this.editForm.patchValue({
      id: racetrack.id,
      name: racetrack.name,
      location: racetrack.location,
      countryCode: racetrack.countryCode,
      timeZone: racetrack.timeZone,
      logo: racetrack.logo,
      logoUrl: racetrack.logoUrl,
      logoContentType: racetrack.logoContentType
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
      () => {}, // success
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
    const racetrack = this.createFromForm();
    if (racetrack.id !== undefined) {
      this.subscribeToSaveResponse(this.racetrackService.update(racetrack));
    } else {
      this.subscribeToSaveResponse(this.racetrackService.create(racetrack));
    }
  }

  private createFromForm(): IRacetrack {
    return {
      ...new Racetrack(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      location: this.editForm.get(['location']).value,
      countryCode: this.editForm.get(['countryCode']).value,
      timeZone: this.editForm.get(['timeZone']).value,
      logoContentType: this.editForm.get(['logoContentType']).value,
      logo: this.editForm.get(['logo']).value,
      logoUrl: this.editForm.get(['logoUrl']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRacetrack>>) {
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

  resetLogo() {
    this.editForm.patchValue({
      logoUrl: null,
      logo: null
    });
  }
}
