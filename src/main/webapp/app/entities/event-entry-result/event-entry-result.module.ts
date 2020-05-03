import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { EventEntryResultComponent } from './event-entry-result.component';
// import { EventEntryResultDetailComponent } from './event-entry-result-detail.component';
// import { EventEntryResultUpdateComponent } from './event-entry-result-update.component';
// import { EventEntryResultDeletePopupComponent, EventEntryResultDeleteDialogComponent } from './event-entry-result-delete-dialog.component';
import { eventEntryResultRoute, eventEntryResultPopupRoute } from './event-entry-result.route';

const ENTITY_STATES = [...eventEntryResultRoute, ...eventEntryResultPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EventEntryResultComponent
    //     EventEntryResultDetailComponent,
    //     EventEntryResultUpdateComponent,
    //     EventEntryResultDeleteDialogComponent,
    //     EventEntryResultDeletePopupComponent
  ],
  exports: [EventEntryResultComponent]
  //   entryComponents: [EventEntryResultDeleteDialogComponent]
})
export class MotorsportsDatabaseEventEntryResultModule {}
