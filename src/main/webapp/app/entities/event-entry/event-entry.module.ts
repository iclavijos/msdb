import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { EventEntryComponent } from './event-entry.component';
import { EventEntryDetailComponent } from './event-entry-detail.component';
import { EventEntryUpdateComponent } from './event-entry-update.component';
import { EventEntryDeletePopupComponent, EventEntryDeleteDialogComponent } from './event-entry-delete-dialog.component';
import { eventEntryRoute, eventEntryPopupRoute } from './event-entry.route';

const ENTITY_STATES = [...eventEntryRoute, ...eventEntryPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EventEntryComponent,
    EventEntryDetailComponent,
    EventEntryUpdateComponent,
    EventEntryDeleteDialogComponent,
    EventEntryDeletePopupComponent
  ],
  entryComponents: [EventEntryDeleteDialogComponent]
})
export class MotorsportsDatabaseEventEntryModule {}
