import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

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

  enginesSharedCollection: IEngine[] = [];

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
    turbo: [],
    image: [],
    imageContentType: [],
    derivedFrom: [],
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
    this.activatedRoute.data.subscribe(({ engine }) => {
      this.updateForm(engine);

      this.loadRelationshipsOptions();
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
      turbo: engine.turbo,
      image: engine.image,
      imageContentType: engine.imageContentType,
      derivedFrom: engine.derivedFrom,
    });

    this.enginesSharedCollection = this.engineService.addEngineToCollectionIfMissing(this.enginesSharedCollection, engine.derivedFrom);
  }

  protected loadRelationshipsOptions(): void {
    this.engineService
      .query()
      .pipe(map((res: HttpResponse<IEngine[]>) => res.body ?? []))
      .pipe(
        map((engines: IEngine[]) => this.engineService.addEngineToCollectionIfMissing(engines, this.editForm.get('derivedFrom')!.value))
      )
      .subscribe((engines: IEngine[]) => (this.enginesSharedCollection = engines));
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
      turbo: this.editForm.get(['turbo'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      derivedFrom: this.editForm.get(['derivedFrom'])!.value,
    };
  }
}
