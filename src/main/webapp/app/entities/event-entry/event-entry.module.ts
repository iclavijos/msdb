import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { EventEntryComponent } from './event-entry.component';
import { EventEntryUpdateComponent } from './event-entry-update.component';
import { EventEntryDeleteDialogComponent } from './event-entry-delete-dialog.component';
import { eventEntryRoute, eventEntryPopupRoute } from './event-entry.route';

const ENTITY_STATES = [...eventEntryRoute, ...eventEntryPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EventEntryComponent,
    EventEntryUpdateComponent,
    EventEntryDeleteDialogComponent
    //     EventEntryDeletePopupComponent
  ],
  exports: [EventEntryComponent],
  entryComponents: [EventEntryUpdateComponent, EventEntryDeleteDialogComponent]
})
export class MotorsportsDatabaseEventEntryModule {}
