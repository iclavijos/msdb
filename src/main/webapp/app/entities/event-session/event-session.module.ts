import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { EventSessionComponent } from './event-session.component';
import { EventSessionDetailComponent } from './event-session-detail.component';
import { EventSessionUpdateComponent } from './event-session-update.component';
import { EventSessionDeletePopupComponent, EventSessionDeleteDialogComponent } from './event-session-delete-dialog.component';
import { eventSessionRoute, eventSessionPopupRoute } from './event-session.route';

const ENTITY_STATES = [...eventSessionRoute, ...eventSessionPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EventSessionComponent,
    EventSessionDetailComponent,
    EventSessionUpdateComponent,
    EventSessionDeleteDialogComponent,
    EventSessionDeletePopupComponent
  ],
  exports: [EventSessionComponent],
  entryComponents: [EventSessionDeleteDialogComponent]
})
export class MotorsportsDatabaseEventSessionModule {}
