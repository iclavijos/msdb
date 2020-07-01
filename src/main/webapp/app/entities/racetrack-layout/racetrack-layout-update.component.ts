import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IRacetrackLayout, RacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';
import { IRacetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from 'app/entities/racetrack/racetrack.service';

@Component({
  selector: 'jhi-racetrack-layout-update',
  templateUrl: './racetrack-layout-update.component.html'
})
export class RacetrackLayoutUpdateComponent implements OnInit {
  isSaving: boolean;

  private racetrack: IRacetrack;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    length: [null, [Validators.required, Validators.min(0)]],
    yearFirstUse: [null, [Validators.required, Validators.min(1900), Validators.max(2050)]],
    layoutImage: [],
    layoutImageContentType: [],
    layoutImageUrl: [],
    active: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected racetrackLayoutService: RacetrackLayoutService,
    protected racetrackService: RacetrackService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ racetrackLayout }) => {
      this.updateForm(racetrackLayout);
      if (!racetrackLayout.racetrack) {
        this.activatedRoute.data.subscribe(({ racetrack }) => {
          this.racetrack = racetrack;
        });
      } else {
        this.racetrack = racetrackLayout.racetrack;
      }
    });
  }

  updateForm(racetrackLayout: IRacetrackLayout) {
    this.editForm.patchValue({
      id: racetrackLayout.id,
      name: racetrackLayout.name,
      length: racetrackLayout.length,
      yearFirstUse: racetrackLayout.yearFirstUse,
      layoutImage: racetrackLayout.layoutImage,
      layoutImageContentType: racetrackLayout.layoutImageContentType,
      layoutImageUrl: racetrackLayout.layoutImageUrl,
      active: racetrackLayout.active
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
    const racetrackLayout = this.createFromForm();
    if (racetrackLayout.id !== undefined) {
      this.subscribeToSaveResponse(this.racetrackLayoutService.update(racetrackLayout));
    } else {
      this.subscribeToSaveResponse(this.racetrackLayoutService.create(racetrackLayout));
    }
  }

  private createFromForm(): IRacetrackLayout {
    return {
      ...new RacetrackLayout(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      length: this.editForm.get(['length']).value,
      yearFirstUse: this.editForm.get(['yearFirstUse']).value,
      layoutImageContentType: this.editForm.get(['layoutImageContentType']).value,
      layoutImage: this.editForm.get(['layoutImage']).value,
      layoutImageUrl: this.editForm.get(['layoutImageUrl']).value,
      active: this.editForm.get(['active']).value,
      racetrack: this.racetrack
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRacetrackLayout>>) {
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

  trackRacetrackById(index: number, item: IRacetrack) {
    return item.id;
  }

  switchActive() {
    this.editForm.patchValue({
      active: !this.editForm.get(['active']).value
    });
  }
}
