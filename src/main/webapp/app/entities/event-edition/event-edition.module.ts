import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { MotorsportsDatabaseStandingsModule } from '../standings/standings.module';
import { EventEditionComponent } from './event-edition.component';
import { EventEditionDetailComponent, RescheduleDialogComponent } from './event-edition-detail.component';
import { EventEditionCopyEntriesDialogComponent } from './event-edition-copy-entries-dialog.component';
import { EventEditionUpdateComponent } from './event-edition-update.component';
import { EventEditionDeletePopupComponent, EventEditionDeleteDialogComponent } from './event-edition-delete-dialog.component';
import { EventEditionCloneDialogComponent } from './event-edition-clone-dialog.component';
import { eventEditionRoute, eventEditionPopupRoute } from './event-edition.route';

import { MotorsportsDatabaseEventSessionModule } from '../event-session/event-session.module';
import { MotorsportsDatabaseEventEntryModule } from '../event-entry/event-entry.module';
import { MotorsportsDatabaseEventEntryResultModule } from '../event-entry-result/event-entry-result.module';
import { MotorsportsDatabaseLapsAnalysisModule } from '../laps-analysis/laps-analysis.module';

const ENTITY_STATES = [...eventEditionRoute, ...eventEditionPopupRoute];

@NgModule({
  imports: [
    SharedModule,
    MotorsportsDatabaseStandingsModule,
    MotorsportsDatabaseEventSessionModule,
    MotorsportsDatabaseEventEntryModule,
    MotorsportsDatabaseEventEntryResultModule,
    MotorsportsDatabaseLapsAnalysisModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [
    EventEditionComponent,
    EventEditionDetailComponent,
    EventEditionUpdateComponent,
    EventEditionCopyEntriesDialogComponent,
    EventEditionDeleteDialogComponent,
    EventEditionDeletePopupComponent,
    EventEditionCloneDialogComponent,
    RescheduleDialogComponent
  ],
  exports: [EventEditionComponent]
})
export class MotorsportsDatabaseEventEditionModule {}
