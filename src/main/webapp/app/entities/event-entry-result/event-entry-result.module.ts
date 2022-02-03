import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventEntryResultComponent } from './list/event-entry-result.component';
import { EventEntryResultUpdateComponent } from './update/event-entry-result-update.component';
import { EventEntryUploadResultsComponent } from './upload/event-entry-result-upload.component';
import { EventEntryResultUploadLapByLapComponent } from './upload/event-entry-result-upload-lapbylap.component';
import { EventEntryResultDeleteDialogComponent } from './delete/event-entry-result-delete-dialog.component';
import { EventEntryResultRoutingModule } from './route/event-entry-result-routing.module';

@NgModule({
  imports: [SharedModule, EventEntryResultRoutingModule],
  declarations: [
    EventEntryResultComponent,
    EventEntryResultUpdateComponent,
    EventEntryResultDeleteDialogComponent,
    EventEntryUploadResultsComponent,
    EventEntryResultUploadLapByLapComponent
  ],
  exports: [EventEntryResultComponent],
  entryComponents: [EventEntryResultDeleteDialogComponent],
})
export class EventEntryResultModule {}
