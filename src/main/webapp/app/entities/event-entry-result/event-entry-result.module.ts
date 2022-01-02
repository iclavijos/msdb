import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { EventEntryResultComponent } from './event-entry-result.component';
import { EventEntryResultUpdateComponent } from './event-entry-result-update.component';
import { EventEntryUploadResultsComponent } from './event-entry-result-upload.component';
import { EventEntryResultUploadLapByLapComponent } from './event-entry-result-upload-lapbylap.component';
import { EventEntryResultDeleteDialogComponent } from './event-entry-result-delete-dialog.component';
import { eventEntryResultRoute, eventEntryResultPopupRoute } from './event-entry-result.route';

const ENTITY_STATES = [...eventEntryResultRoute, ...eventEntryResultPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EventEntryResultComponent,
    EventEntryResultUpdateComponent,
    EventEntryUploadResultsComponent,
    EventEntryResultUploadLapByLapComponent,
    EventEntryResultDeleteDialogComponent
  ],
  exports: [EventEntryResultComponent]
})
export class MotorsportsDatabaseEventEntryResultModule {}
