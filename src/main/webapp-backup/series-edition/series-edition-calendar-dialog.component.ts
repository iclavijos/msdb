import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';

import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operator/map';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { _catch } from 'rxjs/operator/catch';
import { _do } from 'rxjs/operator/do';
import { switchMap } from 'rxjs/operator/switchMap';
import { of } from 'rxjs/observable/of';

import { EventEdition, EventEditionService } from '../event-edition/';
import { EventSession } from '../event-session/';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionPopupService } from './series-edition-popup.service';
import { SeriesEditionService } from './series-edition.service';

@Component({
  selector: 'jhi-series-edition-calendar-dialog',
  templateUrl: './series-edition-calendar-dialog.component.html'
})
export class SeriesEditionCalendarDialogComponent implements OnInit {
  private seriesEdition: SeriesEdition;
  eventEdition: EventEdition;
  isSaving: boolean;
  searching = false;
  searchFailed = false;

  public myForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private seriesEditionService: SeriesEditionService,
    private eventEditionService: EventEditionService,
    private alertService: JhiAlertService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.myForm = this._fb.group({
      eventSearch: new FormControl(),
      races: this._fb.array([])
    });
    if (this.eventEdition) {
      this.updateUI();
    }
  }

  initSession(session: EventSession) {
    let pSystemAss = '';
    let psMult = 1;

    if (session.pointsSystemsSession !== undefined && session.pointsSystemsSession.length > 0) {
      const pSystem = session.pointsSystemsSession.filter(pss => pss.id.seriesEditionId === this.seriesEdition.id);
      if (pSystem.length > 0) {
        pSystemAss = pSystem[0].pointsSystem.id;
        psMult = pSystem[0].psMultiplier;
      }
    }

    return this._fb.group({
      raceId: session.id,
      raceName: session.name,
      seriesId: this.seriesEdition.id,
      pSystemAssigned: pSystemAss,
      psMultiplier: psMult
    });
  }

  addRaces(races: EventSession[]) {
    const control = <FormArray>this.myForm.controls['races'];
    for (let race of races) {
      control.push(this.initSession(race));
    }
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.seriesEditionService
      .addEventToSeries(this.seriesEdition.id, this.eventEdition.id, this.myForm.value.races)
      .subscribe((res: any) => this.onSaveSuccess(res), (res: any) => this.onSaveError(res));
  }

  private onSaveSuccess(result: any) {
    this.eventManager.broadcast({ name: 'seriesEditionEventsListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError(error) {
    this.isSaving = false;
    this.onError(error);
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }

  private innersearch(term: string) {
    if (term === '') {
      return of.call([]);
    }

    return map.call(this.eventEditionService.typeAhead(term), response => response.json);
  }

  search = (text$: Observable<string>) =>
    _do.call(
      switchMap.call(_do.call(distinctUntilChanged.call(debounceTime.call(text$, 300)), () => (this.searching = true)), term =>
        _catch.call(_do.call(this.innersearch(term), () => (this.searchFailed = false)), () => {
          this.searchFailed = true;
          return of.call([]);
        })
      ),
      () => (this.searching = false)
    );

  inputFormatter = (result: any) => result.longEventName;

  onEventSelected(selected: any) {
    this.myForm = this._fb.group({
      eventSearch: new FormControl(),
      races: this._fb.array([])
    });
    if (selected) {
      this.eventEdition = selected.item;
      this.updateUI();
    } else {
      this.eventEdition = null;
    }
  }

  private updateUI() {
    this.eventEditionService
      .findNonFPSessions(this.eventEdition.id, this.eventEdition.trackLayout.racetrack.timeZone)
      .subscribe(eventSessions => {
        this.eventEdition.sessions = eventSessions.json;
        this.addRaces(eventSessions.json);
      });
  }
}

@Component({
  selector: 'jhi-series-edition-calendar-popup',
  template: ''
})
export class SeriesEditionCalendarPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(private route: ActivatedRoute, private seriesEditionPopupService: SeriesEditionPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['eventId']) {
        this.seriesEditionPopupService.openCalendar(SeriesEditionCalendarDialogComponent as Component, params['id'], params['eventId']);
      } else {
        this.seriesEditionPopupService.openCalendar(SeriesEditionCalendarDialogComponent as Component, params['id']);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
