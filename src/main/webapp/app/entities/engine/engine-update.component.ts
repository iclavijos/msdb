import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IEngine, Engine } from 'app/shared/model/engine.model';
import { EngineService } from './engine.service';

@Component({
  selector: 'jhi-engine-update',
  templateUrl: './engine-update.component.html'
})
export class EngineUpdateComponent implements OnInit {
  isSaving: boolean;

  options: Observable<IEngine[]>;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    manufacturer: [null, [Validators.required, Validators.maxLength(50)]],
    capacity: [null, [Validators.required]],
    architecture: [null, [Validators.required, Validators.maxLength(10)]],
    debutYear: [null, [Validators.required]],
    petrolEngine: [],
    dieselEngine: [],
    electricEngine: [],
    otherEngine: [],
    turbo: [],
    image: [],
    imageContentType: [],
    imageUrl: [],
    derivedFrom: [],
    rebranded: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected engineService: EngineService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;

    this.options = this.editForm.get('derivedFrom').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value !== 'object' && value !== null) {
          return this.engineService.typeahead(value);
        }
      }),
      map(response => response.body)
    );

    this.activatedRoute.data.subscribe(({ engine }) => {
      this.updateForm(engine);
    });
  }

  displayFn(engine?: IEngine): string | undefined {
    return engine ? engine.manufacturer + ' ' + engine.name : undefined;
  }

  updateForm(engine: IEngine) {
    this.editForm.patchValue({
      id: engine.id,
      name: engine.name,
      manufacturer: engine.manufacturer,
      capacity: engine.capacity,
      architecture: engine.architecture,
      debutYear: engine.debutYear,
      petrolEngine: engine.petrolEngine,
      dieselEngine: engine.dieselEngine,
      electricEngine: engine.electricEngine,
      otherEngine: engine.otherEngine,
      turbo: engine.turbo,
      image: engine.image,
      imageContentType: engine.imageContentType,
      imageUrl: engine.imageUrl,
      derivedFrom: engine.derivedFrom,
      rebranded: engine.rebranded
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
    const engine = this.createFromForm();
    if (engine.id !== undefined) {
      this.subscribeToSaveResponse(this.engineService.update(engine));
    } else {
      this.subscribeToSaveResponse(this.engineService.create(engine));
    }
  }

  private createFromForm(): IEngine {
    return {
      ...new Engine(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      manufacturer: this.editForm.get(['manufacturer']).value,
      capacity: this.editForm.get(['capacity']).value,
      architecture: this.editForm.get(['architecture']).value,
      debutYear: this.editForm.get(['debutYear']).value,
      petrolEngine: this.editForm.get(['petrolEngine']).value,
      dieselEngine: this.editForm.get(['dieselEngine']).value,
      electricEngine: this.editForm.get(['electricEngine']).value,
      otherEngine: this.editForm.get(['otherEngine']).value,
      turbo: this.editForm.get(['turbo']).value,
      imageContentType: this.editForm.get(['imageContentType']).value,
      image: this.editForm.get(['image']).value,
      imageUrl: this.editForm.get(['imageUrl']).value,
      derivedFrom: this.editForm.get(['derivedFrom']).value,
      rebranded: this.editForm.get(['rebranded']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEngine>>) {
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

  trackEngineById(index: number, item: IEngine) {
    return item.id;
  }

  switchPetrolEngine() {
    this.editForm.patchValue({ petrolEngine: !this.editForm.get('petrolEngine').value });
  }

  switchDieselEngine() {
    this.editForm.patchValue({ dieselEngine: !this.editForm.get('dieselEngine').value });
  }

  switchElectricEngine() {
    this.editForm.patchValue({ electricEngine: !this.editForm.get('electricEngine').value });
  }

  switchOtherEngine() {
    this.editForm.patchValue({ otherEngine: !this.editForm.get('otherEngine').value });
  }

  switchTurbo() {
    this.editForm.patchValue({ turbo: !this.editForm.get('turbo').value });
  }

  switchRebranded() {
    this.editForm.patchValue({ rebranded: !this.editForm.get('rebranded').value });
  }
}
