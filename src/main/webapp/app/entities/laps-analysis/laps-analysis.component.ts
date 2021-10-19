import { Component, OnInit, Input } from '@angular/core';

import { EventSessionService } from '../event-session/event-session.service';
import { EventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession } from 'app/shared/model/event-session.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';

@Component({
  selector: 'jhi-laps-analysis',
  templateUrl: './laps-analysis.component.html',
  styleUrls: ['lapsAnalysis.scss']
})
export class LapsAnalysisComponent implements OnInit {
  @Input() eventEdition: EventEdition;
  @Input() eventSessions: IEventSession[];
  @Input() eventEntries: IEventEntry[];
  races: IEventSession[] = [];

  constructor(private eventSessionService: EventSessionService) {}

  ngOnInit() {
    this.eventSessions.forEach(session => {
      this.eventSessionService.hasLapsData(session.id).subscribe(res => {
        if (res) {
          this.races.push(session);
          this.races.sort((a, b) => (a.sessionStartTime > b.sessionStartTime ? 1 : -1));
        }
      });
    });
  }
}
