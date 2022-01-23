import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, finalize, map, tap, startWith, distinctUntilChanged } from 'rxjs/operators';

import { IEngine, Engine } from '../engine.model';
import { EngineService } from '../service/engine.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-engine-update',
  templateUrl: './engine-update.component.html',
})
export class EngineUpdateComponent implements OnInit {
  isSaving = false;
  isLoading = false;

  options!: Observable<IEngine[]>;

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
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected engineService: EngineService,
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
          return this.engineService.query({
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
      map(response => response.body as IEngine[])
    );

    this.activatedRoute.data.subscribe(({ engine }) => {
      this.updateForm(engine);
    });
  }

  displayFn(engine?: IEngine): string {
    return engine ? `${engine.manufacturer as string} ${engine.name as string}` : '';
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
    const engine = this.createFromForm();
    if (engine.id !== undefined) {
      this.subscribeToSaveResponse(this.engineService.update(engine));
    } else {
      this.subscribeToSaveResponse(this.engineService.create(engine));
    }
  }

  trackEngineById(index: number, item: IEngine): number {
    return item.id!;
  }

  switchPetrolEngine(): void {
    this.editForm.patchValue({ petrolEngine: !this.editForm.get('petrolEngine')!.value });
  }

  switchDieselEngine(): void {
    this.editForm.patchValue({ dieselEngine: !this.editForm.get('dieselEngine')!.value });
  }

  switchElectricEngine(): void {
    this.editForm.patchValue({ electricEngine: !this.editForm.get('electricEngine')!.value });
  }

  switchOtherEngine(): void {
    this.editForm.patchValue({ otherEngine: !this.editForm.get('otherEngine')!.value });
  }

  switchTurbo(): void {
    this.editForm.patchValue({ turbo: !this.editForm.get('turbo')!.value });
  }

  switchRebranded(): void {
    this.editForm.patchValue({ rebranded: !this.editForm.get('rebranded')!.value });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEngine>>): void {
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

  protected updateForm(engine: IEngine): void {
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

  protected createFromForm(): IEngine {
    return {
      ...new Engine(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      manufacturer: this.editForm.get(['manufacturer'])!.value,
      capacity: this.editForm.get(['capacity'])!.value,
      architecture: this.editForm.get(['architecture'])!.value,
      debutYear: this.editForm.get(['debutYear'])!.value,
      petrolEngine: this.editForm.get(['petrolEngine'])!.value,
      dieselEngine: this.editForm.get(['dieselEngine'])!.value,
      electricEngine: this.editForm.get(['electricEngine'])!.value,
      otherEngine: this.editForm.get(['otherEngine'])!.value,
      turbo: this.editForm.get(['turbo'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      imageUrl: this.editForm.get(['imageUrl'])!.value,
      derivedFrom: this.editForm.get(['derivedFrom'])!.value,
      rebranded: this.editForm.get(['rebranded'])!.value
    };
  }
}
