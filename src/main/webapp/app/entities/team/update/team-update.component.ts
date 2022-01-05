import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITeam, Team } from '../team.model';
import { TeamService } from '../service/team.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IEventEntry } from 'app/entities/event-entry/event-entry.model';
import { EventEntryService } from 'app/entities/event-entry/service/event-entry.service';

@Component({
  selector: 'jhi-team-update',
  templateUrl: './team-update.component.html',
})
export class TeamUpdateComponent implements OnInit {
  isSaving = false;

  eventEntriesSharedCollection: IEventEntry[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(40)]],
    description: [null, [Validators.maxLength(100)]],
    hqLocation: [null, [Validators.maxLength(100)]],
    logo: [],
    logoContentType: [],
    participations: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected teamService: TeamService,
    protected eventEntryService: EventEntryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ team }) => {
      this.updateForm(team);

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
    const team = this.createFromForm();
    if (team.id !== undefined) {
      this.subscribeToSaveResponse(this.teamService.update(team));
    } else {
      this.subscribeToSaveResponse(this.teamService.create(team));
    }
  }

  trackEventEntryById(index: number, item: IEventEntry): number {
    return item.id!;
  }

  getSelectedEventEntry(option: IEventEntry, selectedVals?: IEventEntry[]): IEventEntry {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeam>>): void {
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

  protected updateForm(team: ITeam): void {
    this.editForm.patchValue({
      id: team.id,
      name: team.name,
      description: team.description,
      hqLocation: team.hqLocation,
      logo: team.logo,
      logoContentType: team.logoContentType,
      participations: team.participations,
    });

    this.eventEntriesSharedCollection = this.eventEntryService.addEventEntryToCollectionIfMissing(
      this.eventEntriesSharedCollection,
      ...(team.participations ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.eventEntryService
      .query()
      .pipe(map((res: HttpResponse<IEventEntry[]>) => res.body ?? []))
      .pipe(
        map((eventEntries: IEventEntry[]) =>
          this.eventEntryService.addEventEntryToCollectionIfMissing(eventEntries, ...(this.editForm.get('participations')!.value ?? []))
        )
      )
      .subscribe((eventEntries: IEventEntry[]) => (this.eventEntriesSharedCollection = eventEntries));
  }

  protected createFromForm(): ITeam {
    return {
      ...new Team(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      hqLocation: this.editForm.get(['hqLocation'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      participations: this.editForm.get(['participations'])!.value,
    };
  }
}
