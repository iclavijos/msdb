import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { EventSessionComponent } from './event-session.component';
import { EventSessionUpdateComponent } from './event-session-update.component';
import { EventSessionDeleteDialogComponent } from './event-session-delete-dialog.component';
import { eventSessionRoute } from './event-session.route';

const ENTITY_STATES = [...eventSessionRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [EventSessionComponent, EventSessionUpdateComponent, EventSessionDeleteDialogComponent],
  exports: [EventSessionComponent],
  entryComponents: [EventSessionDeleteDialogComponent, EventSessionUpdateComponent]
})
export class MotorsportsDatabaseEventSessionModule {}
