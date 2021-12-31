import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IChassis, Chassis } from '../../shared/model/chassis.model';
import { ChassisService } from './chassis.service';

@Component({
  selector: 'jhi-chassis-update',
  templateUrl: './chassis-update.component.html'
})
export class ChassisUpdateComponent implements OnInit {
  isSaving: boolean;

  options: Observable<IChassis[]>;

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
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected chassisService: ChassisService,
    protected activatedRoute: ActivatedRoute,
    protected elementRef: ElementRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.displayFn = this.displayFn.bind(this);
    this.isSaving = false;

    this.options = this.editForm.get('derivedFrom').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value !== 'object' && value !== null) {
          return this.chassisService.typeahead(value);
        }
      }),
      map(response => response.body)
    );

    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.updateForm(chassis);
    });
  }

  displayFn(chassis?: IChassis): string | undefined {
    return chassis ? chassis.manufacturer + ' ' + chassis.name : undefined;
  }

  updateForm(chassis: IChassis) {
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
      derivedFrom: this.editForm.get(['derivedFrom']).value,
      rebranded: this.editForm.get(['rebranded']).value,
      image: this.editForm.get(['image']).value,
      imageContentType: this.editForm.get(['imageContentType']).value,
      imageUrl: this.editForm.get(['imageUrl']).value
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

  switchRebranded() {
    this.editForm.patchValue({ rebranded: !this.editForm.get('rebranded').value });
  }
}
