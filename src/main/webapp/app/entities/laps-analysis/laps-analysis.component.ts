import { Component, OnInit, Input } from '@angular/core';

import { EventEditionService } from '../event-edition/event-edition.service';
import { EventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession } from 'app/shared/model/event-session.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

@Component({
  selector: 'jhi-laps-analysis',
  templateUrl: './laps-analysis.component.html',
  styleUrls: ['lapsAnalysis.scss']
})
export class LapsAnalysisComponent implements OnInit {
  @Input() eventEdition: EventEdition;
  @Input() eventSessions: IEventSession[];
  @Input() eventEntries: IEventEntry[];
  races: IEventSession[];

  constructor(private eventEditionService: EventEditionService) {}

  ngOnInit() {
    this.races = this.eventSessions.filter(
      session => session.sessionType === SessionType.race || session.sessionType === SessionType.qualifyingRace
    );
  }
}
