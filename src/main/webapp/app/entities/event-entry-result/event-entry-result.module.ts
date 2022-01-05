import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventEntryResultComponent } from './list/event-entry-result.component';
import { EventEntryResultDetailComponent } from './detail/event-entry-result-detail.component';
import { EventEntryResultUpdateComponent } from './update/event-entry-result-update.component';
import { EventEntryResultDeleteDialogComponent } from './delete/event-entry-result-delete-dialog.component';
import { EventEntryResultRoutingModule } from './route/event-entry-result-routing.module';

@NgModule({
  imports: [SharedModule, EventEntryResultRoutingModule],
  declarations: [
    EventEntryResultComponent,
    EventEntryResultDetailComponent,
    EventEntryResultUpdateComponent,
    EventEntryResultDeleteDialogComponent,
  ],
  entryComponents: [EventEntryResultDeleteDialogComponent],
})
export class EventEntryResultModule {}
